"use client";

import { useEffect, useState, useCallback } from "react";
import { BotCard } from "@/components/BotCard";
import { StatsCard } from "@/components/StatsCard";
import { Bot, botApi, BotSettingsUpdate, DataQuality, LinkerBot } from "@/services/botApi";
import { Plus, RefreshCw, Server, X, Info, BarChart3 } from "lucide-react";
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

    // Data Quality
    const [quality, setQuality] = useState<DataQuality | null>(null);

    // Add Bot Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newBot, setNewBot] = useState({
        task_name: "",
        target_platform: "Trendyol",
        search_term: "",
        mode: "normal",
        page_limit: 50,
        source_task_id: null as number | null,
        start_time: "09:00",
        end_time: "18:00",
        scrape_interval: 24,
        is_active: false
    });
    const [linkerBots, setLinkerBots] = useState<LinkerBot[]>([]);

    const fetchBots = useCallback(async () => {
        try {
            const [botsData, statusData, qualityData] = await Promise.all([
                botApi.getAllBots(),
                botApi.getSystemStatus(),
                botApi.getDataQuality()
            ]);
            setBots(botsData);
            setStats(statusData);
            setQuality(qualityData);
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

    // Fetch linker bots when mode is worker (for dropdown)
    useEffect(() => {
        if (newBot.mode === 'worker') {
            botApi.getLinkerBots().then(setLinkerBots).catch(() => setLinkerBots([]));
        }
    }, [newBot.mode]);

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
                    mode: "normal",
                    page_limit: 50,
                    source_task_id: null,
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
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500/20 rounded-xl blur-xl" />
                        <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-600/10 p-3 rounded-xl border border-green-500/20">
                            <Server className="text-green-500 h-6 w-6" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Bot Kontrol Paneli</h1>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                            Aktif botlarınızı buradan yönetebilir, performanslarını izleyebilir ve ayarlarını değiştirebilirsiniz.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-4 py-2.5 rounded-xl transition-all border border-white/10 hover:border-white/20 text-[10px] font-black uppercase tracking-wider"
                    >
                        <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
                        Yenile
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-5 py-2.5 rounded-xl font-black transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5 text-[10px] uppercase tracking-wider border border-green-400/50"
                    >
                        <Plus className="h-4 w-4" />
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

            {/* Data Quality Section */}
            {quality && quality.total_products > 0 && (
                <div className="bg-[#0d0f14] border border-white/[0.06] rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="h-4 w-4 text-green-500" />
                        <h3 className="text-sm font-black text-white tracking-wider">Veri Kalitesi</h3>
                        <span className="text-[9px] text-gray-600 ml-auto font-bold uppercase tracking-wider">{quality.total_products.toLocaleString()} ürün</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Satıcı", pct: quality.seller_pct },
                            { label: "Özellikler", pct: quality.attributes_pct },
                            { label: "Görsel", pct: quality.image_pct },
                            { label: "Puan", pct: quality.avg_rating_pct },
                            { label: "Sepet", pct: quality.cart_pct },
                            { label: "Favori", pct: quality.favorite_pct },
                            { label: "Yorum Özeti", pct: quality.review_summary_pct },
                            { label: "Beden", pct: quality.sizes_pct },
                        ].map((item) => (
                            <div key={item.label} className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 font-medium text-[10px]">{item.label}</span>
                                    <span className={cn(
                                        "font-black text-[10px]",
                                        item.pct > 70 ? "text-green-400" : item.pct > 30 ? "text-yellow-400" : "text-red-400"
                                    )}>
                                        %{item.pct.toFixed(1)}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/[0.03]">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-1000",
                                            item.pct > 70 ? "bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_6px_rgba(34,197,94,0.3)]"
                                                : item.pct > 30 ? "bg-gradient-to-r from-yellow-500 to-amber-400 shadow-[0_0_6px_rgba(234,179,8,0.3)]"
                                                    : "bg-gradient-to-r from-red-500 to-rose-400 shadow-[0_0_6px_rgba(239,68,68,0.3)]"
                                        )}
                                        style={{ width: `${Math.min(item.pct, 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
                            {/* Bot Name - Full Width */}
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

                            {/* Bot Mode + Platform */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Bot Tipi</label>
                                    <select
                                        className="w-full bg-[#0d0f14] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                        value={newBot.mode}
                                        onChange={(e) => setNewBot({ ...newBot, mode: e.target.value })}
                                    >
                                        <option value="normal">🔄 Normal (Link + Kazıma)</option>
                                        <option value="linker">🔗 Linker (Sadece Link Topla)</option>
                                        <option value="worker">🛍️ Worker (Sadece Kazıma)</option>
                                        <option value="review">💬 Review (Yorum Kazıma)</option>
                                    </select>
                                </div>
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

                            {/* Search Term OR Source Bot */}
                            {newBot.mode === 'review' ? (
                                <div className="space-y-2">
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3">
                                        <span className="text-2xl">💬</span>
                                        <div>
                                            <p className="text-sm font-bold text-yellow-400">Yorum Kazıma Modu</p>
                                            <p className="text-xs text-gray-400">Veritabanındaki mevcut ürünlerin yorumlarını kazır. Keyword gerekmez.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : newBot.mode === 'worker' ? (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Kaynak Bot (Linker)</label>
                                    <select
                                        required
                                        className="w-full bg-[#0d0f14] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                        value={newBot.source_task_id || ''}
                                        onChange={(e) => setNewBot({ ...newBot, source_task_id: parseInt(e.target.value) || null })}
                                    >
                                        <option value="">Linker bot seçin...</option>
                                        {linkerBots.map(lb => (
                                            <option key={lb.id} value={lb.id}>
                                                {lb.name} — "{lb.keyword}" ({lb.queue_count} link)
                                            </option>
                                        ))}
                                    </select>
                                    {linkerBots.length === 0 && (
                                        <p className="text-xs text-amber-500 px-1">⚠️ Henüz linker bot yok. Önce bir linker bot oluşturun.</p>
                                    )}
                                </div>
                            ) : (
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
                            )}

                            {/* Worker and Review don't need schedule or page limit */}
                            {newBot.mode !== 'worker' && newBot.mode !== 'review' && (
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
                                    {/* Page Limit */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Sayfa Limiti</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="500"
                                            placeholder="50"
                                            className="w-full bg-[#0d0f14] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-all text-center font-mono"
                                            value={isNaN(newBot.page_limit) ? "" : newBot.page_limit}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                setNewBot({ ...newBot, page_limit: isNaN(val) ? 0 : val });
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

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
