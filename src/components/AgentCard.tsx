"use client";

import { useState, useEffect } from "react";
import { Agent, agentApi, LogEntry } from "@/services/agentApi";
import { cn } from "@/lib/utils";
import {
    Monitor,
    Wifi,
    WifiOff,
    Play,
    Square,
    RefreshCw,
    Search,
    Download,
    Database,
    Clock,
    Send,
    ChevronDown,
    ChevronUp,
    Package,
    BarChart3,
    AlertCircle,
    PowerOff,
    Trash2,
    Terminal,
    Edit2,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; label: string; icon: any }> = {
    online: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", label: "Çevrimiçi", icon: Wifi },
    standby: { color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20", label: "Hazır", icon: Monitor },
    idle: { color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20", label: "Boşta", icon: Monitor },
    scraping: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", label: "Kazıyor", icon: RefreshCw },
    completed: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Tamamlandı", icon: Package },
    syncing: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", label: "Aktarıyor", icon: Database },
    linking: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", label: "Link Buluyor", icon: Search },
    extracting: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", label: "Veri Çekiyor", icon: Download },
    cancelling: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", label: "İptal Ediliyor", icon: Square },
    error: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Hata", icon: AlertCircle },
    offline: { color: "text-gray-600", bg: "bg-gray-800/50", border: "border-gray-700/30", label: "Çevrimdışı", icon: WifiOff },
};

interface AgentCardProps {
    agent: Agent;
    onRefresh: () => void;
}

export function AgentCard({ agent, onRefresh }: AgentCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState("");
    const [message, setMessage] = useState("");
    const [pageLimit, setPageLimit] = useState<number>(1);
    const [showLogs, setShowLogs] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [now, setNow] = useState(Date.now());
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(agent.name);
    const [showSchedule, setShowSchedule] = useState(false);
    const [scheduleTime, setScheduleTime] = useState(agent.schedule_config?.time || "09:00");
    const [scheduleKeyword, setScheduleKeyword] = useState(agent.schedule_config?.keyword || "");
    const [scheduleEnabled, setScheduleEnabled] = useState(agent.schedule_config?.enabled || false);

    // Ticking timer for real-time "timeSince" tracking
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const config = STATUS_CONFIG[agent.status] || STATUS_CONFIG.offline;
    const StatusIcon = config.icon;

    const fetchLogs = async () => {
        setLoadingLogs(true);
        try {
            const data = await agentApi.getLogs(agent.id, 50);
            setLogs(data);
            setShowLogs(true);
            setExpanded(true); // Open card to show logs
        } catch (error) {
            console.error("Failed to fetch logs", error);
        } finally {
            setLoadingLogs(false);
        }
    };

    const handleRename = async () => {
        setIsEditingName(false);
        if (editedName.trim() === "" || editedName === agent.name) {
            setEditedName(agent.name);
            return;
        }
        try {
            await agentApi.rename(agent.id, editedName.trim());
            onRefresh();
            setMessage("✅ İsim güncellendi");
        } catch (e: any) {
            setMessage(`❌ İsim güncellenemedi: ${e.message}`);
            setEditedName(agent.name);
        }
    };

    const handleUpdateSchedule = async () => {
        setLoading("schedule");
        setMessage("");
        try {
            await agentApi.updateSchedule(agent.id, {
                enabled: scheduleEnabled,
                time: scheduleTime,
                keyword: scheduleKeyword,
                mode: "linker"
            });
            setMessage(`✅ Zamanlayıcı güncellendi`);
            onRefresh();
            setTimeout(() => setShowSchedule(false), 1500);
        } catch (e: any) {
            setMessage(`❌ Zamanlayıcı hatası: ${e.message}`);
        } finally {
            setLoading("");
        }
    };

    const timeSince = (dateStr: string | null) => {
        if (!dateStr) return "—";
        const diff = (now - new Date(dateStr).getTime()) / 1000;
        if (diff < 60) return `${Math.floor(diff)}sn önce`;
        if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
        return `${Math.floor(diff / 86400)}g önce`;
    };

    const handleCommand = async (cmd: string, params?: Record<string, any>) => {
        setLoading(cmd);
        setMessage("");
        try {
            if (cmd === "scrape" && keyword.trim()) {
                await agentApi.scrape(agent.id, keyword.trim(), "linker", pageLimit);
                setMessage(`✅ "${keyword}" kazıma komutu gönderildi (Sayfa Limiti: ${pageLimit})`);
                setKeyword("");
            } else if (cmd === "stop") {
                await agentApi.stop(agent.id);
                setMessage("⏹️ Durdurma komutu gönderildi");
            } else if (cmd === "sync") {
                await agentApi.sync(agent.id);
                setMessage("🔄 Senkron komutu gönderildi");
            } else if (cmd === "shutdown") {
                await agentApi.shutdown(agent.id);
                setMessage("🔌 Kapatma sinyali gönderildi");
            } else if (cmd === "delete") {
                const confirmed = window.confirm(
                    `"${agent.name}" ajanını kalıcı olarak silmek istediğine emin misin?\n\nBu işlem geri alınamaz — tüm komutlar ve loglar da silinir.`
                );
                if (!confirmed) {
                    setLoading("");
                    return;
                }
                await agentApi.deleteAgent(agent.id);
                setMessage("🗑️ Agent silindi");
            }
            setTimeout(onRefresh, 2000);
        } catch (e: any) {
            setMessage(`❌ ${e.message}`);
        } finally {
            setLoading("");
        }
    };

    return (
        <div className={cn(
            "rounded-2xl border bg-[#0d0f14] shadow-lg transition-all duration-500 relative overflow-hidden group",
            config.border,
            agent.status === "scraping" && "bg-blue-900/10 shadow-blue-500/10 border-blue-500/40 shadow-2xl scale-[1.02]",
            agent.status === "extracting" && "bg-blue-900/10 shadow-blue-500/10 border-blue-500/40 shadow-2xl scale-[1.02]",
            agent.status === "linking" && "bg-amber-900/10 shadow-amber-500/10 border-amber-500/40 shadow-2xl scale-[1.02]",
            agent.status === "syncing" && "bg-purple-900/10 shadow-purple-500/10 border-purple-500/40 shadow-2xl scale-[1.02]",
            agent.status === "idle" && "opacity-80 grayscale-[30%]",
            agent.status === "standby" && "opacity-80 grayscale-[30%]",
            agent.status === "offline" && "opacity-50 grayscale"
        )}>
            {/* Top accent line */}
            <div className={cn(
                "absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent to-transparent opacity-80 transition-all duration-500",
                agent.status === "scraping" && "via-blue-500 animate-pulse",
                agent.status === "extracting" && "via-blue-500 animate-pulse",
                agent.status === "linking" && "via-amber-500 animate-pulse",
                agent.status === "syncing" && "via-purple-500 animate-pulse",
                agent.status === "online" && "via-green-500",
                agent.status === "idle" && "via-gray-600",
                agent.status === "completed" && "via-emerald-500",
                agent.status === "error" && "via-red-500",
                agent.status === "offline" && "via-gray-700",
            )} />

            {/* Clickable Header */}
            <div
                className="p-5 pb-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Status indicator */}
                        <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center transition-colors duration-500",
                            config.bg, config.border, "border"
                        )}>
                            <StatusIcon className={cn("h-5 w-5 transition-colors duration-500", config.color, (agent.status === "scraping" || agent.status === "linking" || agent.status === "extracting" || agent.status === "syncing") && "animate-spin")} />
                        </div>
                        <div>
                            {isEditingName ? (
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleRename();
                                        else if (e.key === "Escape") { setIsEditingName(false); setEditedName(agent.name); }
                                    }}
                                    onBlur={handleRename}
                                    className="bg-[#1a1d24] text-sm font-bold text-white border border-blue-500/50 rounded px-2 w-[160px] focus:outline-none"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <div className="flex items-center gap-1.5 group/name" onClick={(e) => { e.stopPropagation(); setIsEditingName(true); }}>
                                    <h3 className={cn("text-sm font-bold tracking-wide transition-colors", (agent.status === "scraping" || agent.status === "linking" || agent.status === "extracting" || agent.status === "syncing") ? "text-blue-50" : "text-white")}>{agent.name}</h3>
                                    <Edit2 className="h-3 w-3 text-gray-500 opacity-0 group-hover/name:opacity-100 transition-opacity" />
                                </div>
                            )}
                            <p className="text-[10px] text-gray-500 font-medium">
                                {(agent as any).hostname ? `${(agent as any).hostname} • ` : ""}{agent.os || "Unknown OS"}
                            </p>
                        </div>
                    </div>

                    {/* Status badge & Logs Toggle */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!showLogs) fetchLogs();
                                else setShowLogs(false);
                            }}
                            className={cn(
                                "p-1.5 rounded-lg border transition-all duration-300",
                                showLogs ? "bg-blue-500/20 border-blue-500/30 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]" : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                            )}
                            title="Logları Gör"
                        >
                            <Terminal className="h-4 w-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!showSchedule) setShowSchedule(true);
                                else setShowSchedule(false);
                                setExpanded(true);
                            }}
                            className={cn(
                                "p-1.5 rounded-lg border transition-all duration-300",
                                showSchedule || agent.schedule_config?.enabled ? "bg-amber-500/20 border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]" : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                            )}
                            title="Zamanlayıcıyı Ayarla"
                        >
                            <Clock className="h-4 w-4" />
                        </button>
                        <div className={cn(
                            "flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider border transition-colors duration-500",
                            config.bg, config.color, config.border,
                        )}>
                            <div className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                agent.status === "online" || agent.status === "idle" ? "bg-green-400 animate-pulse" : "",
                                agent.status === "scraping" ? "bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" : "",
                                agent.status === "extracting" ? "bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" : "",
                                agent.status === "linking" ? "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" : "",
                                agent.status === "syncing" ? "bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" : "",
                                agent.status === "offline" ? "bg-gray-600" : "",
                                agent.status === "error" ? "bg-red-400" : "",
                                agent.status === "completed" ? "bg-emerald-400" : "",
                            )} />
                            {config.label}
                        </div>
                    </div>
                </div>

                {/* Current task (Always visible if active) */}
                {agent.current_task && (
                    <div className={cn(
                        "mt-3 rounded-lg border px-3 py-2 transition-colors duration-500",
                        agent.status === "scraping" || agent.status === "extracting" ? "bg-blue-500/10 border-blue-500/20" : agent.status === "linking" ? "bg-amber-500/10 border-amber-500/20" : agent.status === "syncing" ? "bg-purple-500/10 border-purple-500/20" : "bg-white/5 border-white/10"
                    )}>
                        <p className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            agent.status === "scraping" || agent.status === "extracting" ? "text-blue-400" : agent.status === "linking" ? "text-amber-400" : agent.status === "syncing" ? "text-purple-400" : "text-gray-400"
                        )}>Aktif Görev</p>
                        <p className="text-xs text-white font-medium mt-0.5">{agent.current_task}</p>

                        {/* Canlı İlerleme (Sadece scraping durumunda) */}
                        {(agent.status === "scraping" || agent.status === "extracting" || agent.status === "linking") && (
                            <div className="mt-2 pt-2 border-t border-blue-500/20 flex items-center justify-between text-[10px] font-medium text-blue-200">
                                <div><span className="font-bold text-blue-400 text-xs">{agent.stats?.pages_scraped || 0}</span> Sayfa</div>
                                <div><span className="font-bold text-blue-400 text-xs">{agent.stats?.products_found || 0}</span> Bulundu</div>
                                <div>
                                    <span className={agent.stats?.errors ? "text-red-400 font-bold text-xs" : "text-blue-400 font-bold text-xs"}>
                                        {agent.stats?.errors || 0}
                                    </span> Hata
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Chevron indicating it's clickable */}
                {!expanded && (
                    <div className="w-full flex justify-center mt-3">
                        <ChevronDown className="h-4 w-4 text-gray-600" />
                    </div>
                )}
            </div>

            {/* Expanded section */}
            {expanded && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-px bg-gray-800/30 mx-5 rounded-xl overflow-hidden mb-3 border border-gray-800/50">
                        <div className="bg-[#0b0d11] p-3 text-center">
                            <Package className="h-3.5 w-3.5 text-gray-500 mx-auto mb-1" />
                            <p className="text-sm font-bold text-white">{agent.stats?.products ?? 0}</p>
                            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Toplam Ürün</p>
                        </div>
                        <div className="bg-[#0b0d11] p-3 text-center">
                            <BarChart3 className="h-3.5 w-3.5 text-gray-500 mx-auto mb-1" />
                            <p className="text-sm font-bold text-white">{agent.stats?.metrics ?? 0}</p>
                            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Toplam Metrik</p>
                        </div>
                        <div className="bg-[#0b0d11] p-3 text-center">
                            <Clock className="h-3.5 w-3.5 text-gray-500 mx-auto mb-1" />
                            <p className="text-[10px] font-bold text-white mt-1">{timeSince(agent.last_heartbeat)}</p>
                            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Son İletişim</p>
                        </div>
                    </div>

                    {/* Commands */}
                    <div className="px-5 pb-5 space-y-3 pt-1">
                        {/* Scrape command */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Keyword (ör: elbise)"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && keyword.trim() && handleCommand("scrape")}
                                className="flex-1 bg-[#1a1d24] border border-gray-800/80 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                            <input
                                type="number"
                                min={1}
                                placeholder="Sayfa"
                                value={pageLimit}
                                onChange={(e) => setPageLimit(Math.max(1, Number(e.target.value) || 1))}
                                className="w-[70px] bg-[#1a1d24] border border-gray-800/80 rounded-lg px-2 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors text-center"
                                title="Maksimum taranacak sayfa sayısı"
                            />
                            <button
                                onClick={() => handleCommand("scrape")}
                                disabled={!keyword.trim() || loading === "scrape"}
                                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold hover:bg-blue-500/20 disabled:opacity-30 transition-all min-w-[80px]"
                            >
                                {loading === "scrape" ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                                Kazı
                            </button>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleCommand("stop")}
                                disabled={loading === "stop"}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold hover:bg-orange-500/20 disabled:opacity-30 transition-all"
                            >
                                <Square className="h-3 w-3" />
                                İptal
                            </button>
                            <button
                                onClick={() => handleCommand("sync")}
                                disabled={loading === "sync"}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 disabled:opacity-30 transition-all"
                            >
                                <Database className="h-3 w-3" />
                                Çek
                            </button>
                            <button
                                onClick={() => handleCommand("shutdown")}
                                disabled={loading === "shutdown"}
                                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-600/10 border border-red-500/30 text-red-500 text-xs font-bold hover:bg-red-500/20 hover:text-red-400 disabled:opacity-30 transition-all"
                                title="Uzak bilgisayardaki ajanı tamamen kapatır"
                            >
                                <PowerOff className="h-3.5 w-3.5" />
                                Kapat
                            </button>
                            <button
                                onClick={() => handleCommand("delete")}
                                disabled={loading === "delete"}
                                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/40 border border-red-800/40 text-red-600 text-xs font-bold hover:bg-red-900/40 hover:text-red-400 hover:border-red-500/40 disabled:opacity-30 transition-all"
                                title="Bu ajanı veritabanından kalıcı olarak siler"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Sil
                            </button>
                        </div>

                        {/* Auto-Scheduler UI */}
                        {showSchedule && (
                            <div className="mt-4 p-4 rounded-xl bg-gray-900/40 border border-amber-500/20 animate-in slide-in-from-top-2 flex flex-col gap-3">
                                <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> OTO-KAZIMA ZAMANLAYICISI</span>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <span className="text-white">Aktif Et</span>
                                        <input type="checkbox" checked={scheduleEnabled} onChange={e => setScheduleEnabled(e.target.checked)} className="accent-amber-500 h-3.5 w-3.5 cursor-pointer" />
                                    </label>
                                </h4>
                                <div className="flex gap-2">
                                    <input
                                        type="time"
                                        value={scheduleTime}
                                        onChange={(e) => setScheduleTime(e.target.value)}
                                        className="w-[100px] bg-[#1a1d24] border border-gray-800/80 rounded-lg px-2 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors pointer-events-auto"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Kelime (Virgülle ayır s. ç, t)"
                                        value={scheduleKeyword}
                                        onChange={(e) => setScheduleKeyword(e.target.value)}
                                        className="flex-1 bg-[#1a1d24] border border-gray-800/80 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors pointer-events-auto"
                                        title="Birden fazla kelime girmek için sadece virgülle ayırın (Örn: elbise, çanta)"
                                    />
                                    <button
                                        onClick={handleUpdateSchedule}
                                        disabled={loading === "schedule" || (scheduleEnabled && !scheduleKeyword.trim())}
                                        className="px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20 disabled:opacity-30 transition-all pointer-events-auto"
                                    >
                                        {loading === "schedule" ? "Kaydediliyor..." : "Kaydet"}
                                    </button>
                                </div>
                                <p className="text-[9px] text-gray-500">
                                    Bu ajana özel zamanlanmış kazıma görevi. Belirtilen saatte kazıma başlar ve otomatik senkronize edilir.
                                </p>
                            </div>
                        )}

                        {/* Expand toggle (Close) */}
                        <button
                            onClick={() => setExpanded(false)}
                            className="w-full flex items-center justify-center gap-1 pt-2 text-[10px] text-gray-600 hover:text-gray-400 transition-colors font-bold uppercase tracking-wider"
                        >
                            <ChevronUp className="h-3 w-3" />
                            Gizle
                        </button>

                        {/* Message */}
                        {message && (
                            <p className="text-xs text-center py-1 text-gray-400">{message}</p>
                        )}
                    </div>

                    {/* Logs Viewer */}
                    {showLogs && (
                        <div className="mx-5 mb-5 bg-[#0b0d11] rounded-xl border border-gray-800/50 flex flex-col overflow-hidden max-h-64 animate-in slide-in-from-top-2">
                            <div className="flex items-center justify-between px-3 py-2 bg-gray-800/30 border-b border-gray-800/50">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Terminal className="h-3.5 w-3.5" />
                                    Canlı Loglar
                                </h4>
                                <button
                                    onClick={() => fetchLogs()}
                                    className="p-1 hover:bg-white/10 rounded"
                                    title="Yenile"
                                >
                                    <RefreshCw className={cn("h-3 w-3 text-gray-400", loadingLogs && "animate-spin")} />
                                </button>
                            </div>
                            <div className="p-3 overflow-y-auto flex-1 font-mono text-[10px] space-y-1.5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-700/50 [&::-webkit-scrollbar-track]:bg-transparent">
                                {logs.length === 0 ? (
                                    <div className="text-gray-500 text-center py-4">Kayıtlı log bulunamadı.</div>
                                ) : (
                                    logs.map((log) => (
                                        <div key={log.id} className="flex gap-2">
                                            <span className="text-gray-500 shrink-0">
                                                {new Date(log.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </span>
                                            <span className={cn(
                                                "shrink-0 font-bold",
                                                log.level === "ERROR" || log.level === "CRITICAL" ? "text-red-400" :
                                                    log.level === "WARNING" ? "text-orange-400" : "text-blue-400"
                                            )}>[{log.level}]</span>
                                            <span className="text-gray-300 break-all">{log.message}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
