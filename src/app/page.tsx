"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Zap, Package, Activity, Clock, Server, RefreshCw } from "lucide-react";
import Link from "next/link";
import { StatsCard } from "@/components/StatsCard";
import { botApi } from "@/services/botApi";
import { cn } from "@/lib/utils";

interface HealthData {
  status: string;
  pulse?: {
    status: "healthy" | "busy" | "critical" | "error";
    message: string;
  };
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

export default function Home() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = async () => {
    try {
      const data = await botApi.getSystemHealth();
      setHealth(data);
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchData, 2000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = () => {
    if (!mounted) return "";
    return new Date().toLocaleString("tr-TR");
  };

  // Determine status color for StatsCard based on pulse
  const getPulseColor = (status: string) => {
    switch (status) {
      case "healthy": return "success";
      case "busy": return "warning";
      case "critical": return "danger";
      case "error": return "danger";
      default: return "neutral";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <LayoutDashboard className="text-green-500 h-8 w-8" />
            Genel Bakış
          </h1>
          <p className="text-gray-400 mt-1">LUMORA Analiz Motoru'nun anlık durum raporu ve özet verileri.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
              autoRefresh
                ? "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                : "bg-gray-500/5 text-gray-500 border-gray-800"
            )}
          >
            <div className={cn("h-1.5 w-1.5 rounded-full", autoRefresh ? "bg-green-500 animate-pulse" : "bg-gray-500")} />
            {autoRefresh ? "CANLI TAKİP AKTİF" : "OTOMATİK GÜNCELLEME KAPALI"}
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-xl bg-white/5 border border-gray-800 text-gray-400 hover:text-white transition-all hover:bg-white/10"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="TOPLAM ÜRÜN"
          value={loading || !health ? "..." : (health.database?.total_products?.toLocaleString() || "0")}
          subLabel="Veritabanı Kaydı"
          status="neutral"
        />
        <StatsCard
          title="AKTİF BOTLAR"
          value={loading || !health ? "..." : (health.database?.total_tasks?.toString() || "0")}
          subLabel="Platform Görevi"
          status={(health?.database?.total_tasks || 0) > 0 ? "success" : "neutral"}
        />
        <StatsCard
          title="TOPLAM LOG"
          value={loading || !health ? "..." : (health.database?.total_logs?.toLocaleString() || "0")}
          subLabel="İşlem Geçmişi"
          status="neutral"
        />
        <StatsCard
          title="SİSTEM DURUMU"
          value={loading || !health ? "..." : (health.pulse?.message || "YÜKLENİYOR")}
          subLabel="Sunucu Nabzı"
          status={getPulseColor(health?.pulse?.status || "neutral")}
        />
      </div>

      {/* Server Resources & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resource Distribution */}
        <div className="lg:col-span-2 bg-[#13151a] border border-gray-800 rounded-[2.5rem] p-10 relative overflow-hidden group">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
            <Server className="text-blue-500 h-6 w-6" />
            Sunucu Kaynak Dağılımı
          </h3>

          <div className="space-y-8">
            {/* CPU */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">İşlemci (CPU) Kullanımı</span>
                  <div className="text-2xl font-black text-white">{health?.server?.cpu || "0.0%"}</div>
                </div>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-gray-800/50">
                <div
                  className="bg-blue-500 h-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  style={{ width: health?.server?.cpu || '0%' }}
                />
              </div>
            </div>

            {/* RAM */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Bellek (RAM) Kullanımı</span>
                  <div className="text-2xl font-black text-white">{health?.server?.memory || "0.0%"}</div>
                </div>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-gray-800/50">
                <div
                  className="bg-emerald-500 h-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  style={{ width: (health?.server?.memory?.split('%')[0] || '0') + '%' }}
                />
              </div>
            </div>

            {/* DISK */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Disk Doluluk Oranı</span>
                  <div className="text-2xl font-black text-white">{health?.server?.disk || "0.0%"}</div>
                </div>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-gray-800/50">
                <div
                  className="bg-orange-500 h-full transition-all duration-1000 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                  style={{ width: (health?.server?.disk?.split('%')[0] || '0') + '%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-[2.5rem] p-8 text-black group relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <Zap size={120} />
            </div>

            <div className="relative z-10">
              <div className="bg-black/10 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Hızlı Erişim</div>
              <h2 className="text-3xl font-black mb-3 leading-none">Bot Kontrol Üssü</h2>
              <p className="text-black/70 font-bold text-sm leading-relaxed">
                Tüm mağaza botlarını buradan yönetebilir, anlık logları izleyebilirsiniz.
              </p>
            </div>

            <Link
              href="/bots"
              className="mt-8 bg-black text-white text-center py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
              Yönetimi Başlat
            </Link>
          </div>

          <div className="bg-[#13151a] border border-gray-800 rounded-[2rem] p-6 space-y-4">
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-gray-800/50">
              <span className="text-[10px] font-bold text-gray-500 uppercase">İşletim Sistemi</span>
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{health?.server?.os || "Linux"}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-gray-800/50 text-green-500">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Backend Servis</span>
              <span className="text-[10px] font-black uppercase tracking-widest">FastAPI ⚡</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-gray-800/50 text-blue-400">
              <span className="text-[10px] font-bold text-gray-500 uppercase">DB Engine</span>
              <span className="text-[10px] font-black uppercase tracking-widest">PostgreSQL 16</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-center gap-4 py-4 border-t border-gray-800/50">
        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          <Clock size={12} />
          Son Güncelleme: {formatDate()}
        </div>
      </div>
    </div>
  );
}
