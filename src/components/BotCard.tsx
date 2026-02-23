"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit2, Pause, AlertTriangle, Link as LinkIcon, Activity, Settings, Save, X, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Bot, BotSettingsUpdate } from "@/services/botApi";

interface BotCardProps {
    bot: Bot;
    onStart: (id: number) => Promise<void>;
    onWorkerStart: (id: number) => Promise<void>;
    onStop: (id: number) => Promise<void>;
    onUpdate: (id: number, settings: BotSettingsUpdate) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

// Helper: Compute status info deterministically
function getStatusInfo(bot: Bot) {
    if (bot.is_critical) {
        return {
            color: 'red',
            badgeClass: "bg-red-500/10 text-red-500 border-red-500/20 ring-red-500/20",
            glowColor: 'rgba(239, 68, 68, 0.4)',
            label: "KRİTİK HATA",
            iconType: 'alert' as const,
            viaColor: 'via-red-500'
        };
    }

    switch (bot.status) {
        case 'running':
            return {
                color: 'emerald',
                badgeClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 ring-emerald-500/20 animate-pulse-subtle",
                glowColor: 'rgba(16, 185, 129, 0.4)',
                label: "SİSTEM AKTİF",
                iconType: 'pulse' as const,
                viaColor: 'via-emerald-500'
            };
        case 'worker_running':
            return {
                color: 'amber',
                badgeClass: "bg-amber-500/10 text-amber-500 border-amber-500/20 ring-amber-500/20 animate-pulse-subtle",
                glowColor: 'rgba(245, 158, 11, 0.4)',
                label: "İŞLENİYOR",
                iconType: 'activity' as const,
                viaColor: 'via-amber-500'
            };
        case 'idle':
            return {
                color: 'indigo',
                badgeClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 ring-indigo-500/20",
                glowColor: 'rgba(99, 102, 241, 0.4)',
                label: "BEKLENİYOR",
                iconType: 'pause' as const,
                viaColor: 'via-indigo-500'
            };
        case 'error':
            return {
                color: 'red',
                badgeClass: "bg-red-500/10 text-red-500 border-red-500/20 ring-red-500/20",
                glowColor: 'rgba(239, 68, 68, 0.4)',
                label: "HATA OLUŞTU",
                iconType: 'alert' as const,
                viaColor: 'via-red-500'
            };
        default:
            return {
                color: 'slate',
                badgeClass: "bg-gray-500/10 text-gray-500 border-gray-500/20 ring-gray-500/20",
                glowColor: 'rgba(148, 163, 184, 0.2)',
                label: "PASİF / OFFLINE",
                iconType: 'x' as const,
                viaColor: 'via-slate-500'
            };
    }
}

// Stable status icon component
function StatusIcon({ type }: { type: 'alert' | 'pulse' | 'activity' | 'pause' | 'x' }) {
    switch (type) {
        case 'alert': return <AlertTriangle className="h-2.5 w-2.5" />;
        case 'pulse': return <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block flex-shrink-0" />;
        case 'activity': return <Activity className="h-2.5 w-2.5" />;
        case 'pause': return <Pause className="h-2.5 w-2.5" />;
        case 'x': return <X className="h-2.5 w-2.5" />;
    }
}

export function BotCard({ bot, onStart, onWorkerStart, onStop, onUpdate, onDelete }: BotCardProps) {
    const router = useRouter();
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/bot-admin';
    const [isEditing, setIsEditing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);

    // Computed values
    const statusInfo = useMemo(() => getStatusInfo(bot), [bot.status, bot.is_critical]);
    const isRunning = bot.status === 'running' || bot.status === 'worker_running';

    useEffect(() => {
        if (pendingStatus && (bot.status === pendingStatus || (pendingStatus === 'stopped' && bot.status === 'idle'))) {
            setPendingStatus(null);
            setIsProcessing(false);
        }
    }, [bot.status, pendingStatus]);

    const handleNavigateToLogs = useCallback(() => {
        router.push(`/logs?filter=${encodeURIComponent(bot.name)}`);
    }, [router, bot.name]);

    // Editable state
    const [keyword, setKeyword] = useState(bot.keyword);
    const [startTime, setStartTime] = useState(bot.start_time);
    const [endTime, setEndTime] = useState(bot.end_time);
    const [pageLimit, setPageLimit] = useState(bot.page_limit);

    // Message History State
    const [messageHistory, setMessageHistory] = useState<{ message: string; url: string }[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bot.last_message) {
            const currentUrl = bot.last_product_url || (bot.keyword ? `https://www.trendyol.com/sr?q=${encodeURIComponent(bot.keyword)}` : "");

            setMessageHistory(prev => {
                const lastEntry = prev[prev.length - 1];
                if (!lastEntry || lastEntry.message !== bot.last_message || lastEntry.url !== currentUrl) {
                    const newHistory = [...prev, { message: bot.last_message || "Bot hazır.", url: currentUrl }];
                    return newHistory.slice(-10);
                }
                return prev;
            });
        }
    }, [bot.last_message, bot.last_product_url, bot.keyword]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messageHistory]);

    const handleSave = async () => {
        setIsProcessing(true);
        try {
            await onUpdate(bot.id, {
                keyword,
                start_time: startTime,
                end_time: endTime,
                page_limit: pageLimit,
                is_active: true
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save settings:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancel = () => {
        setKeyword(bot.keyword);
        setStartTime(bot.start_time);
        setEndTime(bot.end_time);
        setPageLimit(bot.page_limit);
        setIsEditing(false);
    };

    const handleToggleStatus = async () => {
        if (isEditing) {
            await handleSave();
        }

        const targetStatus = isRunning ? "stopped" : "running";
        setIsProcessing(true);
        setPendingStatus(targetStatus);

        try {
            if (isRunning) {
                await onStop(bot.id);
            } else {
                await onStart(bot.id);
            }
        } catch (error) {
            console.error("Failed to toggle status:", error);
            setIsProcessing(false);
            setPendingStatus(null);
        }
    };

    const handleWorkerStart = async () => {
        setIsProcessing(true);
        setPendingStatus("worker_running");
        try {
            await onWorkerStart(bot.id);
        } catch (error) {
            console.error("Failed to start worker:", error);
            setIsProcessing(false);
            setPendingStatus(null);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`${bot.name} botunu ve tüm geçmişini silmek istediğinize emin misiniz?`)) {
            setIsProcessing(true);
            try {
                await onDelete(bot.id);
            } catch (error) {
                console.error("Failed to delete bot:", error);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    // Button text
    const buttonText = useMemo(() => {
        if (isProcessing) {
            if (pendingStatus === 'stopped') return "DURDURULUYOR...";
            if (pendingStatus === 'worker_running') return "BAŞLATILIYOR...";
            return "İŞLENİYOR...";
        }
        if (bot.status === "running") return "DURDUR";
        if (bot.status === "worker_running") return `DURDUR (KALAN: ${bot.pending_links})`;
        return "BAŞLAT";
    }, [isProcessing, pendingStatus, bot.status, bot.pending_links]);

    const showPauseIcon = !isProcessing && isRunning;

    const statsData = useMemo(() => [
        { label: "KAZILAN ÜRÜN", value: bot.stats.scraped, color: "text-white", Icon: LinkIcon, hoverColor: "group-hover:text-blue-400" },
        { label: "HIZ / DK", value: bot.stats.validated, color: "text-white", Icon: Activity, hoverColor: "group-hover:text-amber-400" },
        { label: "HATALAR", value: bot.stats.errors, color: "text-red-500", Icon: AlertTriangle, action: handleNavigateToLogs, hoverBorder: "hover:border-red-500/50" },
        { label: "KUYRUK", value: bot.pending_links, color: "text-amber-500", Icon: Layers, hoverColor: "group-hover:text-amber-400" }
    ], [bot.stats.scraped, bot.stats.validated, bot.stats.errors, bot.pending_links, handleNavigateToLogs]);

    return (
        <div className="group relative">
            {/* Ambient Back Glow */}
            <div
                className="absolute -inset-0.5 rounded-2xl opacity-20 blur-xl transition-all duration-1000 group-hover:opacity-40 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${statusInfo.glowColor} 0%, transparent 70%)` }}
            />

            {/* Main Card Container */}
            <div className="glass-panel glass-panel-hover relative overflow-hidden rounded-xl p-5 transition-all duration-300 transform hover:scale-[1.01]">

                {/* Status Border Line (Top) */}
                <div className={cn(
                    "absolute top-0 inset-x-0 h-[2px] opacity-60 pointer-events-none",
                    "bg-gradient-to-r from-transparent via-transparent to-transparent opacity-0", // base
                    statusInfo.viaColor && `bg-gradient-to-r from-transparent ${statusInfo.viaColor} to-transparent opacity-60`
                )} />

                {/* Header Section */}
                <div className="relative mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                {/* Bot Avatar/Head */}
                                <div className={cn(
                                    "relative h-12 rounded-lg flex items-center justify-center overflow-hidden border border-white/10 bg-black/40 transition-all duration-500 ring-offset-1 ring-offset-transparent",
                                    isRunning ? "w-[84px] ring-2 ring-emerald-500/40" : "w-12 ring-1 ring-red-500/20"
                                )}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent mobile-shine pointer-events-none" />

                                    {/* Stable container for both states */}
                                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                                        {bot.status === 'running' ? (
                                            <div className="flex items-center gap-1.5 px-2 animate-in fade-in zoom-in duration-500">
                                                <img
                                                    src={`${basePath}/assets/bot_scout.png`}
                                                    alt="Scout"
                                                    className="h-8 w-8 object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-float"
                                                />
                                                <img
                                                    src={`${basePath}/assets/bot_worker.png`}
                                                    alt="Worker"
                                                    className="h-8 w-8 object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse"
                                                />
                                            </div>
                                        ) : (
                                            <img
                                                src={bot.status === 'worker_running' ? `${basePath}/assets/bot_worker.png` : `${basePath}/assets/bot_scout.png`}
                                                alt="Bot"
                                                className={cn(
                                                    "h-9 w-9 object-contain drop-shadow-md transition-transform duration-700",
                                                    bot.status === 'worker_running' ? "animate-pulse" :
                                                        "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"
                                                )}
                                            />
                                        )}
                                    </div>
                                </div>
                                {/* Status Indicator Dot (Pulsing) */}
                                <div className={cn(
                                    "absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#16191e] flex items-center justify-center",
                                    isRunning ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                )}>
                                    <div className={cn(
                                        "absolute inset-0 rounded-full animate-ping bg-inherit pointer-events-none",
                                        bot.status === 'running' ? "opacity-75" : "opacity-0"
                                    )} />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white tracking-tight leading-tight flex items-center gap-2">
                                    {bot.name}
                                    <span className="bg-[#252830] text-[9px] px-1.5 py-0.5 rounded text-gray-400 font-mono border border-white/5">{bot.platform}</span>
                                </h3>
                                <div className="mt-1 flex items-center gap-2">
                                    {/* Status Badge - Stable Structure */}
                                    <div className={cn(
                                        "px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider flex items-center gap-1.5 border transition-all duration-300 ring-1 ring-inset",
                                        statusInfo.badgeClass
                                    )}>
                                        <StatusIcon type={statusInfo.iconType} />
                                        <span>{statusInfo.label}</span>
                                    </div>

                                    {/* Error message - always render container, hide with CSS */}
                                    <span className={cn(
                                        "text-[9px] text-gray-500 truncate max-w-[120px] bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10 transition-all duration-300",
                                        bot.is_critical && bot.last_error ? "opacity-100" : "opacity-0 w-0 p-0 border-0 overflow-hidden"
                                    )}>
                                        {bot.last_error || ""}
                                    </span>

                                    {/* IP Rotation Indicator in Header */}
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-bold">
                                        <Settings className="h-2.5 w-2.5" />
                                        <span>{bot.stats.processed} IP</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Actions - Stable DOM: always render all buttons, hide with CSS */}
                        <div className="flex items-center gap-1">
                            {/* Cancel Schedule Button */}
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    setIsProcessing(true);
                                    try { await onStop(bot.id); } catch (err) { console.error(err); } finally { setIsProcessing(false); }
                                }}
                                disabled={isProcessing}
                                className={cn(
                                    "p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors",
                                    bot.status === "idle" ? "visible" : "invisible w-0 p-0 overflow-hidden"
                                )}
                                title="Zamanlamayı İptal Et"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {/* Edit/Save Toggle - Both always rendered, visibility toggled */}
                            <div className="flex items-center">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className={cn("p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors", isEditing && "hidden")}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <div className={cn("flex gap-1 bg-black/30 rounded-lg p-1 border border-white/5", !isEditing && "hidden")}>
                                    <button onClick={handleSave} className="p-1 hover:text-green-400 text-gray-400 transition-colors"><Save className="h-3.5 w-3.5" /></button>
                                    <button onClick={handleCancel} className="p-1 hover:text-red-400 text-gray-400 transition-colors"><X className="h-3.5 w-3.5" /></button>
                                </div>
                            </div>

                            <button
                                onClick={handleDelete}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Configuration Grid - Both states always rendered, toggled with CSS */}
                <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
                    <div className="col-span-2 space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest px-1">Hedef Kelime</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className={cn("w-full bg-[#0d0f14] border border-green-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-all shadow-[0_0_15px_rgba(34,197,94,0.1)]", !isEditing && "hidden")}
                            />
                            <div
                                onClick={() => setIsEditing(true)}
                                className={cn("w-full bg-[#0d0f14]/80 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-gray-200 font-medium cursor-pointer hover:border-white/10 hover:bg-[#0d0f14] transition-all flex items-center justify-between group/input", isEditing && "hidden")}
                            >
                                <span className={!keyword ? "text-gray-600 italic" : ""}>{keyword || "Tanımsız..."}</span>
                                <Edit2 className="h-3 w-3 text-gray-600 opacity-0 group-hover/input:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest px-1">Başlangıç - Bitiş</label>
                        <div className="flex items-center gap-2">
                            <div className={cn("flex items-center gap-2 w-full", !isEditing && "hidden")}>
                                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="bg-[#0d0f14] border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white w-full text-center focus:outline-none focus:border-green-500" />
                                <span className="text-gray-600">-</span>
                                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="bg-[#0d0f14] border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white w-full text-center focus:outline-none focus:border-green-500" />
                            </div>
                            <div onClick={() => setIsEditing(true)} className={cn("w-full bg-[#0d0f14]/50 border border-white/5 rounded-lg px-3 py-2 text-xs text-center text-gray-400 font-mono cursor-pointer hover:bg-[#0d0f14] hover:border-white/10 transition-colors", isEditing && "hidden")}>
                                {startTime} <span className="text-gray-600 mx-1">➜</span> {endTime}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest px-1">Sayfa Limiti</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={isNaN(pageLimit) ? "" : pageLimit}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setPageLimit(isNaN(val) ? 0 : val);
                                }}
                                className={cn("w-full bg-[#0d0f14] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white text-center focus:outline-none focus:border-green-500", !isEditing && "hidden")}
                            />
                            <div onClick={() => setIsEditing(true)} className={cn("w-full bg-[#0d0f14]/50 border border-white/5 rounded-lg px-3 py-2 text-xs text-center text-gray-400 font-mono cursor-pointer hover:bg-[#0d0f14] hover:border-white/10 transition-colors", isEditing && "hidden")}>
                                {pageLimit || 0} sayfa
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cyber HUD Stats */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                    {statsData.map((stat) => (
                        <div
                            key={stat.label}
                            onClick={stat.action}
                            className={cn(
                                "bg-[#0f1115]/60 border border-white/5 p-2.5 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-300",
                                stat.action && "cursor-pointer hover:bg-[#0f1115]",
                                stat.hoverBorder
                            )}
                        >
                            <div className={cn("text-lg font-black tracking-tight z-10 transition-colors", stat.color, stat.hoverColor)}>
                                {stat.value}
                            </div>
                            <div className="text-[8px] font-bold text-gray-600 uppercase tracking-widest z-10">{stat.label}</div>

                            {/* Background Icon Watermark */}
                            <stat.Icon className="absolute right-1 bottom-1 h-8 w-8 text-white/[0.02] group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500 pointer-events-none" />
                            {/* Hover Shine Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none transition-opacity" />
                        </div>
                    ))}
                </div>

                {/* Live Console / Terminal View */}
                <div className="bg-[#0a0b10] rounded-xl border border-white/5 p-3 mb-5 relative overflow-hidden h-32 flex flex-col shadow-inner">
                    <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-[#0a0b10] to-transparent z-10 pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-center justify-between mb-2 z-20">
                        <div className="flex items-center gap-1.5">
                            <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", bot.stats.errors > 0 ? "bg-red-500" : "bg-green-500")} />
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Sistem Logları</span>
                        </div>
                        {/* Always render this span, control visibility with CSS */}
                        <span className={cn(
                            "text-[8px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 transition-opacity",
                            bot.stats.errors > 0 ? "opacity-100" : "opacity-0 pointer-events-none"
                        )}>DİKKAT</span>
                    </div>

                    {/* Scrollable Logs */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1 relative z-0">
                        {messageHistory.length > 0 ? (
                            messageHistory.map((entry, idx) => (
                                <div key={idx} className="text-[10px] font-mono leading-relaxed group/log animate-in fade-in slide-in-from-left-1 duration-300">
                                    <span className="text-gray-500 mr-2">{new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="text-gray-300">{entry.message}</span>
                                    {entry.url && (
                                        <a href={entry.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-500 hover:text-blue-300 hover:underline opacity-80 decoration-dotted">link ↗</a>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex items-center justify-center text-[10px] text-gray-700 font-mono">
                                <span className="animate-pulse">_ terminal hazır...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons (Bottom) - Stable grid structure */}
                <div className="grid grid-cols-4 gap-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="col-span-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[9px] font-bold py-2.5 rounded-lg border border-white/10 hover:border-white/20 transition-all uppercase tracking-wider relative group overflow-hidden backdrop-blur-sm shadow-inner"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-1.5">
                            <Settings className="h-3 w-3" />
                            <span>AYAR</span>
                        </span>
                    </button>

                    <button
                        onClick={handleToggleStatus}
                        disabled={isProcessing}
                        className={cn(
                            "relative overflow-hidden group text-[10px] font-bold py-2 rounded-lg transition-all border tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg",
                            isRunning ? "col-span-3" : "col-span-1",
                            isRunning
                                ? "bg-gradient-to-br from-rose-500/20 to-red-600/20 hover:from-rose-500/30 hover:to-red-600/30 text-red-500 border-red-500/40 shadow-red-500/5 hover:shadow-red-500/10"
                                : "bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white border-emerald-400/50 shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                        )}
                    >
                        {/* Stabilized Shine Effect */}
                        <div className={cn(
                            "absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent z-0 pointer-events-none transition-opacity",
                            !isRunning ? "opacity-100" : "opacity-0"
                        )} />

                        <span className="relative z-10 flex items-center gap-1.5">
                            {showPauseIcon && <Pause className="h-3 w-3 fill-current" />}
                            <span>{buttonText}</span>
                        </span>
                    </button>

                    {/* Worker button - always render, hide with CSS when running */}
                    <button
                        onClick={handleWorkerStart}
                        disabled={isProcessing || isRunning}
                        className={cn(
                            "bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-[9px] font-bold py-2 rounded-lg border border-amber-400/50 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all tracking-tight uppercase relative group overflow-hidden hover:-translate-y-0.5",
                            !isRunning ? "col-span-2" : "hidden"
                        )}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-1">
                            <span>KUYRUĞU ERİT</span>
                            {bot.pending_links > 0 && (
                                <span className="ml-1 bg-white/20 text-white font-mono px-1.5 py-0.5 rounded-full text-[8px] border border-white/20 shadow-sm animate-pulse group-hover:bg-white/30 transition-colors">
                                    {bot.pending_links}
                                </span>
                            )}
                        </span>
                    </button>
                </div>

            </div>
        </div>
    );
}
