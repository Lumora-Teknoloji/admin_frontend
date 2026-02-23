"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { botApi, DetailedError } from "@/services/botApi";
import { cn } from "@/lib/utils";
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

interface LiveProduct {
    id: number;
    name: string;
    brand: string;
    price: string;
    url: string;
    scraped_at: string;
    bot: string;
    platform: string;
    image: string | null;
}

interface SystemHealth {
    status: string;
    database: {
        connection: string;
        total_products: number;
        total_tasks: number;
        total_logs: number;
    };
    server: {
        cpu: string;
        memory: string;
        disk: string;
        os: string;
        uptime: string;
    };
}

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
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchData = async () => {
        try {
            // Fetch logs based on source
            if (activeTab === "terminal") {
                if (terminalSource === "bot") {
                    const logsData = await botApi.getLogs(limit);
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
    }, [limit, activeTab, terminalSource]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (autoRefresh) {
            interval = setInterval(fetchData, 2000); // 2 saniyede bir güncelle
        }
        return () => clearInterval(interval);
    }, [autoRefresh, limit, activeTab, terminalSource]);

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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-in fade-in duration-200">
                    <div className="relative max-w-5xl w-full bg-[#16191e] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#1a1d24]">
                            <span className="text-sm font-bold text-gray-400">Görsel Önizleme</span>
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

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <Terminal className="text-green-500 h-8 w-8" />
                        Canlı Sistem Konsolu
                    </h1>
                    <p className="text-gray-400 mt-1">Botların anlık işlemlerini terminal arayüzünden takip edin.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Tab Switcher */}
                    <div className="bg-[#13151a] p-1 rounded-xl border border-gray-800 flex items-center">
                        <button
                            onClick={() => setActiveTab("terminal")}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                activeTab === "terminal" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            <RefreshCw className={cn("h-4 w-4", autoRefresh && activeTab === "terminal" && "animate-spin")} />
                            TERMİNAL
                        </button>
                        <button
                            onClick={() => setActiveTab("errors")}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                activeTab === "errors" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            <LayoutList className="h-4 w-4" />
                            HATA KAYITLARI ({detailedErrors.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("health")}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                activeTab === "health" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            <Activity className="h-4 w-4" />
                            SİSTEM SAĞLIĞI
                        </button>
                    </div>

                    <div className="relative group">
                        <div className="absolute left-3 top-0 bottom-0 flex items-center justify-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-500 group-focus-within:text-gray-300 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Loglarda veya hatalarda ara..."
                            className="bg-[#13151a] border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-green-500/50 transition-colors w-64"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                            autoRefresh
                                ? "bg-green-500/10 border-green-500/50 text-green-500"
                                : "bg-gray-800/50 border-gray-700 text-gray-400"
                        )}
                    >
                        {autoRefresh ? "CANLI" : "DURAKLATILDI"}
                    </button>
                </div>
            </div>

            {activeTab === "terminal" ? (
                <div className="bg-[#0d0f14] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl h-[500px] flex flex-col font-mono text-sm relative group">
                    {/* Terminal Header */}
                    <div className="bg-[#1a1d24] px-4 py-2 border-b border-gray-800 flex justify-between items-center select-none">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        </div>
                        <div className="flex bg-black/40 rounded-lg p-0.5 border border-gray-800">
                            <button
                                onClick={() => setTerminalSource("bot")}
                                className={cn(
                                    "px-3 py-1 text-[10px] font-black rounded-md transition-all",
                                    terminalSource === "bot" ? "bg-green-500/20 text-green-500" : "text-gray-600 hover:text-gray-400"
                                )}
                            >
                                BOT LOGLARI
                            </button>
                            <button
                                onClick={() => setTerminalSource("backend")}
                                className={cn(
                                    "px-3 py-1 text-[10px] font-black rounded-md transition-all",
                                    terminalSource === "backend" ? "bg-blue-500/20 text-blue-500" : "text-gray-600 hover:text-gray-400"
                                )}
                            >
                                BACKEND SERVİS
                            </button>
                        </div>
                        <div className="text-[10px] text-gray-500 font-bold tracking-widest hidden md:block">
                            root@analiz-motoru:~# tail -f {terminalSource === "bot" ? "scraping.log" : "backend.log"}
                        </div>
                    </div>

                    {/* Terminal Body */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-1 bg-black/95 text-gray-300"
                    >
                        {loading && logs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-600 animate-pulse mt-20">
                                <RefreshCw className="h-8 w-8 animate-spin text-green-500/20" />
                                <span>Sistem ile bağlantı kuruluyor...</span>
                            </div>
                        ) : filteredLogs.length === 0 ? (
                            <div className="text-gray-600 italic">
                                {filter ? "Arama kriterine uygun log bulunamadı." : "Henüz log kaydı yok."}
                            </div>
                        ) : (
                            filteredLogs.map((log, index) => (
                                <div key={index} className="break-all hover:bg-white/5 transition-colors px-2 py-0.5 -mx-2 rounded">
                                    <span className="text-green-500 mr-2">➜</span>
                                    {log}
                                </div>
                            ))
                        )}

                        {/* Blinking cursor effect at the end */}
                        {autoRefresh && (
                            <div className="inline-block w-2.5 h-4 bg-green-500/50 animate-pulse align-middle ml-2" />
                        )}
                    </div>
                </div>
            ) : activeTab === "errors" ? (
                <div className="grid grid-cols-1 gap-4">
                    {/* Clean All Header */}
                    {detailedErrors.length > 0 && (
                        <div className="flex justify-end">
                            <button
                                onClick={handleClearAllErrors}
                                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs font-bold transition-all"
                            >
                                <Trash2 className="h-4 w-4" />
                                TÜMÜNÜ SİL
                            </button>
                        </div>
                    )}

                    {/* Error Table */}
                    <div className="bg-[#0d0f14] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl min-h-[60vh]">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#1a1d24] border-b border-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">BOT İSMİ</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">HATA MESAJI</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">TARİH</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">İŞLEM</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {filteredErrors.map((err) => (
                                    <tr key={err.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                                <span className="text-sm font-bold text-gray-300">{err.task_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-red-400 font-medium line-clamp-2">{err.error}</span>
                                                <span className="text-[10px] text-gray-600 font-mono mt-0.5">ID: ERR-{err.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-gray-500 font-mono">{err.date}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {err.screenshot ? (
                                                    <button
                                                        onClick={() => setSelectedImage(err.screenshot)}
                                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all text-[10px] font-black uppercase tracking-wider border border-red-500/20"
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                        Önizle
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] text-gray-700 italic font-bold">Görsel Yok</span>
                                                )}

                                                <button
                                                    onClick={() => handleDeleteLog(err.id)}
                                                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors ml-2"
                                                    title="Kaydı Sil"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in duration-500 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Status Card */}
                        <div className="bg-[#13151a] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <Activity size={80} />
                            </div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Veritabanı Durumu</p>
                            <div className="flex items-center gap-3">
                                <div className={cn("h-3 w-3 rounded-full animate-pulse", health?.database.connection === "healthy" ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]" : "bg-red-500")} />
                                <h3 className="text-xl font-bold text-white uppercase">{health?.database.connection === "healthy" ? "Canlı / Sağlıklı" : "Bağlantı Kesik"}</h3>
                            </div>
                        </div>

                        {/* Metrics Cards */}
                        <div className="bg-[#13151a] border border-gray-800 rounded-2xl p-6">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Toplam Veri</p>
                            <h3 className="text-3xl font-black text-white">{health?.database.total_products.toLocaleString() || "0"}</h3>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold">Kaydedilen Ürün</p>
                        </div>

                        <div className="bg-[#13151a] border border-gray-800 rounded-2xl p-6">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Aktif Görev</p>
                            <h3 className="text-3xl font-black text-white">{health?.database.total_tasks || "0"}</h3>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold">Platform Botu</p>
                        </div>

                        <div className="bg-[#13151a] border border-gray-800 rounded-2xl p-6">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">CPU Kullanımı</p>
                            <h3 className="text-3xl font-black text-white">{health?.server.cpu || "0%"}</h3>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div
                                    className="bg-blue-500 h-full transition-all duration-1000"
                                    style={{ width: health?.server.cpu || '0%' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Server Detailed Specs */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-[#13151a] border border-gray-800 rounded-3xl p-8">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Server className="text-blue-500 h-5 w-5" />
                                Sunucu Kaynak Dağılımı
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                                        <span>Bellek (RAM) Kullanımı</span>
                                        <span className="text-white">{health?.server.memory}</span>
                                    </div>
                                    <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-800">
                                        <div className="bg-emerald-500 h-full" style={{ width: health?.server.memory.split('%')[0] + '%' }} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                                        <span>Disk Doluluk Oranı</span>
                                        <span className="text-white">{health?.server.disk}</span>
                                    </div>
                                    <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-800">
                                        <div className="bg-orange-500 h-full" style={{ width: health?.server.disk.split('%')[0] + '%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#13151a] border border-gray-800 rounded-3xl p-8 flex flex-col justify-center">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-gray-800/50">
                                    <span className="text-xs font-bold text-gray-500 uppercase">İşletim Sistemi</span>
                                    <span className="text-sm font-black text-white tracking-widest">{health?.server.os}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-gray-800/50">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Backend Servis</span>
                                    <span className="text-sm font-black text-green-500 tracking-widest uppercase">FastAPI v0.109.0</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-gray-800/50">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Veritabanı Motoru</span>
                                    <span className="text-sm font-black text-blue-400 tracking-widest uppercase">PostgreSQL 16</span>
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
