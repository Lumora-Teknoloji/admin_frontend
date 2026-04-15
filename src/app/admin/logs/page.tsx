"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { botApi, DetailedError } from "@/services/botApi";
import { cn, parsePercentage } from "@/lib/utils";
import {
    Terminal,
    RefreshCw,
    Trash2,
    Copy,
    ChevronRight,
    Search,
    LayoutList,
    Eye,
    ExternalLink,
    X,
    Activity,
    Server
} from "lucide-react";

import { LiveProduct, SystemHealth } from "@/types";

function LogsContent() {
    const searchParams = useSearchParams();
    const initialFilter = searchParams.get("filter") || "";

    const [activeTab, setActiveTab] = useState<"terminal" | "errors" | "health">("terminal");
    const [terminalSource, setTerminalSource] = useState<"bot" | "backend">("bot");
    const [logs, setLogs] = useState<string[]>([]);
    const [detailedErrors, setDetailedErrors] = useState<DetailedError[]>([]);
    const [health, setHealth] = useState<SystemHealth | null>(null);
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [limit, setLimit] = useState(100);
    const [filter, setFilter] = useState(initialFilter);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedBotId, setSelectedBotId] = useState(0);
    const [botList, setBotList] = useState<{ id: number; name: string; mode: string }[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchData = async () => {
        try {
            // Fetch bot list for selector
            try {
                const bots = await botApi.getAllBots();
                setBotList(bots.map((b: any) => ({ id: b.id, name: b.name, mode: b.mode })));
            } catch { }

            // Fetch logs based on source
            if (activeTab === "terminal") {
                if (terminalSource === "bot") {
                    const logsData = await botApi.getLogs(limit, selectedBotId);
                    setLogs(logsData.logs || []);
                } else {
                    const backendData = await botApi.getBackendLogs(limit);
                    setLogs(backendData.logs || []);
                }
            }

            // Always fetch errors for the badge count
            const errData = await botApi.getLogs(limit);
            setDetailedErrors(errData.detailed_errors || []);

            // Fetch health if tab is active
            if (activeTab === "health") {
                const healthData = await botApi.getSystemHealth();
                setHealth(healthData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLog = async (id: number) => {
        if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
        setLoading(true);
        await botApi.deleteLog(id);
        fetchData();
    };

    const handleClearAllErrors = async () => {
        if (!confirm("DİKKAT! Tüm hata kayıtlarını silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) return;
        setLoading(true);
        await botApi.clearErrorLogs();
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, [limit, activeTab, terminalSource, selectedBotId]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (autoRefresh) {
            interval = setInterval(fetchData, 2000);
        }
        return () => clearInterval(interval);
    }, [autoRefresh, limit, activeTab, terminalSource, selectedBotId]);

    // Auto-scroll to bottom of terminal
    useEffect(() => {
        if (activeTab === "terminal" && scrollRef.current && autoRefresh) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, activeTab, autoRefresh]);

    const filteredLogs = logs.filter(log =>
        log.toLowerCase().includes(filter.toLowerCase())
    );

    const filteredErrors = detailedErrors.filter(err =>
        err.task_name.toLowerCase().includes(filter.toLowerCase()) ||
        err.error.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Image Preview Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative max-w-5xl w-full bg-[#16191e] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-black/50">
                        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#1a1d24]">
                            <span className="text-sm font-bold text-gray-400 tracking-wider uppercase">Görsel Önizleme</span>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-4 flex items-center justify-center bg-black/50">
                            <img
                                src={selectedImage?.startsWith("http") ? selectedImage : `/static/captures/${selectedImage}`}
                                alt="Preview"
                                className="max-h-[80vh] rounded-lg shadow-2xl"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://placehold.co/600x400/1a1d24/gray?text=Görsel+Yüklenemedi";
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ PAGE HEADER ═══ */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-500/20 rounded-xl blur-xl" />
                            <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-600/10 p-2.5 rounded-xl border border-green-500/20">
                                <Terminal className="text-green-500 h-6 w-6" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight">Canlı Sistem Konsolu</h1>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Botların anlık işlemlerini terminal arayüzünden takip edin.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Tab Switcher */}
                    <div className="bg-[#0d0f14] p-1 rounded-xl border border-white/5 flex items-center shadow-inner">
                        <button
                            onClick={() => setActiveTab("terminal")}
                            className={cn(
                                "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[10px] font-black transition-all tracking-wider",
                                activeTab === "terminal"
                                    ? "bg-gradient-to-br from-green-500/15 to-emerald-500/10 text-green-400 border border-green-500/25 shadow-[0_0_15px_rgba(34,197,94,0.08)]"
                                    : "text-gray-600 hover:text-gray-400"
                            )}
                        >
                            <RefreshCw className={cn("h-3.5 w-3.5", autoRefresh && activeTab === "terminal" && "animate-spin")} />
                            TERMİNAL
                        </button>
                        <button
                            onClick={() => setActiveTab("errors")}
                            className={cn(
                                "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[10px] font-black transition-all tracking-wider",
                                activeTab === "errors"
                                    ? "bg-gradient-to-br from-red-500/15 to-rose-500/10 text-red-400 border border-red-500/25 shadow-[0_0_15px_rgba(239,68,68,0.08)]"
                                    : "text-gray-600 hover:text-gray-400"
                            )}
                        >
                            <LayoutList className="h-3.5 w-3.5" />
                            HATA KAYITLARI
                            {detailedErrors.length > 0 && (
                                <span className="ml-1 bg-red-500/20 text-red-400 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-red-500/30 min-w-[18px] text-center">
                                    {detailedErrors.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("health")}
                            className={cn(
                                "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[10px] font-black transition-all tracking-wider",
                                activeTab === "health"
                                    ? "bg-gradient-to-br from-blue-500/15 to-cyan-500/10 text-blue-400 border border-blue-500/25 shadow-[0_0_15px_rgba(59,130,246,0.08)]"
                                    : "text-gray-600 hover:text-gray-400"
                            )}
                        >
                            <Activity className="h-3.5 w-3.5" />
                            SİSTEM SAĞLIĞI
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative group">
                        <div className="absolute left-3 top-0 bottom-0 flex items-center justify-center pointer-events-none">
                            <Search className="h-3.5 w-3.5 text-gray-600 group-focus-within:text-green-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Ara..."
                            className="bg-[#0d0f14] border border-white/5 rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-green-500/30 focus:shadow-[0_0_15px_rgba(34,197,94,0.05)] transition-all w-48 text-gray-300 placeholder-gray-700"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>

                    {/* Live Toggle */}
                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={cn(
                            "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black transition-all border tracking-wider",
                            autoRefresh
                                ? "bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/30 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.08)]"
                                : "bg-[#0d0f14] border-white/5 text-gray-600"
                        )}
                    >
                        <div className={cn("h-1.5 w-1.5 rounded-full", autoRefresh ? "bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-gray-700")} />
                        {autoRefresh ? "CANLI" : "DURAKLATILDI"}
                    </button>
                </div>
            </div>

            {/* ═══ TERMINAL TAB ═══ */}
            {activeTab === "terminal" ? (
                <div className="relative group">
                    {/* Ambient glow */}
                    <div className="absolute -inset-1 bg-gradient-to-b from-green-500/5 via-transparent to-transparent rounded-2xl blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative bg-[#08090d] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 h-[550px] flex flex-col font-mono text-sm">
                        {/* Terminal Header */}
                        <div className="bg-gradient-to-r from-[#111318] to-[#0f1117] px-4 py-2.5 border-b border-white/[0.06] flex justify-between items-center select-none">
                            {/* Traffic Lights */}
                            <div className="flex gap-1.5 items-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60 border border-red-500/30 hover:bg-red-500 transition-colors cursor-pointer" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60 border border-yellow-500/30 hover:bg-yellow-500 transition-colors cursor-pointer" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60 border border-green-500/30 hover:bg-green-500 transition-colors cursor-pointer" />
                            </div>

                            {/* Source Toggle + Bot Selector */}
                            <div className="flex items-center gap-2">
                                <div className="flex bg-black/50 rounded-lg p-0.5 border border-white/[0.04]">
                                    <button
                                        onClick={() => setTerminalSource("bot")}
                                        className={cn(
                                            "px-3 py-1 text-[9px] font-black rounded-md transition-all tracking-widest",
                                            terminalSource === "bot"
                                                ? "bg-green-500/15 text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.1)]"
                                                : "text-gray-700 hover:text-gray-500"
                                        )}
                                    >
                                        BOT LOGLARI
                                    </button>
                                    <button
                                        onClick={() => setTerminalSource("backend")}
                                        className={cn(
                                            "px-3 py-1 text-[9px] font-black rounded-md transition-all tracking-widest",
                                            terminalSource === "backend"
                                                ? "bg-blue-500/15 text-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.1)]"
                                                : "text-gray-700 hover:text-gray-500"
                                        )}
                                    >
                                        BACKEND
                                    </button>
                                </div>

                                {/* Bot Selector — styled pill buttons */}
                                {terminalSource === "bot" && botList.length > 0 && (
                                    <div className="flex bg-black/50 rounded-lg p-0.5 border border-white/[0.04] gap-0.5">
                                        <button
                                            onClick={() => setSelectedBotId(0)}
                                            className={cn(
                                                "px-2.5 py-1 text-[9px] font-black rounded-md transition-all tracking-wider whitespace-nowrap",
                                                selectedBotId === 0
                                                    ? "bg-green-500/15 text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.1)]"
                                                    : "text-gray-700 hover:text-gray-500"
                                            )}
                                        >
                                            TÜMÜ
                                        </button>
                                        {botList.map(bot => (
                                            <button
                                                key={bot.id}
                                                onClick={() => setSelectedBotId(bot.id)}
                                                className={cn(
                                                    "px-2.5 py-1 text-[9px] font-black rounded-md transition-all tracking-wider whitespace-nowrap",
                                                    selectedBotId === bot.id
                                                        ? bot.mode === 'linker' ? "bg-purple-500/15 text-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.1)]"
                                                            : bot.mode === 'worker' ? "bg-amber-500/15 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.1)]"
                                                                : "bg-emerald-500/15 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.1)]"
                                                        : "text-gray-700 hover:text-gray-500"
                                                )}
                                            >
                                                {bot.name.length > 12 ? bot.name.slice(0, 12) + '…' : bot.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Terminal Body */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-0.5 bg-[#08090d] text-gray-400 relative"
                        >
                            {/* Scanline overlay */}
                            <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)] z-10" />

                            {loading && logs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-700 mt-20">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-green-500/10 rounded-full blur-xl animate-pulse" />
                                        <RefreshCw className="relative h-8 w-8 animate-spin text-green-500/30" />
                                    </div>
                                    <span className="font-bold text-xs tracking-widest uppercase">Bağlantı kuruluyor...</span>
                                </div>
                            ) : filteredLogs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-700">
                                    <Terminal className="h-10 w-10 text-gray-800" />
                                    <span className="text-xs font-bold tracking-widest uppercase">
                                        {filter ? "Arama kriterine uygun log bulunamadı." : "Terminal boş — bot çalıştığında loglar burada görünecek."}
                                    </span>
                                </div>
                            ) : (
                                filteredLogs.map((log, index) => (
                                    <div key={index} className="relative break-all hover:bg-white/[0.02] transition-colors px-2 py-1 -mx-2 rounded group/line">
                                        <span className={cn(
                                            "mr-2 text-[10px]",
                                            log.includes("❌") || log.includes("🛑") ? "text-red-500" :
                                                log.includes("🛍️") ? "text-emerald-500" :
                                                    log.includes("🔗") || log.includes("📡") ? "text-purple-500" :
                                                        log.includes("⚠️") || log.includes("🔄") ? "text-amber-500" :
                                                            log.includes("🏁") ? "text-blue-500" :
                                                                "text-green-500/50"
                                        )}>➜</span>
                                        <span className={cn(
                                            "text-[11px]",
                                            log.includes("❌") || log.includes("🛑") ? "text-red-400/90" :
                                                log.includes("🛍️") ? "text-gray-300" :
                                                    log.includes("⚠️") ? "text-amber-400/80" :
                                                        "text-gray-500"
                                        )}>
                                            {log}
                                        </span>
                                    </div>
                                ))
                            )}

                            {/* Blinking cursor */}
                            {autoRefresh && (
                                <div className="flex items-center gap-0.5 mt-1 pl-2">
                                    <span className="text-green-500/40 text-[10px]">➜</span>
                                    <div className="w-2 h-4 bg-green-500/50 animate-pulse rounded-[1px] shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            ) : activeTab === "errors" ? (
                <div className="space-y-4">
                    {/* Clear All Header */}
                    {detailedErrors.length > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600 font-bold tracking-wider">
                                {filteredErrors.length} hata kaydı gösteriliyor
                            </span>
                            <button
                                onClick={handleClearAllErrors}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-lg text-[10px] font-black transition-all tracking-wider uppercase"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                TÜMÜNÜ SİL
                            </button>
                        </div>
                    )}

                    {/* Error Table */}
                    <div className="bg-[#0a0c10] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gradient-to-r from-[#111318] to-[#0f1117] border-b border-white/[0.06]">
                                <tr>
                                    <th className="px-5 py-3.5 text-[9px] font-black text-gray-600 uppercase tracking-[0.15em]">BOT İSMİ</th>
                                    <th className="px-3 py-3.5 text-[9px] font-black text-gray-600 uppercase tracking-[0.15em]">TİP</th>
                                    <th className="px-5 py-3.5 text-[9px] font-black text-gray-600 uppercase tracking-[0.15em]">HATA MESAJI</th>
                                    <th className="px-5 py-3.5 text-[9px] font-black text-gray-600 uppercase tracking-[0.15em]">TARİH</th>
                                    <th className="px-5 py-3.5 text-[9px] font-black text-gray-600 uppercase tracking-[0.15em] text-center">İŞLEM</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {filteredErrors.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3 text-gray-700">
                                                <div className="p-3 bg-green-500/5 rounded-full border border-green-500/10">
                                                    <Activity className="h-6 w-6 text-green-500/30" />
                                                </div>
                                                <span className="text-xs font-bold tracking-wider">Hata kaydı bulunamadı — sistemde her şey yolunda.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredErrors.map((err) => (
                                        <tr key={err.id} className="hover:bg-white/[0.015] transition-colors group">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]" />
                                                    <span className="text-xs font-bold text-gray-300">{err.task_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <span className={cn(
                                                    "text-[8px] font-black px-2 py-0.5 rounded-md border uppercase tracking-widest",
                                                    err.mode === 'linker' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        err.mode === 'worker' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                )}>
                                                    {err.mode === 'linker' ? 'LINKER' : err.mode === 'worker' ? 'WORKER' : 'NORMAL'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {(() => {
                                                    // Parse structured error: [CATEGORY] emoji summary | URL: ...
                                                    const categoryMatch = err.error.match(/^\[([A-Z_]+)\]\s*/);
                                                    const urlMatch = err.error.match(/\|\s*URL:\s*(\S+)/);
                                                    const category = categoryMatch ? categoryMatch[1] : null;
                                                    const url = urlMatch ? urlMatch[1] : null;
                                                    const cleanMessage = err.error
                                                        .replace(/^\[[A-Z_]+\]\s*/, '')
                                                        .replace(/\|\s*URL:\s*\S+/, '')
                                                        .replace(/\|\s*Ürün:\s*[^|]+/, '')
                                                        .trim();

                                                    const categoryColors: Record<string, string> = {
                                                        'DB_ERROR': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                                                        'BLOCK': 'bg-red-500/10 text-red-400 border-red-500/20',
                                                        'TIMEOUT': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                                                        'NETWORK': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                                                        'PARSE': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                                                        'BROWSER': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                                                        'IP_ROTATION': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
                                                        'QUEUE': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
                                                        'UNKNOWN': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
                                                    };

                                                    return (
                                                        <div className="flex flex-col gap-1">
                                                            {category && (
                                                                <span className={cn(
                                                                    "inline-flex items-center self-start text-[7px] font-black px-1.5 py-0.5 rounded border uppercase tracking-widest",
                                                                    categoryColors[category] || categoryColors['UNKNOWN']
                                                                )}>
                                                                    {category.replace('_', ' ')}
                                                                </span>
                                                            )}
                                                            <span className="text-[11px] text-red-400/80 font-medium line-clamp-2 leading-relaxed">
                                                                {cleanMessage || err.error}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[9px] text-gray-700 font-mono">ERR-{err.id}</span>
                                                                {url && (
                                                                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-[9px] text-blue-500/60 hover:text-blue-400 hover:underline decoration-dotted truncate max-w-[200px]">
                                                                        {url.replace('https://www.trendyol.com/', '').substring(0, 30)}... ↗
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="text-[10px] text-gray-600 font-mono">{err.date}</span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {err.screenshot ? (
                                                        <button
                                                            onClick={() => setSelectedImage(err.screenshot)}
                                                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-[9px] font-black uppercase tracking-wider border border-red-500/15"
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                            Önizle
                                                        </button>
                                                    ) : (
                                                        <span className="text-[9px] text-gray-800 italic font-bold">—</span>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteLog(err.id)}
                                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-700 hover:text-red-500 transition-colors"
                                                        title="Kaydı Sil"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Status Card */}
                        <div className="relative overflow-hidden bg-[#0d0f14] border border-white/[0.06] rounded-2xl p-5 group">
                            <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-500">
                                <Activity size={70} />
                            </div>
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3">Veritabanı Durumu</p>
                            <div className="flex items-center gap-2.5">
                                <div className={cn("h-2.5 w-2.5 rounded-full animate-pulse", health?.database.connection === "healthy" ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]")} />
                                <h3 className="text-lg font-black text-white uppercase tracking-wide">{health?.database.connection === "healthy" ? "Sağlıklı" : "Kesik"}</h3>
                            </div>
                        </div>

                        {/* Metrics Cards */}
                        <div className="bg-[#0d0f14] border border-white/[0.06] rounded-2xl p-5">
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3">Toplam Veri</p>
                            <h3 className="text-3xl font-black text-white">{health?.database.total_products.toLocaleString() || "0"}</h3>
                            <p className="text-[9px] text-gray-600 mt-1 uppercase font-bold tracking-wider">Kaydedilen Ürün</p>
                        </div>

                        <div className="bg-[#0d0f14] border border-white/[0.06] rounded-2xl p-5">
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3">Aktif Görev</p>
                            <h3 className="text-3xl font-black text-white">{health?.database.total_tasks || "0"}</h3>
                            <p className="text-[9px] text-gray-600 mt-1 uppercase font-bold tracking-wider">Platform Botu</p>
                        </div>

                        <div className="bg-[#0d0f14] border border-white/[0.06] rounded-2xl p-5">
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3">CPU Kullanımı</p>
                            <h3 className="text-3xl font-black text-white">{health?.server.cpu || "0%"}</h3>
                            <div className="w-full bg-gray-900 h-1.5 rounded-full mt-3 overflow-hidden border border-white/[0.03]">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-1000 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                                    style={{ width: `${parsePercentage(health?.server.cpu)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Server Detailed Specs */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-[#0d0f14] border border-white/[0.06] rounded-2xl p-6">
                            <h3 className="text-sm font-black text-white mb-5 flex items-center gap-2">
                                <Server className="text-blue-500 h-4 w-4" />
                                <span className="tracking-wider">Sunucu Kaynak Dağılımı</span>
                            </h3>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.15em] text-gray-600">
                                        <span>Bellek (RAM)</span>
                                        <span className="text-white">{health?.server.memory}</span>
                                    </div>
                                    <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden border border-white/[0.03]">
                                        <div className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" style={{ width: `${parsePercentage(health?.server.memory)}%` }} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.15em] text-gray-600">
                                        <span>Disk Doluluk</span>
                                        <span className="text-white">{health?.server.disk}</span>
                                    </div>
                                    <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden border border-white/[0.03]">
                                        <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full shadow-[0_0_8px_rgba(245,158,11,0.3)]" style={{ width: `${parsePercentage(health?.server.disk)}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0d0f14] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-center">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3.5 bg-black/30 rounded-xl border border-white/[0.03]">
                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.15em]">İşletim Sistemi</span>
                                    <span className="text-xs font-black text-white tracking-wider">{health?.server.os}</span>
                                </div>
                                <div className="flex items-center justify-between p-3.5 bg-black/30 rounded-xl border border-white/[0.03]">
                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.15em]">Backend Servis</span>
                                    <span className="text-xs font-black text-green-500 tracking-wider">FastAPI v0.109.0</span>
                                </div>
                                <div className="flex items-center justify-between p-3.5 bg-black/30 rounded-xl border border-white/[0.03]">
                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.15em]">Veritabanı</span>
                                    <span className="text-xs font-black text-blue-400 tracking-wider">PostgreSQL 16</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function LogsPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-gray-500 animate-pulse">
                <RefreshCw className="h-10 w-10 animate-spin text-green-500/20" />
                <span className="font-bold tracking-widest text-sm uppercase">Sistem Yükleniyor...</span>
            </div>
        }>
            <LogsContent />
        </Suspense>
    );
}
