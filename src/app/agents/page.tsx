"use client";

import { useEffect, useState, useCallback } from "react";
import { Agent, agentApi, redisApi, RedisQueueStats, RedisBotsMap } from "@/services/agentApi";
import { AgentCard } from "@/components/AgentCard";
import { StatsCard } from "@/components/StatsCard";
import {
    Monitor, Wifi, WifiOff, RefreshCw, Database, Cpu,
    Radio, ListTodo, Loader2, CheckCircle2, AlertTriangle, Zap, RotateCcw
} from "lucide-react";

// ─── Redis Bot satırı ─────────────────────────────────────────────────────────
function RedisBotRow({ id, info }: { id: string; info: RedisBotsMap[string] }) {
    const isActive   = info.status === "active";
    const isWaiting  = info.status === "waiting";
    const isStale    = info.last_seen_ago > 120;

    const dotColor = isStale   ? "bg-red-500"
                   : isActive  ? "bg-emerald-500"
                   : isWaiting ? "bg-yellow-400"
                   :             "bg-gray-600";

    const scraped   = parseInt(info.scraped ?? "0");
    const rate      = parseFloat(info.rate_per_min ?? "0");
    const agoText   = info.last_seen_ago < 60
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
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                isStale   ? "bg-red-500/10 text-red-400" :
                isActive  ? "bg-emerald-500/10 text-emerald-400" :
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
    const [stats, setStats]   = useState<RedisQueueStats | null>(null);
    const [bots, setBots]     = useState<RedisBotsMap>({});
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
                    { label: "Bekleyen",    value: stats?.pending ?? 0,         icon: ListTodo,      color: "text-sky-400",     bg: "bg-sky-500/5",     border: "border-sky-500/15" },
                    { label: "İşleniyor",   value: stats?.processing ?? 0,      icon: Loader2,       color: "text-amber-400",   bg: "bg-amber-500/5",   border: "border-amber-500/15" },
                    { label: "Retry",       value: stats?.retry ?? 0,           icon: AlertTriangle, color: "text-orange-400",  bg: "bg-orange-500/5",  border: "border-orange-500/15" },
                    { label: "Buffer",      value: stats?.results_buffer ?? 0,  icon: Database,      color: "text-purple-400",  bg: "bg-purple-500/5",  border: "border-purple-500/15" },
                    { label: "Toplam",      value: stats?.scraped_total ?? 0,   icon: CheckCircle2,  color: "text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/15" },
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

// ─── Ana Sayfa ────────────────────────────────────────────────────────────────
export default function AgentsPage() {
    const [agents, setAgents]   = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    const fetchAgents = useCallback(async () => {
        try {
            const data = await agentApi.list();
            setAgents(data);
            setError(null);
            setLastUpdate(new Date());
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAgents();
        const interval = setInterval(fetchAgents, 10000);
        return () => clearInterval(interval);
    }, [fetchAgents]);

    const onlineCount   = agents.filter(a => a.status !== "offline").length;
    const scrapingCount = agents.filter(a => a.status === "scraping").length;
    const totalProducts = agents.reduce((sum, a) => sum + (a.stats?.products ?? 0), 0);
    const totalMetrics  = agents.reduce((sum, a) => sum + (a.stats?.metrics ?? 0), 0);

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
                        <Monitor className="h-6 w-6 text-emerald-500" />
                        Distributed Agents
                    </h1>
                    <p className="text-xs text-gray-600 mt-1 font-medium">
                        Bağlı bilgisayarların durumu ve Redis kuyruk monitörü
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {lastUpdate && (
                        <span className="text-[10px] text-gray-600 font-medium">
                            Son güncelleme: {lastUpdate.toLocaleTimeString("tr-TR")}
                        </span>
                    )}
                    <button
                        onClick={fetchAgents}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#13151a] border border-gray-800/50 text-gray-400 hover:text-white text-xs font-bold transition-all hover:border-emerald-500/30"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                        Yenile
                    </button>
                </div>
            </div>

            {/* Redis Queue Monitor */}
            <RedisQueueMonitor />

            {/* Eski Agent Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <StatsCard
                    title="Toplam Agent"
                    value={agents.length}
                    subValue={`${onlineCount} çevrimiçi`}
                    status={onlineCount > 0 ? "success" : "neutral"}
                />
                <StatsCard
                    title="Aktif Kazıma"
                    value={scrapingCount}
                    subValue={scrapingCount > 0 ? "çalışıyor" : "boşta"}
                    status={scrapingCount > 0 ? "warning" : "neutral"}
                />
                <StatsCard
                    title="Toplam Ürün"
                    value={totalProducts.toLocaleString()}
                    subValue="tüm agent'lardan"
                    status="success"
                />
                <StatsCard
                    title="Toplam Metrik"
                    value={totalMetrics.toLocaleString()}
                    subValue="tüm agent'lardan"
                    status="neutral"
                />
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl bg-red-500/5 border border-red-500/15 p-4 mb-6">
                    <p className="text-xs text-red-400 font-medium">⚠️ API Hatası: {error}</p>
                </div>
            )}

            {/* Agent Cards */}
            {loading && agents.length === 0 ? (
                <div className="flex items-center justify-center h-48">
                    <div className="text-center">
                        <RefreshCw className="h-8 w-8 text-gray-600 animate-spin mx-auto mb-3" />
                        <p className="text-sm text-gray-600 font-medium">Agent&apos;lar yükleniyor...</p>
                    </div>
                </div>
            ) : agents.length === 0 ? (
                <div className="flex items-center justify-center h-48">
                    <div className="text-center">
                        <WifiOff className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-sm font-bold text-gray-500 mb-1">Henüz bağlı agent yok</h3>
                        <p className="text-xs text-gray-700 max-w-xs mx-auto">
                            Local bilgisayarda{" "}
                            <code className="text-emerald-500/70 bg-emerald-500/5 px-1.5 py-0.5 rounded">
                                python redis_agent.py
                            </code>{" "}
                            çalıştırarak bir agent bağlayabilirsin.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {agents.map((agent) => (
                        <AgentCard key={agent.id} agent={agent} onRefresh={fetchAgents} />
                    ))}
                </div>
            )}
        </>
    );
}
