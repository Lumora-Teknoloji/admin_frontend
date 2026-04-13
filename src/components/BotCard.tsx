"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit2, Pause, AlertTriangle, Link as LinkIcon, Activity, Settings, Save, X, Layers, Check, FileText, Wifi, Shield, Clock, Inbox, Zap, Plug, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Bot, BotSettingsUpdate, botApi } from "@/services/botApi";

// Mode-specific visual theme
function getModeTheme(mode: string) {
    switch (mode) {
        case 'worker':
            return {
                accentColor: 'amber',
                borderActive: 'border-amber-500/30',
                borderIdle: 'border-amber-500/10',
                glowBg: 'rgba(245, 158, 11, 0.06)',
                topLine: 'from-transparent via-amber-500 to-transparent',
                topLineIdle: 'from-transparent via-amber-500/30 to-transparent',
                avatarRing: 'ring-amber-500/40',
                avatarRingIdle: 'ring-amber-500/15',
                dotActive: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]',
                dotIdle: 'bg-amber-500/40',
                badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                badgeIcon: '⚙️',
                badgeLabel: 'WORKER',
                statBorder: 'border-amber-500/8',
                statGlow: 'hover:border-amber-500/20 hover:shadow-[0_0_15px_rgba(245,158,11,0.05)]',
                terminalBorder: 'border-l-amber-500/30',
                btnStart: 'from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 border-amber-400/50 shadow-amber-500/20 hover:shadow-amber-500/40',
                btnStop: 'from-amber-500/20 to-orange-600/20 hover:from-amber-500/30 hover:to-orange-600/30 text-amber-500 border-amber-500/40',
                avatarImg: 'bot_worker.png',
                avatarGlowRun: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]',
                avatarGlowIdle: 'drop-shadow-[0_0_4px_rgba(245,158,11,0.2)]',
                avatarAnim: 'animate-pulse',
            };
        case 'linker':
            return {
                accentColor: 'purple',
                borderActive: 'border-purple-500/30',
                borderIdle: 'border-purple-500/10',
                glowBg: 'rgba(168, 85, 247, 0.06)',
                topLine: 'from-transparent via-purple-500 to-transparent',
                topLineIdle: 'from-transparent via-purple-500/30 to-transparent',
                avatarRing: 'ring-purple-500/40',
                avatarRingIdle: 'ring-purple-500/15',
                dotActive: 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]',
                dotIdle: 'bg-purple-500/40',
                badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                badgeIcon: '🔗',
                badgeLabel: 'LINKER',
                statBorder: 'border-purple-500/8',
                statGlow: 'hover:border-purple-500/20 hover:shadow-[0_0_15px_rgba(168,85,247,0.05)]',
                terminalBorder: 'border-l-purple-500/30',
                btnStart: 'from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 border-purple-400/50 shadow-purple-500/20 hover:shadow-purple-500/40',
                btnStop: 'from-purple-500/20 to-violet-600/20 hover:from-purple-500/30 hover:to-violet-600/30 text-purple-500 border-purple-500/40',
                avatarImg: 'bot_scout.png',
                avatarGlowRun: 'drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]',
                avatarGlowIdle: 'drop-shadow-[0_0_4px_rgba(168,85,247,0.2)]',
                avatarAnim: 'animate-float',
            };
        case 'review':
            return {
                accentColor: 'yellow',
                borderActive: 'border-yellow-500/30',
                borderIdle: 'border-yellow-500/10',
                glowBg: 'rgba(234, 179, 8, 0.06)',
                topLine: 'from-transparent via-yellow-500 to-transparent',
                topLineIdle: 'from-transparent via-yellow-500/30 to-transparent',
                avatarRing: 'ring-yellow-500/40',
                avatarRingIdle: 'ring-yellow-500/15',
                dotActive: 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]',
                dotIdle: 'bg-yellow-500/40',
                badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                badgeIcon: '💬',
                badgeLabel: 'REVIEW',
                statBorder: 'border-yellow-500/8',
                statGlow: 'hover:border-yellow-500/20 hover:shadow-[0_0_15px_rgba(234,179,8,0.05)]',
                terminalBorder: 'border-l-yellow-500/30',
                btnStart: 'from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 border-yellow-400/50 shadow-yellow-500/20 hover:shadow-yellow-500/40',
                btnStop: 'from-yellow-500/20 to-amber-600/20 hover:from-yellow-500/30 hover:to-amber-600/30 text-yellow-500 border-yellow-500/40',
                avatarImg: 'bot_head.png',
                avatarGlowRun: 'drop-shadow-[0_0_12px_rgba(234,179,8,0.5)]',
                avatarGlowIdle: 'drop-shadow-[0_0_4px_rgba(234,179,8,0.2)]',
                avatarAnim: 'animate-pulse',
            };
        default: // normal
            return {
                accentColor: 'emerald',
                borderActive: 'border-emerald-500/30',
                borderIdle: 'border-emerald-500/10',
                glowBg: 'rgba(16, 185, 129, 0.06)',
                topLine: 'from-transparent via-emerald-500 to-transparent',
                topLineIdle: 'from-transparent via-emerald-500/30 to-transparent',
                avatarRing: 'ring-emerald-500/40',
                avatarRingIdle: 'ring-emerald-500/15',
                dotActive: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]',
                dotIdle: 'bg-emerald-500/40',
                badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                badgeIcon: '🤖',
                badgeLabel: 'NORMAL',
                statBorder: 'border-emerald-500/8',
                statGlow: 'hover:border-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.05)]',
                terminalBorder: 'border-l-emerald-500/30',
                btnStart: 'from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 border-emerald-400/50 shadow-emerald-500/20 hover:shadow-emerald-500/40',
                btnStop: 'from-rose-500/20 to-red-600/20 hover:from-rose-500/30 hover:to-red-600/30 text-red-500 border-red-500/40',
                avatarImg: 'bot_head.png',
                avatarGlowRun: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]',
                avatarGlowIdle: 'drop-shadow-[0_0_4px_rgba(16,185,129,0.2)]',
                avatarAnim: 'animate-bounce',
            };
    }
}

interface BotCardProps {
    bot: Bot;
    onStart: (id: number) => Promise<void>;
    onWorkerStart: (id: number) => Promise<void>;
    onStop: (id: number) => Promise<void>;
    onUpdate: (id: number, settings: BotSettingsUpdate) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onSpeedMode?: (id: number) => Promise<void>;
}

