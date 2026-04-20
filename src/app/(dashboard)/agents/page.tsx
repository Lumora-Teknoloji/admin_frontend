"use client";

import { useEffect, useState, useCallback } from "react";
import { redisApi, RedisQueueStats, RedisBotsMap } from "@/services/agentApi";
import {
    Monitor, WifiOff, RefreshCw, Database,
    Radio, ListTodo, Loader2, CheckCircle2, AlertTriangle, Zap, RotateCcw,
    KeyRound, Copy, Check, X
} from "lucide-react";

// ─── Redis Bot satırı ─────────────────────────────────────────────────────────
function RedisBotRow({ id, info }: { id: string; info: RedisBotsMap[string] }) {
    const isActive = info.status === "active";
    const isWaiting = info.status === "waiting";
    const isStale = info.last_seen_ago > 120;

    const dotColor = isStale ? "bg-red-500"
        : isActive ? "bg-emerald-500"
            : isWaiting ? "bg-yellow-400"
                : "bg-gray-600";

    const scraped = parseInt(info.scraped ?? "0");
    const rate = parseFloat(info.rate_per_min ?? "0");
    const agoText = info.last_seen_ago < 60
        ? `${info.last_seen_ago}sn önce`
        : `${Math.round(info.last_seen_ago / 60)}dk önce`;

    return (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0d0f13] border border-gray-800/40 hover:border-gray-700/60 transition-all">
            {/* Status dot */}
            <span className={`h-2 w-2 rounded-full flex-shrink-0 ${dotColor} ${isActive ? "animate-pulse" : ""}`} />

            {/* Bot ID */}
            <span className="text-xs font-mono text-gray-300 flex-1 truncate">{id}</span>

            {/* Stats */}
            <div className="flex items-center gap-4 text-[10px] font-semibold">
                <span className="text-emerald-400">{scraped.toLocaleString()} ürün</span>
                <span className="text-sky-400">{rate.toFixed(1)}/dk</span>
                <span className={`${isStale ? "text-red-400" : "text-gray-600"}`}>{agoText}</span>
            </div>

            {/* Status badge */}
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isStale ? "bg-red-500/10 text-red-400" :
                    isActive ? "bg-emerald-500/10 text-emerald-400" :
                        isWaiting ? "bg-yellow-500/10 text-yellow-400" :
                            "bg-gray-700/30 text-gray-500"
                }`}>
                {isStale ? "STALE" : info.status.toUpperCase()}
            </span>
        </div>
    );
}

// ─── Redis Queue Monitor Kartı ────────────────────────────────────────────────
function RedisQueueMonitor() {
    const [stats, setStats] = useState<RedisQueueStats | null>(null);
    const [bots, setBots] = useState<RedisBotsMap>({});
    const [loading, setLoading] = useState(true);
    const [recovering, setRecovering] = useState(false);

    const fetch = useCallback(async () => {
        try {
            const [s, b] = await Promise.all([redisApi.getStats(), redisApi.getBots()]);
            setStats(s);
            setBots(b);
        } catch {
            /* sessiz başarısız */
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetch();
        const interval = setInterval(fetch, 5000);
        return () => clearInterval(interval);
    }, [fetch]);

    const handleRecover = async () => {
        setRecovering(true);
        try { await redisApi.recover(); await fetch(); } finally { setRecovering(false); }
    };

    const botList = Object.entries(bots);
    const activeBots = botList.filter(([, b]) => b.status === "active" && b.last_seen_ago < 120);

    return (
        <div className="rounded-2xl bg-[#0d0f13] border border-gray-800/50 p-6 mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <Radio className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white">Redis Queue Monitor</h2>
                        <p className="text-[10px] text-gray-600 font-medium">Gerçek zamanlı kuyruk ve bot durumu</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRecover}
                        disabled={recovering}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/5 border border-amber-500/15 text-amber-400 text-[10px] font-bold hover:bg-amber-500/10 transition-all disabled:opacity-50"
                    >
                        <RotateCcw className={`h-3 w-3 ${recovering ? "animate-spin" : ""}`} />
                        Recover
                    </button>
                    {loading && <Loader2 className="h-3.5 w-3.5 text-gray-600 animate-spin" />}
                </div>
            </div>

            {/* Queue Stats Grid */}
            <div className="grid grid-cols-5 gap-3 mb-6">
                {[
                    { label: "Bekleyen", value: stats?.pending ?? 0, icon: ListTodo, color: "text-sky-400", bg: "bg-sky-500/5", border: "border-sky-500/15" },
                    { label: "İşleniyor", value: stats?.processing ?? 0, icon: Loader2, color: "text-amber-400", bg: "bg-amber-500/5", border: "border-amber-500/15" },
                    { label: "Retry", value: stats?.retry ?? 0, icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/5", border: "border-orange-500/15" },
                    { label: "Buffer", value: stats?.results_buffer ?? 0, icon: Database, color: "text-purple-400", bg: "bg-purple-500/5", border: "border-purple-500/15" },
                    { label: "Toplam", value: stats?.scraped_total ?? 0, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/15" },
                ].map(({ label, value, icon: Icon, color, bg, border }) => (
                    <div key={label} className={`rounded-xl ${bg} border ${border} p-3`}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <Icon className={`h-3 w-3 ${color}`} />
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
                        </div>
                        <p className={`text-xl font-black ${color}`}>{value.toLocaleString()}</p>
                    </div>
                ))}
            </div>

            {/* Active Bots */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="h-3 w-3 text-emerald-500" />
                        Aktif Botlar ({activeBots.length})
                    </p>
                    <span className="text-[9px] text-gray-700 font-medium">5sn'de bir güncellenir</span>
                </div>

                {botList.length === 0 ? (
                    <div className="flex items-center justify-center py-8 rounded-xl bg-[#0a0b0e] border border-gray-800/30">
                        <div className="text-center">
                            <WifiOff className="h-8 w-8 text-gray-700 mx-auto mb-2" />
                            <p className="text-xs text-gray-700 font-medium">Henüz bağlı Redis bot yok</p>
                            <p className="text-[10px] text-gray-800 mt-1">
                                Bot PC&apos;de <code className="text-emerald-500/50">python redis_agent.py</code> çalıştır
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        {botList.map(([id, info]) => (
                            <RedisBotRow key={id} id={id} info={info} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

import { TaskManager } from "@/components/TaskManager";

// ─── Ana Sayfa ────────────────────────────────────────────────────────────────
export default function AgentsPage() {
    const [reloadKey, setReloadKey] = useState(0);
    const [showSetupInfo, setShowSetupInfo] = useState(false);
    const [copiedSec, setCopiedSec] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState(false);

    const secretKey = process.env.NEXT_PUBLIC_AGENT_SECRET || "Tanımlanmamış (.env.local'i kontrol edin)";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    const copyToClipboard = (text: string, type: 'sec' | 'url') => {
        navigator.clipboard.writeText(text);
        if (type === 'sec') {
            setCopiedSec(true);
            setTimeout(() => setCopiedSec(false), 2000);
        } else {
            setCopiedUrl(true);
            setTimeout(() => setCopiedUrl(false), 2000);
        }
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
                        <Monitor className="h-6 w-6 text-emerald-500" />
                        Ağ ve Görev Yönetimi
                    </h1>
                    <p className="text-xs text-gray-600 mt-1 font-medium">
                        Bağlı bilgisayarların (agent) durumu ve görev planlayıcı
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowSetupInfo(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 text-xs font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                        title="Agent Nasıl Bağlanır?"
                    >
                        <KeyRound className="h-3.5 w-3.5" />
                        Kurulum Şifresi
                    </button>
                    <button
                        onClick={() => setReloadKey(k => k + 1)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#13151a] border border-gray-800/50 text-gray-400 hover:text-white text-xs font-bold transition-all hover:border-emerald-500/30"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Yenile
                    </button>
                </div>
            </div>

            {/* Görev Yöneticisi (Scheduler) */}
            <TaskManager key={`task-${reloadKey}`} />

            {/* Redis Queue Monitor */}
            <RedisQueueMonitor key={`monitor-${reloadKey}`} />

            {/* Setup Info Modal */}
            {showSetupInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowSetupInfo(false)}
                    />
                    <div className="relative z-10 w-full max-w-lg bg-[#0a0d14] rounded-2xl border border-gray-700/50 shadow-2xl p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Yeni Bilgisayar (Bot) Bağlama</h3>
                                <p className="text-xs text-gray-500">Sisteme yeni bir makine sokmak için gerekli bağlantı bilgileri.</p>
                            </div>
                            <button onClick={() => setShowSetupInfo(false)} className="text-gray-500 hover:text-white">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-[#13151a] p-4 rounded-xl border border-gray-800">
                                <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">1. Bağlantı Adresi (VPS URL)</p>
                                <div className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg border border-gray-800/50">
                                    <code className="text-sm text-sky-400 font-mono select-all truncate pr-4">{apiUrl}</code>
                                    <button onClick={() => copyToClipboard(apiUrl, 'url')} className="text-gray-500 hover:text-white transition-colors shrink-0">
                                        {copiedUrl ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-[#13151a] p-4 rounded-xl border border-gray-800">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">2. Gizli Anahtar (Agent Secret)</p>
                                </div>
                                <div className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg border border-gray-800/50">
                                    <code className="text-sm text-emerald-400 font-mono select-all truncate pr-4 max-w-[300px] blur-[2px] hover:blur-none transition-all">{secretKey}</code>
                                    <button onClick={() => copyToClipboard(secretKey, 'sec')} className="text-gray-500 hover:text-white transition-colors shrink-0">
                                        {copiedSec ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2">Bu şifreyi değiştirmek istersen backend ve frontend konfigürasyon (<code>.env</code>) dosyalarından manuel değiştirmen gerekir.</p>
                            </div>

                            <div className="pt-2">
                                <p className="text-xs text-justify leading-relaxed text-gray-400 p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                                    <strong className="text-indigo-400 font-bold">Nasıl Kullanılır: </strong>
                                    Başka bir bilgisayarda (Sunucu veya Kendi PC'n) Python `redis_agent.py` scriptini ilk defa çalıştırdığında sana sorulacak sihirbaza bu bilgileri yapıştır. Ana merkeze otomatik bağlanacaktır.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
