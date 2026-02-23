"use client";

import { useEffect, useState, useCallback } from "react";
import { BotCard } from "@/components/BotCard";
import { StatsCard } from "@/components/StatsCard";
import { Bot, botApi, BotSettingsUpdate } from "@/services/botApi";
import { Plus, RefreshCw, Server, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BotsPage() {
    const [bots, setBots] = useState<Bot[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // Custom Stats (Dynamic)
    const [stats, setStats] = useState({
        total_products: 0,
        total_scraped: 0,
        daily_scraped: 0,
        active_bots: 0,
        system_health: 0,
        pending_links: 0,
    });

    // Add Bot Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newBot, setNewBot] = useState({
        task_name: "",
        target_platform: "Trendyol",
        search_term: "",
        start_time: "09:00",
        end_time: "18:00",
        scrape_interval: 24,
        is_active: false
    });

    const fetchBots = useCallback(async () => {
        try {
            const [botsData, statusData] = await Promise.all([
                botApi.getAllBots(),
                botApi.getSystemStatus()
            ]);
            setBots(botsData);
            setStats(statusData);
            setError(null);
        } catch (err) {
            setError("Veriler alınamadı. Backend servisi çalışıyor mu?");
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Initial fetch and polling
    useEffect(() => {
        fetchBots();
        const interval = setInterval(fetchBots, 2000); // 2 seconds polling
        return () => clearInterval(interval);
    }, [fetchBots]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchBots();
    };

    const handleStartBot = async (id: number) => {
        try {
            await botApi.startBot(id);
            // Wait slightly for backend to process
            setTimeout(fetchBots, 1000);
        } catch (err) {
            alert("Bot başlatılamadı: " + err);
            fetchBots(); // Revert on error
        }
    };

    const handleStopBot = async (id: number) => {
        try {
            await botApi.stopBot(id);
            setTimeout(fetchBots, 1000);
        } catch (err) {
            alert("Bot durdurulamadı.");
            fetchBots(); // Revert on error
        }
    };

    const handleDeleteBot = async (id: number) => {
        try {
            const result = await botApi.deleteBot(id);
            if (result.success) {
                await fetchBots();
            } else {
                alert("Bot silinemedi: " + result.message);
            }
        } catch (err) {
            alert("Bot silinemedi: " + err);
        }
    };

    const handleWorkerStart = async (id: number) => {
        try {
            await botApi.startWorker(id);
            await fetchBots();
        } catch (err) {
            alert("İşçi modu başlatılamadı: " + err);
        }
    };

    const handleUpdateBot = async (id: number, settings: BotSettingsUpdate) => {
        try {
            await botApi.updateSettings(id, settings);
            await fetchBots();
        } catch (err) {
            alert("Ayarlar güncellenemedi: " + err);
        }
    };

    const handleCreateBot = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const result = await botApi.createBot(newBot);
            if (result.success) {
                setShowAddModal(false);
                setNewBot({
                    task_name: "",
                    target_platform: "Trendyol",
                    search_term: "",
                    start_time: "09:00",
                    end_time: "18:00",
                    scrape_interval: 24,
                    is_active: false
                });
                await fetchBots();
            } else {
                throw new Error(result.detail || result.message || "Bot oluşturulamadı.");
            }
        } catch (err: any) {
            alert(err.message || "Bir hata oluştu");
        } finally {
            setIsCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-7xl space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Bot Kontrol Paneli</h1>
                    <p className="text-gray-400 mt-1">
                        Aktif botlarınızı buradan yönetebilir, performanslarını izleyebilir ve ayarlarını değiştirebilirsiniz.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 bg-[#1f2937] hover:bg-[#374151] text-gray-300 px-4 py-2 rounded-lg transition-colors border border-gray-700 font-medium"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                        Yenile
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(22,163,74,0.3)]"
                    >
                        <Plus className="h-5 w-5" />
                        Yeni Bot Ekle
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <StatsCard
                    title="TOPLAM KAZINAN"
                    value={stats.total_scraped.toLocaleString()}
                    subLabel="Tüm Geçmiş"
                    status="neutral"
                />
                <StatsCard
                    title="GÜNLÜK KAZINAN"
                    value={stats.daily_scraped.toLocaleString()}
                    subLabel="Bugün İşlenen"
                    status="success"
                />
                <StatsCard
                    title="AKTİF BOTLAR"
                    value={stats.active_bots.toString()}
                    subLabel="Şu An Çalışan"
                    status={stats.active_bots > 0 ? "success" : "neutral"}
                />
                <StatsCard
                    title="BEKLEYEN LİNKLER"
                    value={stats.pending_links.toLocaleString()}
                    subLabel="Kuyruktaki Görev"
                    status={stats.pending_links > 0 ? "warning" : "neutral"}
                />
                <StatsCard
                    title="SİSTEM SAĞLIĞI"
                    value={`%${stats.system_health.toFixed(1)}`}
                    subLabel="Başarı Oranı"
                    status={stats.system_health > 90 ? "success" : stats.system_health > 70 ? "warning" : "danger"}
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-4 flex items-center gap-3 text-red-200">
                    <Server className="h-5 w-5 text-red-500" />
                    {error}
                </div>
            )}

            {/* Bot Grid */}
            {bots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bots.map((bot) => (
                        <BotCard
                            key={bot.id}
                            bot={bot}
                            onStart={handleStartBot}
                            onWorkerStart={handleWorkerStart}
                            onStop={handleStopBot}
                            onUpdate={handleUpdateBot}
                            onDelete={handleDeleteBot}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-800 rounded-3xl bg-[#0f1115]/50 group hover:bg-[#13151a] transition-all cursor-pointer" onClick={() => setShowAddModal(true)}>
                    <div className="h-20 w-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Plus className="h-10 w-10 text-gray-500 group-hover:text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-400 group-hover:text-white">Henüz hiç bot yok</h3>
                    <p className="text-gray-600 mt-2 font-medium">Yeni bir bot ekleyerek mağaza takibine başlayın.</p>
                </div>
            )}

            {/* Add Bot Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
                    <div className="bg-[#13151a] border border-gray-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        {/* Modal Header */}
                        <div className="bg-[#1a1d24] px-8 py-6 flex items-center justify-between border-b border-gray-800">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Yeni Bot Oluştur</h2>
                                <p className="text-sm text-gray-500">Scraping görevini detaylandırın.</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleCreateBot} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Bot Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Bot İsmi</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Örn: Trendyol Elbise"
                                        className="w-full bg-[#0d0f14] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                        value={newBot.task_name}
                                        onChange={(e) => setNewBot({ ...newBot, task_name: e.target.value })}
                                    />
                                </div>
                                {/* Platform */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Platform</label>
                                    <select
                                        className="w-full bg-[#0d0f14] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                        value={newBot.target_platform}
                                        onChange={(e) => setNewBot({ ...newBot, target_platform: e.target.value })}
                                    >
                                        <option value="Trendyol">Trendyol</option>
                                        <option value="Amazon">Amazon</option>
                                        <option value="Hepsiburada">Hepsiburada</option>
                                    </select>
                                </div>
                            </div>

                            {/* Search Term */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Arama Kelimesi</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Örn: elbise"
                                    className="w-full bg-[#0d0f14] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    value={newBot.search_term}
                                    onChange={(e) => setNewBot({ ...newBot, search_term: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                {/* Start Time */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Başlangıç</label>
                                    <input
                                        type="time"
                                        className="w-full bg-[#0d0f14] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-all text-center"
                                        value={newBot.start_time}
                                        onChange={(e) => setNewBot({ ...newBot, start_time: e.target.value })}
                                    />
                                </div>
                                {/* End Time */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Bitiş</label>
                                    <input
                                        type="time"
                                        className="w-full bg-[#0d0f14] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-all text-center"
                                        value={newBot.end_time}
                                        onChange={(e) => setNewBot({ ...newBot, end_time: e.target.value })}
                                    />
                                </div>
                                {/* Interval */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Aralık (Sf)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full bg-[#0d0f14] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-all text-center font-mono"
                                        value={isNaN(newBot.scrape_interval) ? "" : newBot.scrape_interval}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            setNewBot({ ...newBot, scrape_interval: isNaN(val) ? 0 : val });
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 bg-gray-800/50 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-[2] bg-green-600 hover:bg-green-700 disabled:bg-green-900 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                                >
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        {isCreating ? (
                                            <RefreshCw className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <Plus className="h-5 w-5" />
                                        )}
                                    </div>
                                    <span>{isCreating ? "Oluşturuluyor..." : "Botu Oluştur"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