// Helper: Compute status info deterministically
function getStatusInfo(bot: Bot) {
    if (bot.is_critical) {
        return {
            color: 'red',
            badgeClass: "bg-red-500/10 text-red-500 border-red-500/20 ring-red-500/20",
            glowColor: 'rgba(239, 68, 68, 0.4)',
            label: "KRİTİK HATA",
            iconType: 'alert' as const,
            viaColor: 'via-red-500'
        };
    }

    switch (bot.status) {
        case 'running':
            return {
                color: 'emerald',
                badgeClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 ring-emerald-500/20 animate-pulse-subtle",
                glowColor: 'rgba(16, 185, 129, 0.4)',
                label: "SİSTEM AKTİF",
                iconType: 'pulse' as const,
                viaColor: 'via-emerald-500'
            };
        case 'worker_running':
            return {
                color: 'amber',
                badgeClass: "bg-amber-500/10 text-amber-500 border-amber-500/20 ring-amber-500/20 animate-pulse-subtle",
                glowColor: 'rgba(245, 158, 11, 0.4)',
                label: "İŞLENİYOR",
                iconType: 'activity' as const,
                viaColor: 'via-amber-500'
            };
        case 'idle':
            return {
                color: 'indigo',
                badgeClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 ring-indigo-500/20",
                glowColor: 'rgba(99, 102, 241, 0.4)',
                label: "BEKLENİYOR",
                iconType: 'pause' as const,
                viaColor: 'via-indigo-500'
            };
        case 'error':
            return {
                color: 'red',
                badgeClass: "bg-red-500/10 text-red-500 border-red-500/20 ring-red-500/20",
                glowColor: 'rgba(239, 68, 68, 0.4)',
                label: "HATA OLUŞTU",
                iconType: 'alert' as const,
                viaColor: 'via-red-500'
            };
        default:
            return {
                color: 'slate',
                badgeClass: "bg-gray-500/10 text-gray-500 border-gray-500/20 ring-gray-500/20",
                glowColor: 'rgba(148, 163, 184, 0.2)',
                label: "PASİF / OFFLINE",
                iconType: 'x' as const,
                viaColor: 'via-slate-500'
            };
    }
}

// Stable status icon component
function StatusIcon({ type }: { type: 'alert' | 'pulse' | 'activity' | 'pause' | 'x' }) {
    switch (type) {
        case 'alert': return <AlertTriangle className="h-2.5 w-2.5" />;
        case 'pulse': return <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block flex-shrink-0" />;
        case 'activity': return <Activity className="h-2.5 w-2.5" />;
        case 'pause': return <Pause className="h-2.5 w-2.5" />;
        case 'x': return <X className="h-2.5 w-2.5" />;
    }
}

// Bot state visual configuration
function getStateVisuals(botState?: string) {
    switch (botState) {
        case 'waiting_ip':
            return {
                bannerBg: 'bg-amber-500/10',
                bannerBorder: 'border-amber-500/30',
                bannerText: 'text-amber-400',
                bannerLabel: '⏳ IP DEĞİŞTİRİLİYOR',
                bannerDesc: 'Modem IP rotasyonu bekleniyor...',
                Icon: Wifi,
                dotColor: 'bg-amber-500',
                cardBorder: 'border-amber-500/40',
                cardGlow: 'animate-ripple',
                animClass: 'animate-ripple',
                topLine: 'from-amber-500/30 via-amber-500 to-amber-500/30',
            };
        case 'blocked':
            return {
                bannerBg: 'bg-red-500/15',
                bannerBorder: 'border-red-500/40',
                bannerText: 'text-red-400',
                bannerLabel: '🚫 BLOK ALGILANDI',
                bannerDesc: 'Site botu engelledi — IP rotasyonu yapılıyor',
                Icon: Shield,
                dotColor: 'bg-red-500',
                cardBorder: 'border-red-500/50',
                cardGlow: 'animate-red-pulse',
                animClass: 'animate-alarm',
                topLine: 'from-red-500/50 via-red-500 to-red-500/50',
            };
        case 'cooldown':
            return {
                bannerBg: 'bg-sky-500/10',
                bannerBorder: 'border-sky-500/25',
                bannerText: 'text-sky-400',
                bannerLabel: '☕ İNSANİ MOLA',
                bannerDesc: 'Bot dinleniyor — anti-bot koruması',
                Icon: Clock,
                dotColor: 'bg-sky-500',
                cardBorder: 'border-sky-500/30',
                cardGlow: 'animate-breathe',
                animClass: 'animate-breathe',
                topLine: 'from-sky-500/20 via-sky-400 to-sky-500/20',
            };
        case 'context_refresh':
            return {
                bannerBg: 'bg-violet-500/10',
                bannerBorder: 'border-violet-500/25',
                bannerText: 'text-violet-400',
                bannerLabel: '♻️ BELLEK YENİLENİYOR',
                bannerDesc: 'Tarayıcı belleği temizleniyor — yeni parmak izi',
                Icon: Activity,
                dotColor: 'bg-violet-500',
                cardBorder: 'border-violet-500/30',
                cardGlow: 'animate-violet-shimmer',
                animClass: 'animate-violet-shimmer',
                topLine: 'from-violet-500/20 via-violet-400 to-violet-500/20',
            };
        case 'speed_mode':
            return {
                bannerBg: 'bg-fuchsia-500/15',
                bannerBorder: 'border-fuchsia-500/40',
                bannerText: 'text-fuchsia-300',
                bannerLabel: '⚡ HIZ MODU AKTİF',
                bannerDesc: 'Turbo kazıma aktif — kısa gecikmeler',
                Icon: Zap,
                dotColor: 'bg-fuchsia-500',
                cardBorder: 'border-fuchsia-500/50',
                cardGlow: 'animate-energy',
                animClass: 'animate-energy',
                topLine: 'from-fuchsia-500/60 via-fuchsia-400 to-fuchsia-500/60',
            };
        case 'api_mode':
            return {
                bannerBg: 'bg-emerald-500/15',
                bannerBorder: 'border-emerald-500/40',
                bannerText: 'text-emerald-300',
                bannerLabel: '🔌 API MODU AKTİF',
                bannerDesc: 'API-first kazıma aktif — hızlı yükleme',
                Icon: Plug,
                dotColor: 'bg-emerald-500',
                cardBorder: 'border-emerald-500/50',
                cardGlow: '',
                animClass: '',
                topLine: 'from-emerald-500/60 via-emerald-400 to-emerald-500/60',
            };
        case 'queue_empty':
            return {
                bannerBg: 'bg-gray-500/10',
                bannerBorder: 'border-gray-500/20',
                bannerText: 'text-gray-400',
                bannerLabel: '💤 KUYRUK BOŞ',
                bannerDesc: 'Yeni linkler bekleniyor...',
                Icon: Inbox,
                dotColor: 'bg-gray-500',
                cardBorder: 'border-gray-500/20',
                cardGlow: '',
                animClass: 'animate-sleep',
                topLine: 'from-transparent via-gray-500/30 to-transparent',
            };
        case 'critical':
            return {
                bannerBg: 'bg-red-500/20',
                bannerBorder: 'border-red-500/50',
                bannerText: 'text-red-300',
                bannerLabel: '🚨 KRİTİK',
                bannerDesc: 'Sistem müdahalesi gerekiyor!',
                Icon: Zap,
                dotColor: 'bg-red-500',
                cardBorder: 'border-red-500/60',
                cardGlow: 'animate-emergency',
                animClass: 'animate-emergency',
                topLine: 'from-red-500/50 via-red-500 to-red-500/50',
            };
        case 'error_streak':
            return {
                bannerBg: 'bg-orange-500/10',
                bannerBorder: 'border-orange-500/30',
                bannerText: 'text-orange-400',
                bannerLabel: '⚠️ ARDIŞIK HATALAR',
                bannerDesc: 'Birden fazla hata oluştu — izleniyor',
                Icon: AlertTriangle,
                dotColor: 'bg-orange-500',
                cardBorder: 'border-orange-500/30',
                cardGlow: 'animate-warning-blink',
                animClass: 'animate-warning-blink',
                topLine: 'from-orange-500/20 via-orange-500 to-orange-500/20',
            };
        default: // 'scraping' or 'idle'
            return null;
    }
}

