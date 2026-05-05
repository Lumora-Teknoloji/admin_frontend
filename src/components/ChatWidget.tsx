"use client";

import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  image_url?: string;
  image_urls?: string[];
  created_at: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, isOpen]);

  // Init Socket
  useEffect(() => {
    // CRITICAL: Socket.IO runs in the BROWSER, not in Docker.
    // NEXT_PUBLIC_API_URL is baked at build-time as "http://backend:8000/api" inside Docker,
    // which the browser cannot resolve. We must use the browser's own hostname.
    const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";
    const SOCKET_URL = `http://${hostname}:8000`;
    
    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to Chatbot Socket");
    });

    newSocket.on("guest_conversation_list", (data: any) => {
      if (data.conversations && data.conversations.length > 0) {
        const convId = data.conversations[0].id;
        setActiveConversationId(convId);
        // Request history for this conversation
        newSocket.emit("guest_get_conversation", { conversation_id: convId });
      } else {
        newSocket.emit("guest_new_conversation");
      }
    });

    newSocket.on("guest_conversation_created", (data: any) => {
      setActiveConversationId(data.id);
      setMessages([]);
    });

    newSocket.on("guest_conversation_data", (data: any) => {
      setActiveConversationId(data.conversation_id);
      if (data.messages) {
        setMessages(data.messages);
      }
    });

    newSocket.on("ai_message_chunk", (data: any) => {
      setIsTyping(false);
      setStreamingContent((prev) => prev + data.content);
    });

    newSocket.on("ai_message", (data: any) => {
      setIsTyping(false);
      setStreamingContent("");
      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          sender: "ai",
          content: data.content,
          image_urls: data.image_urls,
          created_at: data.created_at,
        },
      ]);
    });

    newSocket.on("error", (err: any) => {
      console.error("Socket error:", err);
      setIsTyping(false);
      setStreamingContent("");
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "ai",
          content: "Bir hata oluştu: " + (err.message || "Bilinmeyen hata"),
          created_at: new Date().toISOString(),
        },
      ]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !socket || !activeConversationId) return;

    const messageText = inputValue.trim();
    setInputValue("");
    
    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        content: messageText,
        created_at: new Date().toISOString(),
      },
    ]);
    
    setIsTyping(true);
    setStreamingContent("");

    socket.emit("user_message", {
      conversation_id: activeConversationId,
      message: messageText,
      generate_images: false,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-80 sm:w-96 h-[500px] flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-blue-600 dark:bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
            <div>
              <h3 className="font-semibold text-lg">Lumora Asistan</h3>
              <p className="text-xs text-blue-200">Trend & Veri Analisti</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-zinc-50 dark:bg-zinc-900 space-y-4">
            {messages.length === 0 && !isTyping && !streamingContent && (
              <div className="text-center text-zinc-400 mt-10 text-sm">
                Merhaba! Veritabanındaki ürünler veya trendler hakkında ne öğrenmek istersiniz?
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none border border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                  {msg.image_urls && msg.image_urls.map((img, i) => (
                    <img key={i} src={img} alt="AI Generated" className="mt-2 rounded-lg w-full" />
                  ))}
                </div>
              </div>
            ))}

            {/* Streaming Message Box */}
            {streamingContent && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl p-3 text-sm shadow-sm bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none border border-zinc-200 dark:border-zinc-700">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{streamingContent}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {isTyping && !streamingContent && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-700 rounded-bl-none">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-end gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Mesajınızı yazın..."
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[40px] py-2 px-3 text-sm dark:text-white"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="p-2 mb-1 mr-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 text-white rotate-90"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
}
