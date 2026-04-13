import React from 'react';
import { Zap, Plug } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BotCardBannersProps } from './types';

export function BotCardBanners({
    bot,
    isSpeedMode,
    speedModeRemaining,
    speedProgress,
    speedMinLeft,
    speedSecLeft,
    apiModeActive,
    stateVisuals,
    countdown
}: BotCardBannersProps) {
    if (isSpeedMode && speedModeRemaining > 0) {
        return (
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
        );
    }

    if (apiModeActive) {
        return (
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
        );
    }

    return (
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
    );
}