export function BotCard({ bot, onStart, onWorkerStart, onStop, onUpdate, onDelete, onSpeedMode }: BotCardProps) {
    const router = useRouter();
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/bot-admin';
    const [isEditing, setIsEditing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);

    // Computed values
    const statusInfo = useMemo(() => getStatusInfo(bot), [bot.status, bot.is_critical]);
    const modeTheme = useMemo(() => getModeTheme(bot.mode), [bot.mode]);
    const isRunning = bot.status === 'running' || bot.status === 'worker_running';
    const isWorker = bot.mode === 'worker';
    const stateVisuals = useMemo(() => getStateVisuals(bot.bot_state), [bot.bot_state]);

    // Countdown timer for timed states
    const [countdown, setCountdown] = useState(0);
    useEffect(() => {
        if (!bot.state_countdown || !bot.state_started_at || !stateVisuals) {
            setCountdown(0);
            return;
        }
        const updateCountdown = () => {
            const started = new Date(bot.state_started_at!).getTime();
            const now = Date.now();
            const elapsed = Math.floor((now - started) / 1000);
            const remaining = Math.max(0, bot.state_countdown! - elapsed);
            setCountdown(remaining);
        };
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [bot.state_countdown, bot.state_started_at, stateVisuals]);

    useEffect(() => {
        if (pendingStatus && (bot.status === pendingStatus || (pendingStatus === 'stopped' && bot.status === 'idle'))) {
            setPendingStatus(null);
            setIsProcessing(false);
        }
    }, [bot.status, pendingStatus]);

    // Uptime timer — çalışırken canlı sayar, durdurulunca son değerde sabit kalır
    const [liveUptime, setLiveUptime] = useState(bot.uptime_seconds || 0);
    useEffect(() => {
        setLiveUptime(bot.uptime_seconds || 0);
    }, [bot.uptime_seconds]);
    useEffect(() => {
        if (!isRunning) return; // Durdurulunca sayma, ama resetleme
        const interval = setInterval(() => setLiveUptime(prev => prev + 1), 1000);
        return () => clearInterval(interval);
    }, [isRunning]);
    const uptimeH = Math.floor(liveUptime / 3600);
    const uptimeM = Math.floor((liveUptime % 3600) / 60);
    const uptimeS = liveUptime % 60;
    const uptimeText = uptimeH > 0
        ? `${uptimeH}s ${String(uptimeM).padStart(2, '0')}dk`
        : `${uptimeM}dk ${String(uptimeS).padStart(2, '0')}sn`;

    const handleNavigateToLogs = useCallback(() => {
        router.push(`/logs?filter=${encodeURIComponent(bot.name)}`);
    }, [router, bot.name]);

    // Editable state
    const [keyword, setKeyword] = useState(bot.keyword);
    const [startTime, setStartTime] = useState(bot.start_time);
    const [endTime, setEndTime] = useState(bot.end_time);
    const [pageLimit, setPageLimit] = useState(bot.page_limit);

    // Message History State
    const [messageHistory, setMessageHistory] = useState<{ message: string; url: string }[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bot.last_message) {
            const currentUrl = bot.last_product_url || (bot.keyword ? `https://www.trendyol.com/sr?q=${encodeURIComponent(bot.keyword)}` : "");

            setMessageHistory(prev => {
                const lastEntry = prev[prev.length - 1];
                if (!lastEntry || lastEntry.message !== bot.last_message || lastEntry.url !== currentUrl) {
                    const newHistory = [...prev, { message: bot.last_message || "Bot hazır.", url: currentUrl }];
                    return newHistory.slice(-10);
                }
                return prev;
            });
        }
    }, [bot.last_message, bot.last_product_url, bot.keyword]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messageHistory]);

    const handleSave = async () => {
        setIsProcessing(true);
        try {
            await onUpdate(bot.id, {
                keyword,
                start_time: startTime,
                end_time: endTime,
                page_limit: pageLimit,
                is_active: true
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save settings:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancel = () => {
        setKeyword(bot.keyword);
        setStartTime(bot.start_time);
        setEndTime(bot.end_time);
        setPageLimit(bot.page_limit);
        setIsEditing(false);
    };

    const handleToggleStatus = async () => {
        if (isEditing) {
            await handleSave();
        }

        const targetStatus = isRunning ? "stopped" : "running";
        setIsProcessing(true);
        setPendingStatus(targetStatus);

        try {
            if (isRunning) {
                await onStop(bot.id);
            } else {
                await onStart(bot.id);
            }
        } catch (error) {
            console.error("Failed to toggle status:", error);
            setIsProcessing(false);
            setPendingStatus(null);
        }
    };

    const handleWorkerStart = async () => {
        setIsProcessing(true);
        setPendingStatus("worker_running");
        try {
            await onWorkerStart(bot.id);
        } catch (error) {
            console.error("Failed to start worker:", error);
            setIsProcessing(false);
            setPendingStatus(null);
        }
    };

    const handleDelete = async () => {
        setIsProcessing(true);
        try {
            await onDelete(bot.id);
        } catch (error) {
            console.error("Failed to delete bot:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSpeedMode = async () => {
        setIsProcessing(true);
        try {
            await botApi.activateSpeedMode(bot.id, 30);
            // Anında local state'i aktif et (backend yanıtını beklemeden)
            setSpeedModeActive(true);
            setSpeedModeEnd(Date.now() + 30 * 60 * 1000); // 30 dakika
        } catch (error) {
            console.error("Failed to activate speed mode:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Speed mode: local state + backend state
    const [speedModeActive, setSpeedModeActive] = useState(false);
    const [speedModeEnd, setSpeedModeEnd] = useState<number | null>(null);
    const [speedModeRemaining, setSpeedModeRemaining] = useState(0);

    // Countdown timer for speed mode
    useEffect(() => {
        if (!speedModeActive || !speedModeEnd) return;
        const interval = setInterval(() => {
            const remaining = Math.max(0, speedModeEnd - Date.now());
            setSpeedModeRemaining(remaining);
            if (remaining <= 0) {
                setSpeedModeActive(false);
                setSpeedModeEnd(null);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [speedModeActive, speedModeEnd]);

    // Sync from backend state
    useEffect(() => {
        if (bot.bot_state === 'speed_mode' && !speedModeActive) {
            setSpeedModeActive(true);
            // Backend'den countdown geliyorsa onu kullan
            if (bot.state_countdown && bot.state_countdown > 0) {
                setSpeedModeEnd(Date.now() + bot.state_countdown * 1000);
            }
        }
        if (bot.bot_state !== 'speed_mode' && bot.bot_state !== 'scraping' && speedModeActive) {
            // Başka bir state'e geçtiyse (cooldown, blocked vs.) speed mode devam edebilir
        }
    }, [bot.bot_state, bot.state_countdown]);

    const isSpeedMode = speedModeActive || bot.bot_state === 'speed_mode';
    const speedMinLeft = Math.floor(speedModeRemaining / 60000);
    const speedSecLeft = Math.floor((speedModeRemaining % 60000) / 1000);
    const speedProgress = speedModeEnd ? ((speedModeEnd - Date.now()) / (30 * 60 * 1000)) * 100 : 0;

    // 🔌 API Mode: toggle state
    const [apiModeActive, setApiModeActive] = useState(false);

    // Sync API mode from backend state
    useEffect(() => {
        if (bot.bot_state === 'api_mode' && !apiModeActive) {
            setApiModeActive(true);
        }
        if (bot.bot_state !== 'api_mode' && bot.bot_state !== 'scraping' && apiModeActive) {
            // Başka bir state'e geçtiyse api mode kapanmış olabilir
        }
    }, [bot.bot_state]);

    const handleApiMode = async () => {
        setIsProcessing(true);
        try {
            await botApi.toggleApiMode(bot.id);
            setApiModeActive(!apiModeActive);
        } catch (error) {
            console.error("Failed to toggle API mode:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    // 🌐 Proxy Mode: toggle state — sync from backend
    const [proxyModeActive, setProxyModeActive] = useState(bot.use_proxy || false);

    useEffect(() => {
        setProxyModeActive(bot.use_proxy || false);
    }, [bot.use_proxy]);

    const handleProxyMode = async () => {
        setIsProcessing(true);
        try {
            await botApi.toggleProxyMode(bot.id);
            setProxyModeActive(!proxyModeActive);
        } catch (error) {
            console.error("Failed to toggle proxy mode:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Button text
    const buttonText = useMemo(() => {
        if (isProcessing) {
            if (pendingStatus === 'stopped') return "DURDURULUYOR...";
            if (pendingStatus === 'worker_running') return "BAŞLATILIYOR...";
            return "İŞLENİYOR...";
        }
        if (bot.status === "running") return bot.mode === "linker" ? "DURDUR" : "DURDUR";
        if (bot.status === "worker_running") return `DURDUR (KALAN: ${bot.pending_links})`;
        return bot.mode === "linker" ? "LİNK TOPLA" : bot.mode === "review" ? "API İLE TOPLA" : "BAŞLAT";
    }, [isProcessing, pendingStatus, bot.status, bot.pending_links]);

    const showPauseIcon = !isProcessing && isRunning;

    const isLinker = bot.mode === "linker";
    const isReview = bot.mode === "review";

    const statsData = useMemo(() => [
        { label: isReview ? "KAZILAN YORUM" : isLinker ? "TOPLANAN LİNK" : "KAZILAN ÜRÜN", value: bot.stats.scraped, color: "text-white", Icon: LinkIcon, hoverColor: "group-hover:text-blue-400" },
        { label: isReview ? "İŞLENEN ÜRÜN" : "SAYFA", value: isReview ? `${bot.pages_scraped || 0}/${bot.page_limit || 50}` : `${bot.pages_scraped || 0}/${bot.page_limit || 0}`, color: "text-purple-400", Icon: FileText, hoverColor: "group-hover:text-purple-300" },
        { label: "HATALAR", value: bot.stats.errors, color: "text-red-500", Icon: AlertTriangle, action: handleNavigateToLogs, hoverBorder: "hover:border-red-500/50" },
        { label: isReview ? "BOŞ ÜRÜN" : isLinker ? "BEKLEYENLER" : "KUYRUK", value: isReview ? Math.max(0, (bot.pages_scraped || 0) - bot.stats.scraped) : bot.pending_links, color: "text-amber-500", Icon: Layers, hoverColor: "group-hover:text-amber-400" }
    ], [bot.stats.scraped, bot.stats.validated, bot.stats.errors, bot.pending_links, bot.pages_scraped, bot.page_limit, handleNavigateToLogs, isLinker, isReview]);

    return (
        <div className="group relative">
            {/* Ambient Back Glow — speed mode override or mode colored */}
            <div
                className={cn(
                    "absolute -inset-0.5 rounded-2xl blur-xl transition-all duration-1000 pointer-events-none",
                    isSpeedMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
                style={{
                    background: apiModeActive
                        ? 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)'
                        : isSpeedMode
                            ? 'radial-gradient(circle, rgba(217,70,239,0.3) 0%, transparent 70%)'
                            : `radial-gradient(circle, ${modeTheme.glowBg.replace('0.06', '0.15')} 0%, transparent 70%)`
                }}
            />

            {/* Main Card Container — mode-tinted border */}
            <div className={cn(
                "relative overflow-hidden rounded-xl p-5 transition-all duration-500 transform hover:scale-[1.01]",
                "bg-[#13151a]/90 backdrop-blur-sm",
                isSpeedMode
                    ? 'border-fuchsia-500/50 shadow-[0_0_35px_rgba(217,70,239,0.2)]'
                    : apiModeActive
                        ? 'border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.2)]'
                        : (stateVisuals ? stateVisuals.cardBorder : (isRunning ? modeTheme.borderActive : modeTheme.borderIdle)),
                !isSpeedMode && !apiModeActive && stateVisuals ? stateVisuals.cardGlow : '',
                !isSpeedMode && !apiModeActive && stateVisuals?.animClass,
                "border"
            )}>
                {/* Speed Mode Background Overlay */}
                {isSpeedMode && (
                    <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                )}
                {/* API Mode Background Overlay */}
                {apiModeActive && !isSpeedMode && (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />
                )}

                {/* Status Border Line (Top) — speed mode animated or state/mode colored */}
                <div className={cn(
                    "absolute top-0 inset-x-0 pointer-events-none bg-gradient-to-r transition-all duration-500",
                    isSpeedMode
                        ? 'h-[3px] from-fuchsia-500/80 via-fuchsia-400 to-fuchsia-500/80 opacity-100'
                        : cn('h-[2px]', stateVisuals ? stateVisuals.topLine + ' opacity-100' : (isRunning ? modeTheme.topLine + ' opacity-80' : modeTheme.topLineIdle + ' opacity-40'))
                )} />

                {/* Header Section */}
                <div className="relative mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                {/* Bot Avatar/Head — mode specific */}
                                <div className={cn(
                                    "relative h-12 w-12 rounded-lg flex items-center justify-center overflow-hidden border transition-all duration-500 ring-offset-1 ring-offset-transparent",
                                    isSpeedMode
                                        ? 'border-fuchsia-500/40 ring-2 ring-fuchsia-500/60 shadow-[0_0_15px_rgba(217,70,239,0.3)]'
                                        : cn('border-white/10 bg-black/40', isRunning ? cn('ring-2', modeTheme.avatarRing) : cn('ring-1', modeTheme.avatarRingIdle))
                                )}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                                        <img
                                            src={`${basePath}/assets/${modeTheme.avatarImg}`}
                                            alt="Bot"
                                            className={cn(
                                                "h-9 w-9 object-contain transition-all duration-700",
                                                isRunning
                                                    ? cn(modeTheme.avatarGlowRun, modeTheme.avatarAnim)
                                                    : "grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"
                                            )}
                                        />
                                    </div>
                                </div>
                                {/* Status Indicator Dot (Pulsing) */}
                                <div className={cn(
                                    "absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#16191e] flex items-center justify-center",
                                    isRunning ? modeTheme.dotActive : modeTheme.dotIdle
                                )}>
                                    <div className={cn(
                                        "absolute inset-0 rounded-full animate-ping bg-inherit pointer-events-none",
                                        bot.status === 'running' ? "opacity-75" : "opacity-0"
                                    )} />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white tracking-tight leading-tight flex items-center gap-2">
                                    {bot.name}
                                    <span className="bg-[#252830] text-[9px] px-1.5 py-0.5 rounded text-gray-400 font-mono border border-white/5">{bot.platform}</span>
                                    <span className={cn(
                                        "text-[9px] px-1.5 py-0.5 rounded font-bold border",
                                        modeTheme.badge
                                    )}>
                                        {modeTheme.badgeIcon} {modeTheme.badgeLabel}
                                    </span>
                                </h3>
                                <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                                    {/* Status Badge */}
                                    <div className={cn(
                                        "px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider flex items-center gap-1.5 border transition-all duration-300 ring-1 ring-inset",
                                        statusInfo.badgeClass
                                    )}>
                                        <StatusIcon type={statusInfo.iconType} />
                                        <span>{statusInfo.label}</span>
                                    </div>

                                    {/* Error message */}
                                    <span className={cn(
                                        "text-[9px] text-gray-500 truncate max-w-[120px] bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10 transition-all duration-300",
                                        bot.is_critical && bot.last_error ? "opacity-100" : "opacity-0 w-0 p-0 border-0 overflow-hidden"
                                    )}>
                                        {bot.last_error || ""}
                                    </span>

                                    {/* Mini indicators — IP + Uptime */}
                                    <div className="flex items-center gap-1">
                                        {/* Proxy badge */}
                                        {proxyModeActive && (
                                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 text-[8px] font-bold border border-cyan-500/30 animate-pulse">
                                                <Globe className="h-2 w-2" />
                                                <span>PROXY</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400/70 text-[8px] font-bold">
                                            <Settings className="h-2 w-2" />
                                            <span>{bot.stats.processed} IP</span>
                                        </div>

                                        <div className={cn(
                                            "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-mono font-medium tabular-nums transition-all duration-300",
                                            isRunning
                                                ? "bg-sky-500/10 text-sky-400"
                                                : "bg-white/[0.03] text-gray-500",
                                            liveUptime > 0 ? "opacity-100" : "opacity-0 w-0 p-0 overflow-hidden"
                                        )}>
                                            <Clock className="h-2 w-2" />
                                            <span>{uptimeText}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Actions - Stable DOM: always render all buttons, hide with CSS */}
                        <div className="flex items-center gap-1">
                            {/* Cancel Schedule Button */}
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    setIsProcessing(true);
                                    try { await onStop(bot.id); } catch (err) { console.error(err); } finally { setIsProcessing(false); }
                                }}
                                disabled={isProcessing}
                                className={cn(
                                    "p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors",
                                    bot.status === "idle" ? "visible" : "invisible w-0 p-0 overflow-hidden"
                                )}
                                title="Zamanlamayı İptal Et"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {/* Edit/Save Toggle - Both always rendered, visibility toggled */}
                            <div className="flex items-center">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className={cn("p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors", isEditing && "hidden")}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <div className={cn("flex gap-1 bg-black/30 rounded-lg p-1 border border-white/5", !isEditing && "hidden")}>
                                    <button onClick={handleSave} className="p-1 hover:text-green-400 text-gray-400 transition-colors"><Save className="h-3.5 w-3.5" /></button>
                                    <button onClick={handleCancel} className="p-1 hover:text-red-400 text-gray-400 transition-colors"><X className="h-3.5 w-3.5" /></button>
                                </div>
                            </div>

                            <button
                                onClick={handleDelete}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Configuration Grid - Both states always rendered, toggled with CSS */}
                <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
                    <div className="col-span-2 space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest px-1">
                            {isReview ? "Yorum Modu" : isWorker ? "Kaynak Bot" : "Hedef Kelime"}
                        </label>
                        <div className="relative">
                            {isReview ? (
                                <div className="w-full bg-yellow-500/5 border border-yellow-500/20 rounded-lg px-3 py-2.5 text-sm text-yellow-300 font-medium flex items-center gap-2">
                                    <span>💬</span>
                                    <span>DB'deki ürünlerin yorumlarını kazır</span>
                                </div>
                            ) : isWorker ? (
                                <div className="w-full bg-[#0d0f14]/80 border border-purple-500/20 rounded-lg px-3 py-2.5 text-sm text-purple-300 font-medium flex items-center gap-2">
                                    <span>🔗</span>
                                    <span>{bot.source_bot_name || `Bot #${bot.source_task_id}` || "Tanımsız"}</span>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        className={cn("w-full bg-[#0d0f14] border border-green-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-all shadow-[0_0_15px_rgba(34,197,94,0.1)]", !isEditing && "hidden")}
                                    />
                                    <div
                                        onClick={() => setIsEditing(true)}
                                        className={cn("w-full bg-[#0d0f14]/80 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-gray-200 font-medium cursor-pointer hover:border-white/10 hover:bg-[#0d0f14] transition-all flex items-center justify-between group/input", isEditing && "hidden")}
                                    >
                                        <span className={!keyword ? "text-gray-600 italic" : ""}>{keyword || "Tanımsız..."}</span>
                                        <Edit2 className="h-3 w-3 text-gray-600 opacity-0 group-hover/input:opacity-100 transition-opacity" />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Hide schedule and page limit for Worker and Review bots */}
                    {!isWorker && !isReview && (
                        <>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest px-1">Başlangıç - Bitiş</label>
                                <div className="flex items-center gap-2">
                                    <div className={cn("flex items-center gap-2 w-full", !isEditing && "hidden")}>
                                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="bg-[#0d0f14] border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white w-full text-center focus:outline-none focus:border-green-500" />
                                        <span className="text-gray-600">-</span>
                                        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="bg-[#0d0f14] border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white w-full text-center focus:outline-none focus:border-green-500" />
                                    </div>
                                    <div onClick={() => setIsEditing(true)} className={cn("w-full bg-[#0d0f14]/50 border border-white/5 rounded-lg px-3 py-2 text-xs text-center text-gray-400 font-mono cursor-pointer hover:bg-[#0d0f14] hover:border-white/10 transition-colors", isEditing && "hidden")}>
                                        {startTime} <span className="text-gray-600 mx-1">➜</span> {endTime}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest px-1">Sayfa Limiti</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={isNaN(pageLimit) ? "" : pageLimit}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            setPageLimit(isNaN(val) ? 0 : val);
                                        }}
                                        className={cn("w-full bg-[#0d0f14] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white text-center focus:outline-none focus:border-green-500", !isEditing && "hidden")}
                                    />
                                    <div onClick={() => setIsEditing(true)} className={cn("w-full bg-[#0d0f14]/50 border border-white/5 rounded-lg px-3 py-2 text-xs text-center text-gray-400 font-mono cursor-pointer hover:bg-[#0d0f14] hover:border-white/10 transition-colors", isEditing && "hidden")}>
                                        {pageLimit || 0} sayfa
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Proxy Toggle — Worker bots only, always visible */}
                {isWorker && (
                    <div
                        onClick={handleProxyMode}
                        className={cn(
                            "flex items-center justify-between px-3 py-2.5 rounded-lg border cursor-pointer transition-all mb-5",
                            proxyModeActive
                                ? "bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/15"
                                : "bg-[#0d0f14]/50 border-white/5 hover:border-white/10 hover:bg-[#0d0f14]"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Globe className={cn("h-3.5 w-3.5", proxyModeActive ? "text-cyan-400" : "text-gray-500")} />
                            <span className={cn("text-xs font-medium", proxyModeActive ? "text-cyan-300" : "text-gray-400")}>
                                Residential Proxy
                            </span>
                        </div>
                        <div className={cn(
                            "w-9 h-5 rounded-full relative transition-all duration-300",
                            proxyModeActive ? "bg-cyan-500" : "bg-gray-700"
                        )}>
                            <div className={cn(
                                "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-md transition-all duration-300",
                                proxyModeActive ? "left-[calc(100%-18px)]" : "left-0.5"
                            )} />
                        </div>
                    </div>
                )}

                {/* Cyber HUD Stats */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                    {statsData.map((stat) => (
                        <div
                            key={stat.label}
                            onClick={stat.action}
                            className={cn(
                                "bg-[#0f1115]/60 border p-2.5 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-300",
                                modeTheme.statBorder,
                                modeTheme.statGlow,
                                stat.action && "cursor-pointer",
                                stat.hoverBorder
                            )}
                        >
                            <div className={cn("text-lg font-black tracking-tight z-10 transition-colors", isSpeedMode ? 'text-fuchsia-400' : stat.color, !isSpeedMode && stat.hoverColor)}>
                                {stat.value}
                            </div>
                            <div className="text-[8px] font-bold text-gray-600 uppercase tracking-widest z-10">{stat.label}</div>

                            {/* Background Icon Watermark */}
                            <stat.Icon className="absolute right-1 bottom-1 h-8 w-8 text-white/[0.02] group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500 pointer-events-none" />
                            {/* Hover Shine Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none transition-opacity" />
                        </div>
                    ))}
                </div>

                {/* Speed Mode Countdown Banner — overrides state banner */}
                {isSpeedMode && speedModeRemaining > 0 ? (
                    <div className="mb-3 rounded-lg border border-fuchsia-500/40 bg-gradient-to-r from-fuchsia-500/15 via-fuchsia-500/10 to-purple-500/15 p-3 transition-all duration-500">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0">
                                <Zap className="h-5 w-5 text-fuchsia-400 animate-bounce" />
                                <div className="absolute inset-0 blur-sm bg-fuchsia-500/30 rounded-full" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-fuchsia-300 uppercase tracking-widest">⚡ HIZ MODU AKTİF</span>
                                    <span className="text-sm font-mono font-black text-fuchsia-300 tabular-nums">
                                        {String(speedMinLeft).padStart(2, '0')}:{String(speedSecLeft).padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="mt-1.5 h-[3px] w-full bg-fuchsia-900/30 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(217,70,239,0.4)]"
                                        style={{ width: `${Math.max(0, Math.min(100, speedProgress))}%` }}
                                    />
                                </div>
                                <span className="text-[8px] text-fuchsia-400/60 mt-1">Turbo kazıma • Kısa gecikmeler • 2 worker paralel</span>
                            </div>
                        </div>
                    </div>
                ) : apiModeActive ? (
                    <div className="mb-3 rounded-lg border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-teal-500/15 p-3 transition-all duration-500">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0">
                                <Plug className="h-5 w-5 text-emerald-400 animate-pulse" />
                                <div className="absolute inset-0 blur-sm bg-emerald-500/30 rounded-full" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">🔌 API TURBO</span>
                                <span className="text-[9px] text-emerald-400/80 mt-0.5 font-mono">
                                    {bot.state_message || 'Saf HTTP kazıma aktif • Tarayıcısız mod'}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={cn(
                        "mb-3 rounded-lg border p-2.5 flex items-center gap-2.5 transition-all duration-500",
                        stateVisuals
                            ? `${stateVisuals.bannerBg} ${stateVisuals.bannerBorder} opacity-100`
                            : bot.is_critical
                                ? "bg-red-500/10 border-red-500/30 opacity-100"
                                : "opacity-0 h-0 p-0 mb-0 border-0 overflow-hidden"
                    )}>
                        {stateVisuals ? (
                            <>
                                <div className={cn("h-2.5 w-2.5 rounded-full shadow-lg flex-shrink-0 animate-dot-breathe", stateVisuals.dotColor)} style={{ boxShadow: `0 0 8px currentColor` }} />
                                <stateVisuals.Icon className={cn("h-4 w-4 flex-shrink-0 animate-icon-float", stateVisuals.bannerText)} />
                                <div className="flex flex-col min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className={cn("text-[9px] font-black uppercase tracking-wider", stateVisuals.bannerText)}>{stateVisuals.bannerLabel}</span>
                                        {countdown > 0 && (
                                            <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border animate-pulse-subtle", stateVisuals.bannerText, stateVisuals.bannerBorder, stateVisuals.bannerBg)}>
                                                ~{countdown}sn
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[8px] text-gray-500 truncate">{bot.state_message || stateVisuals.bannerDesc}</span>
                                    {countdown > 0 && bot.state_countdown && bot.state_countdown > 0 && (
                                        <div className="mt-1.5 h-[3px] w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all duration-1000 ease-linear animate-progress-glow", stateVisuals.dotColor)}
                                                style={{ width: `${(countdown / bot.state_countdown) * 100}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : bot.is_critical ? (
                            <>
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                                <span className="text-[9px] font-black text-red-400 uppercase tracking-wider">KRİTİK HATA</span>
                                <span className="text-[9px] text-red-300/80 truncate flex-1">{bot.last_error || "Bilinmeyen hata"}</span>
                            </>
                        ) : null}
                    </div>
                )}

                {/* Live Console / Terminal View */}
                <div className={cn(
                    "bg-[#0a0b10] rounded-xl border border-white/5 p-3 mb-5 relative overflow-hidden h-32 flex flex-col shadow-inner border-l-2 transition-all duration-500",
                    isSpeedMode ? 'border-l-fuchsia-500/50 border-fuchsia-500/20' :
                        stateVisuals ? stateVisuals.bannerBorder :
                            bot.is_critical ? "border-l-red-500/50 border-red-500/20" : modeTheme.terminalBorder
                )}>
                    <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-[#0a0b10] to-transparent z-10 pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-center justify-between mb-2 z-20">
                        <div className="flex items-center gap-1.5">
                            <div className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                stateVisuals ? cn(stateVisuals.dotColor, stateVisuals.animClass ? 'animate-pulse' : 'animate-pulse') :
                                    bot.is_critical ? "bg-red-500 animate-ping" :
                                        bot.stats.errors > 0 ? "bg-red-500 animate-pulse" : "bg-green-500 animate-pulse"
                            )} />
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Sistem Logları</span>
                        </div>
                        {/* Error/Critical badges */}
                        <div className="flex items-center gap-1">
                            <span className={cn(
                                "text-[8px] font-black px-1.5 py-0.5 rounded border transition-all",
                                bot.is_critical
                                    ? "text-red-400 bg-red-500/15 border-red-500/30 opacity-100 animate-pulse"
                                    : bot.stats.errors > 0
                                        ? "text-amber-400 bg-amber-500/10 border-amber-500/20 opacity-100"
                                        : "opacity-0 pointer-events-none border-transparent"
                            )}>
                                {bot.is_critical ? "🚨 KRİTİK" : `⚠️ ${bot.stats.errors} HATA`}
                            </span>
                        </div>
                    </div>

                    {/* Scrollable Logs — error-aware message styling */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1 relative z-0">
                        {messageHistory.length > 0 ? (
                            messageHistory.map((entry, idx) => {
                                const msg = entry.message || "";
                                const isError = msg.includes('❌') || msg.includes('🚨');
                                const isWarning = msg.includes('⚠️');
                                const isRotation = msg.includes('🔄') || msg.includes('IP');
                                const isWaiting = msg.includes('⏳');
                                const isSuccess = msg.includes('✅');

                                return (
                                    <div key={idx} className="text-[10px] font-mono leading-relaxed group/log animate-in fade-in slide-in-from-left-1 duration-300">
                                        <span className="text-gray-500 mr-2">{new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span className={cn(
                                            isError ? "text-red-400 font-bold" :
                                                isWarning ? "text-amber-400" :
                                                    isRotation ? "text-purple-400" :
                                                        isWaiting ? "text-blue-400 animate-pulse" :
                                                            isSuccess ? "text-green-400" :
                                                                "text-gray-300"
                                        )}>
                                            {msg}
                                        </span>
                                        {entry.url && (
                                            <a href={entry.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-500 hover:text-blue-300 hover:underline opacity-80 decoration-dotted">link ↗</a>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="h-full flex items-center justify-center text-[10px] text-gray-700 font-mono">
                                <span className="animate-pulse">_ terminal hazır...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons (Bottom) — mode-themed */}
                <div className="grid grid-cols-6 gap-1.5">
                    {/* AYAR Button */}
                    <button
                        onClick={() => setIsEditing(true)}
                        className={cn(
                            "col-span-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[8px] font-bold py-2 rounded-lg border border-white/10 hover:border-white/20 transition-all uppercase tracking-wider relative group overflow-hidden backdrop-blur-sm"
                        )}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-1">
                            <Settings className="h-3 w-3" />
                            <span>AYAR</span>
                        </span>
                    </button>

                    {/* ⚡ SPEED MODE — only for running worker bots */}
                    {isWorker && isRunning && (
                        <button
                            onClick={handleSpeedMode}
                            disabled={isProcessing || isSpeedMode}
                            className={cn(
                                "col-span-1 text-[8px] font-bold py-2 rounded-lg border transition-all uppercase tracking-wider relative group overflow-hidden",
                                isSpeedMode
                                    ? "bg-gradient-to-br from-fuchsia-600/40 to-purple-600/40 text-fuchsia-200 border-fuchsia-400/50 shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                                    : "bg-fuchsia-500/5 hover:bg-fuchsia-500/15 text-fuchsia-400/70 hover:text-fuchsia-400 border-fuchsia-500/20 hover:border-fuchsia-500/40"
                            )}
                            title={isSpeedMode ? "Hız modu aktif" : "30dk hız modu aktif et"}
                        >
                            <div className={cn(
                                "absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-fuchsia-400/20 to-transparent z-0 pointer-events-none",
                                isSpeedMode ? "opacity-0" : "opacity-100"
                            )} />
                            {isSpeedMode && (
                                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/20 to-fuchsia-500/0 animate-pulse pointer-events-none" />
                            )}
                            <span className="relative z-10 flex items-center justify-center gap-1">
                                <Zap className={cn("h-3 w-3", isSpeedMode && "text-fuchsia-300 animate-bounce")} />
                                <span>{isSpeedMode && speedModeRemaining > 0 ? `${speedMinLeft}:${String(speedSecLeft).padStart(2, '0')}` : isSpeedMode ? "AKTİF" : "HIZ"}</span>
                            </span>
                        </button>
                    )}

                    {/* 🔌 API MODE — only for running worker bots */}
                    {isWorker && isRunning && (
                        <button
                            onClick={handleApiMode}
                            disabled={isProcessing}
                            className={cn(
                                "col-span-1 text-[8px] font-bold py-2 rounded-lg border transition-all uppercase tracking-wider relative group overflow-hidden",
                                apiModeActive
                                    ? "bg-gradient-to-br from-emerald-600/40 to-teal-600/40 text-emerald-200 border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                    : "bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-400/70 hover:text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40"
                            )}
                            title={apiModeActive ? "API modu aktif — tekrar tıkla kapatmak için" : "API modu aktif et"}
                        >
                            <div className={cn(
                                "absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent z-0 pointer-events-none",
                                apiModeActive ? "opacity-0" : "opacity-100"
                            )} />
                            {apiModeActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 animate-pulse pointer-events-none" />
                            )}
                            <span className="relative z-10 flex items-center justify-center gap-1">
                                <Plug className={cn("h-3 w-3", apiModeActive && "text-emerald-300 animate-pulse")} />
                                <span>{apiModeActive ? "AKTİF" : "API"}</span>
                            </span>
                        </button>
                    )}

                    {/* Main Action Button — BAŞLAT/DURDUR */}
                    <button
                        onClick={handleToggleStatus}
                        disabled={isProcessing}
                        className={cn(
                            "relative overflow-hidden group text-[9px] font-bold py-2 rounded-lg transition-all border tracking-widest uppercase flex items-center justify-center gap-1.5",
                            isRunning
                                ? (isWorker ? "col-span-3" : "col-span-5")
                                : (isLinker ? "col-span-5" : isWorker ? "col-span-5" : "col-span-2"),
                            isRunning
                                ? cn("bg-gradient-to-br shadow-lg", modeTheme.btnStop)
                                : cn("bg-gradient-to-br text-white shadow-lg hover:-translate-y-0.5", modeTheme.btnStart)
                        )}
                    >
                        <div className={cn(
                            "absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-0 pointer-events-none transition-opacity",
                            !isRunning ? "opacity-100" : "opacity-0"
                        )} />

                        <span className="relative z-10 flex items-center gap-1.5">
                            {showPauseIcon && <Pause className="h-3 w-3 fill-current" />}
                            <span>{buttonText}</span>
                        </span>
                    </button>

                    {/* KUYRUĞU ERİT — only for Normal bot when not running */}
                    {!isWorker && !isLinker && !isRunning && (
                        <button
                            onClick={handleWorkerStart}
                            disabled={isProcessing || isRunning}
                            className="col-span-2 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-[9px] font-bold py-2.5 rounded-lg border border-amber-400/50 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all tracking-tight uppercase relative group overflow-hidden hover:-translate-y-0.5"
                        >
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-0 pointer-events-none" />
                            <span className="relative z-10 flex items-center justify-center gap-1">
                                <span>{isReview ? "DOM İLE KAZI" : "KUYRUĞU ERİT"}</span>
                                {bot.pending_links > 0 && (
                                    <span className="ml-1 bg-white/20 text-white font-mono px-1.5 py-0.5 rounded-full text-[8px] border border-white/20 shadow-sm animate-pulse group-hover:bg-white/30 transition-colors">
                                        {bot.pending_links}
                                    </span>
                                )}
                            </span>
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
