import React from 'react';
import { Settings, Zap, Plug, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BotCardActionsProps } from './types';
import { getModeTheme } from './BotStateVisuals';

export function BotCardActions({
    bot,
    isRunning,
    isProcessing,
    isWorker,
    isLinker,
    isReview,
    isSpeedMode,
    speedModeRemaining,
    speedMinLeft,
    speedSecLeft,
    apiModeActive,
    buttonText,
    showPauseIcon,
    setIsEditing,
    handleSpeedMode,
    handleApiMode,
    handleToggleStatus,
    handleWorkerStart
}: BotCardActionsProps) {
    const modeTheme = getModeTheme(bot.mode);

    return (
        <div className="grid grid-cols-6 gap-1.5">
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
    );
}
