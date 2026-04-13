import React from "react";
import { AlertTriangle, Activity, Pause, X, Wifi, Shield, Clock, Zap, Plug, Inbox } from "lucide-react";
import { Bot } from "@/services/botApi";

export const MODE_THEMES: Record<string, any> = {
    worker: {
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
    },
    linker: {
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
    },
    review: {
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
    },
    normal: {
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
    }
};

export const STATE_VISUALS: Record<string, any> = {
    waiting_ip: {
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
    },
    blocked: {
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
    },
    cooldown: {
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
    },
    context_refresh: {
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
    },
    speed_mode: {
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
    },
    api_mode: {
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
    },
    queue_empty: {
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
    },
    critical: {
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
    },
    error_streak: {
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
    }
};

export const STATUS_INFO: Record<string, any> = {
    critical: {
        color: 'red',
        badgeClass: "bg-red-500/10 text-red-500 border-red-500/20 ring-red-500/20",
        glowColor: 'rgba(239, 68, 68, 0.4)',
        label: "KRİTİK HATA",
        iconType: 'alert' as const,
        viaColor: 'via-red-500'
    },
    running: {
        color: 'emerald',
        badgeClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 ring-emerald-500/20 animate-pulse-subtle",
        glowColor: 'rgba(16, 185, 129, 0.4)',
        label: "SİSTEM AKTİF",
        iconType: 'pulse' as const,
        viaColor: 'via-emerald-500'
    },
    worker_running: {
        color: 'amber',
        badgeClass: "bg-amber-500/10 text-amber-500 border-amber-500/20 ring-amber-500/20 animate-pulse-subtle",
        glowColor: 'rgba(245, 158, 11, 0.4)',
        label: "İŞLENİYOR",
        iconType: 'activity' as const,
        viaColor: 'via-amber-500'
    },
    idle: {
        color: 'indigo',
        badgeClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 ring-indigo-500/20",
        glowColor: 'rgba(99, 102, 241, 0.4)',
        label: "BEKLENİYOR",
        iconType: 'pause' as const,
        viaColor: 'via-indigo-500'
    },
    error: {
        color: 'red',
        badgeClass: "bg-red-500/10 text-red-500 border-red-500/20 ring-red-500/20",
        glowColor: 'rgba(239, 68, 68, 0.4)',
        label: "HATA OLUŞTU",
        iconType: 'alert' as const,
        viaColor: 'via-red-500'
    },
    offline: {
        color: 'slate',
        badgeClass: "bg-gray-500/10 text-gray-500 border-gray-500/20 ring-gray-500/20",
        glowColor: 'rgba(148, 163, 184, 0.2)',
        label: "PASİF / OFFLINE",
        iconType: 'x' as const,
        viaColor: 'via-slate-500'
    }
};

// Mode-specific visual theme
export function getModeTheme(mode: string) {
    return MODE_THEMES[mode] || MODE_THEMES['normal'];
}

// Bot state visual configuration
export function getStateVisuals(botState?: string) {
    if (!botState) return null;
    return STATE_VISUALS[botState] || null;
}

// Helper: Compute status info deterministically
export function getStatusInfo(bot: Bot) {
    if (bot.is_critical) {
        return STATUS_INFO['critical'];
    }
    return STATUS_INFO[bot.status] || STATUS_INFO['offline'];
}

// Stable status icon component
export function StatusIcon({ type }: { type: 'alert' | 'pulse' | 'activity' | 'pause' | 'x' }) {
    switch (type) {
        case 'alert': return <AlertTriangle className="h-2.5 w-2.5" />;
        case 'pulse': return <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block flex-shrink-0" />;
        case 'activity': return <Activity className="h-2.5 w-2.5" />;
        case 'pause': return <Pause className="h-2.5 w-2.5" />;
        case 'x': return <X className="h-2.5 w-2.5" />;
    }
}
