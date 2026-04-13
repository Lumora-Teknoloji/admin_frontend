"use client";

import { useEffect, useState, useCallback } from "react";
import { Agent, agentApi } from "@/services/agentApi";
import { AgentCard } from "@/components/AgentCard";
import { StatsCard } from "@/components/StatsCard";
import { Sidebar } from "@/components/Sidebar";
import { Monitor, Wifi, WifiOff, RefreshCw, Database, Cpu } from "lucide-react";

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

    // İlk yükleme + auto-refresh her 10sn
    useEffect(() => {
        fetchAgents();
        const interval = setInterval(fetchAgents, 10000);
        return () => clearInterval(interval);
    }, [fetchAgents]);

    // Stats
    const onlineCount = agents.filter(a => a.status !== "offline").length;
    const scrapingCount = agents.filter(a => a.status === "scraping").length;
    const totalProducts = agents.reduce((sum, a) => sum + (a.stats?.products ?? 0), 0);
    const totalMetrics = agents.reduce((sum, a) => sum + (a.stats?.metrics ?? 0), 0);

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
                        Bağlı bilgisayarların durumu ve kontrol paneli
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

            {/* Stats Overview */}
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

            {/* Agent Cards Grid */}
            {loading && agents.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <RefreshCw className="h-8 w-8 text-gray-600 animate-spin mx-auto mb-3" />
                        <p className="text-sm text-gray-600 font-medium">Agent&apos;lar yükleniyor...</p>
                    </div>
                </div>
            ) : agents.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <WifiOff className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-sm font-bold text-gray-500 mb-1">Henüz bağlı agent yok</h3>
                        <p className="text-xs text-gray-700 max-w-xs mx-auto">
                            Local bilgisayarda <code className="text-emerald-500/70 bg-emerald-500/5 px-1.5 py-0.5 rounded">python agent.py</code> çalıştırarak
                            bir agent bağlayabilirsin.
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
