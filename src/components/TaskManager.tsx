"use client";

import React, { useState, useEffect, useCallback } from "react";
import { botApi, Bot } from "@/services/botApi";
import { Plus, Trash2, Clock, Play, Square, Settings2, Loader2, AlertCircle, X, Search, CalendarClock, RefreshCw } from "lucide-react";

export function TaskManager() {
    const [tasks, setTasks] = useState<Bot[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form states
    const [taskName, setTaskName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [startTime, setStartTime] = useState("09:00");
    const [isRecurring, setIsRecurring] = useState(true);
    const [pageLimit, setPageLimit] = useState(50);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchTasks = useCallback(async () => {
        try {
            const data = await botApi.getAllBots();
            setTasks(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 15000);
        return () => clearInterval(interval);
    }, [fetchTasks]);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        
        if (!taskName || !searchTerm) {
            setErrorMsg("Hedef adı ve arama terimi zorunludur.");
            return;
        }

        setSubmitting(true);
        try {
            const result = await botApi.createBot({
                task_name: taskName,
                search_term: searchTerm,
                start_time: startTime,
                end_time: "23:59", // API format compliance
                scrape_interval: isRecurring ? 24 : 0,
                page_limit: Number(pageLimit),
                mode: "normal",
                target_platform: "Trendyol",
                is_active: true
            });

            if (result.success) {
                setIsAddModalOpen(false);
                setTaskName("");
                setSearchTerm("");
                fetchTasks();
            } else {
                setErrorMsg(result.detail || result.message || "Bilinmeyen bir hata oluştu.");
            }
        } catch (err: any) {
            setErrorMsg(err.message || "İstek başarısız.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu görevi silmek istediğinize emin misiniz?")) return;
        await botApi.deleteBot(id);
        fetchTasks();
    };

    const handleReset = async (id: number, name: string) => {
        if (!confirm(`🤖 ${name} botunun tüm çekim istatistiklerini ve kuyruğunu SIYIRLAMAK istediğinize emin misiniz?`)) return;
        await botApi.resetBot(id);
        fetchTasks();
    };

    return (
        <div className="rounded-2xl bg-[#0a0d14] border border-gray-800/60 p-6 mb-8 relative overflow-hidden shadow-2xl">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold tracking-wide text-white flex items-center gap-3">
                        <CalendarClock className="h-6 w-6 text-emerald-400" />
                        Kategori ve Anahtar Kelime Botları
                    </h2>
                    <p className="text-xs text-gray-500 mt-1.5 font-medium">Başlatıldığında linkleri toplayıp kuyruğa ekleyen hedefler</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 hover:from-emerald-400 to-teal-600 hover:to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    Yeni Hedef Ekle
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-3" />
                    <p className="text-sm text-gray-400">Hedefler yükleniyor...</p>
                </div>
            ) : tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-900/30 rounded-xl border border-gray-800/30 border-dashed">
                    <Search className="h-10 w-10 text-gray-700 mb-3" />
                    <h3 className="text-gray-300 font-bold mb-1">Planlanmış Hedef Yok</h3>
                    <p className="text-xs text-gray-500 max-w-sm text-center">Sağ üstteki butonu kullanarak yeni bir anahtar kelime veya kategori kazıma hedefi ekleyin.</p>
                </div>
            ) : (
                <div className="space-y-3 relative z-10">
                    {tasks.map((task) => (
                        <div key={task.id} className="group flex items-center justify-between p-4 rounded-xl bg-[#0f131a] hover:bg-[#131822] border border-gray-800/50 hover:border-gray-700 transition-all duration-300">
                            
                            {/* Column 1: Info */}
                            <div className="flex items-center gap-4 flex-1">
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${
                                        task.task_status === "active" ? "bg-emerald-500/10 border-emerald-500/20" : 
                                        task.task_status === "scheduled" ? "bg-indigo-500/10 border-indigo-500/20" : 
                                        "bg-gray-800/50 border-gray-700/50"
                                }`}>
                                    {task.task_status === "active" ? <Play className="h-5 w-5 text-emerald-400 ml-0.5" /> : 
                                     task.task_status === "scheduled" ? <Clock className="h-5 w-5 text-indigo-400" /> : 
                                     <Square className="h-4 w-4 text-gray-500" />}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                                        {task.name}
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                            task.task_status === "active" ? "bg-emerald-500/10 text-emerald-400" : 
                                            task.task_status === "scheduled" ? "bg-indigo-500/10 text-indigo-400" : 
                                            "bg-gray-800 text-gray-400"
                                        }`}>
                                            {task.task_status === "active" ? "Oynatılıyor" : task.task_status === "scheduled" ? "Planlandı" : "Durduruldu"}
                                        </span>
                                    </h4>
                                    <p className="text-xs text-sky-400/80 font-medium mt-1 truncate max-w-xs" title={task.keyword}>
                                        {task.keyword || "Hedef URL Girtilmedi"}
                                    </p>
                                </div>
                            </div>

                            {/* Column 2: Schedule */}
                            <div className="flex-[0.8] flex items-center gap-6">
                                <div className="flex flex-col items-start gap-1 p-2 rounded-lg bg-black/20 border border-gray-800/30 min-w-[120px]">
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase">
                                        <Clock className="h-3 w-3 text-indigo-400" />
                                        BAŞLAMA ZAMANI
                                    </div>
                                    <div className="text-xs text-gray-300 font-mono font-medium flex items-center gap-2">
                                        <span>{task.start_time}</span>
                                        {task.scrape_interval_hours > 0 ? (
                                            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">Her Gün</span>
                                        ) : (
                                            <span className="text-[9px] bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded">Tek Sefer</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">LİMİT</span>
                                    <span className="text-xs text-gray-300 font-medium bg-gray-800/50 px-2 py-0.5 rounded">{task.page_limit} Sayfa</span>
                                </div>
                            </div>

                            {/* Column 3: Stats Summary */}
                            <div className="hidden lg:flex flex-[0.8] items-center gap-6 pr-6">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Toplanan</span>
                                    <span className="text-sm font-black text-emerald-400">{task.stats?.scraped?.toLocaleString() || 0}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Bekleyen</span>
                                    <span className="text-sm font-black text-sky-400">{task.pending_links?.toLocaleString() || 0}</span>
                                </div>
                            </div>

                            {/* Column 4: Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                <button 
                                    onClick={() => botApi.startBot(task.id).then(fetchTasks)}
                                    className={`p-2 rounded-xl border transition-all ${
                                        task.task_status === "active" 
                                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" 
                                        : "bg-emerald-500/5 border-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/30"
                                    }`}
                                    title="Hemen Oynat"
                                >
                                    <Play className="h-4 w-4 ml-0.5" />
                                </button>
                                <button 
                                    onClick={() => botApi.scheduleBot(task.id).then(fetchTasks)}
                                    className={`p-2 rounded-xl border transition-all ${
                                        task.task_status === "scheduled" 
                                        ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" 
                                        : "bg-indigo-500/5 border-indigo-500/10 text-indigo-500 hover:bg-indigo-500/10 hover:border-indigo-500/30"
                                    }`}
                                    title="Planla"
                                >
                                    <Clock className="h-4 w-4" />
                                </button>
                                <button 
                                    onClick={() => botApi.stopBot(task.id).then(fetchTasks)}
                                    className={`p-2 rounded-xl border transition-all ${
                                        task.task_status === "stopped" 
                                        ? "bg-gray-500/20 border-gray-500/40 text-gray-300" 
                                        : "bg-gray-500/5 border-gray-500/10 text-gray-500 hover:bg-gray-500/10 hover:border-gray-500/30"
                                    }`}
                                    title="Durdur"
                                >
                                    <Square className="h-4 w-4" />
                                </button>
                                <button 
                                    onClick={() => handleReset(task.id, task.name)}
                                    className="p-2 rounded-xl bg-orange-500/5 border border-orange-500/10 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all"
                                    title="İstatistikleri Sıfırla"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(task.id)}
                                    className="p-2 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                                    title="Tamamen Sil"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}

            {/* Premium Glassmorphism Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => !submitting && setIsAddModalOpen(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative z-10 w-full max-w-md bg-[#0a0d14] rounded-2xl border border-gray-700/50 shadow-[0_0_40px_rgba(16,185,129,0.1)] overflow-hidden">
                        {/* Decorative Top Accent */}
                        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />
                        
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold tracking-wide text-white">Yeni Plan Ekle</h3>
                                    <p className="text-xs text-gray-500 mt-1">Sisteme bağlanacak kategoriyi programla</p>
                                </div>
                                <button 
                                    onClick={() => !submitting && setIsAddModalOpen(false)}
                                    className="p-1 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-white transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {errorMsg && (
                                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 items-start">
                                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-red-400 font-medium leading-relaxed">{errorMsg}</p>
                                </div>
                            )}

                            <form onSubmit={handleCreateTask} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 ml-1">Kısa İsim (Takma Ad)</label>
                                    <input 
                                        type="text" 
                                        value={taskName}
                                        onChange={e => setTaskName(e.target.value)}
                                        placeholder="Örn: Ayakkabı Kategorisi"
                                        className="w-full bg-[#131822] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 ml-1">Kategori Linki veya Anahtar Kelime</label>
                                    <input 
                                        type="text" 
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        placeholder="https://trendyol.com/..."
                                        className="w-full bg-[#131822] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 ml-1">Bağlantı Toplama (Başlama) Saati</label>
                                        <input 
                                            type="time" 
                                            value={startTime}
                                            onChange={e => setStartTime(e.target.value)}
                                            className="w-full bg-[#131822] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all [color-scheme:dark]"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5 flex flex-col justify-end">
                                        <label className="flex items-center gap-3 bg-[#131822] border border-gray-700 rounded-xl px-4 py-2.5 cursor-pointer hover:border-emerald-500/50 transition-all h-[42px]">
                                            <div className="relative flex items-center justify-center">
                                                <input 
                                                    type="checkbox" 
                                                    checked={isRecurring}
                                                    onChange={e => setIsRecurring(e.target.checked)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-5 h-5 rounded border ${isRecurring ? 'bg-emerald-500 border-emerald-500' : 'bg-[#0a0d14] border-gray-600'} transition-colors flex items-center justify-center`}>
                                                    {isRecurring && <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white leading-none">Her Gün Tekrarla</span>
                                                <span className="text-[9px] text-gray-500 mt-0.5 leading-none">Seçili saatte otomatik çek</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 ml-1 flex justify-between">
                                        <span>Sayfa Limiti</span>
                                        <span className="text-emerald-500">{pageLimit} Sayfa</span>
                                    </label>
                                    <input 
                                        type="range" 
                                        min="1" max="100" step="1"
                                        value={pageLimit}
                                        onChange={e => setPageLimit(Number(e.target.value))}
                                        className="w-full accent-emerald-500"
                                    />
                                    <p className="text-[10px] text-gray-500 px-1">Derinlik belirler, yüksek limit süreyi uzatır.</p>
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 disabled:hover:bg-emerald-500"
                                    >
                                        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Planlamayı Kaydet"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
