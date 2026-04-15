import React from 'react';
import { Settings, Clock, Globe, Edit2, Save, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusIcon } from './BotStateVisuals';
import { BotCardHeaderProps } from './types';

export function BotCardHeader({
    bot,
    statusInfo,
    modeTheme,
    stateVisuals,
    isRunning,
    isSpeedMode,
    apiModeActive,
    proxyModeActive,
    liveUptime,
    uptimeText,
    isEditing,
    isProcessing,
    setIsEditing,
    handleSave,
    handleCancel,
    handleDelete,
    onStop
}: BotCardHeaderProps) {
    return (
        <div className="relative mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        {/* Bot Avatar/Head */}
                        <div className={cn(
                            "relative h-12 w-12 rounded-lg flex items-center justify-center overflow-hidden border transition-all duration-500 ring-offset-1 ring-offset-transparent",
                            isSpeedMode
                                ? 'border-fuchsia-500/40 ring-2 ring-fuchsia-500/60 shadow-[0_0_15px_rgba(217,70,239,0.3)]'
                                : cn('border-white/10 bg-black/40', isRunning ? cn('ring-2', modeTheme.avatarRing) : cn('ring-1', modeTheme.avatarRingIdle))
                        )}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                            <div className="relative z-10 w-full h-full flex items-center justify-center">
                                <img
                                    src={`/assets/${modeTheme.avatarImg}`}
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
                                <StatusIcon type={statusInfo.iconType as any} />
                                <span>{statusInfo.label}</span>
                            </div>

                            {/* Error message */}
                            <span className={cn(
                                "text-[9px] text-gray-500 truncate max-w-[120px] bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10 transition-all duration-300",
                                bot.is_critical && bot.last_error ? "opacity-100" : "opacity-0 w-0 p-0 border-0 overflow-hidden"
                            )}>
                                {bot.last_error || ""}
                            </span>

                            {/* Mini indicators */}
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
                                    <span>{bot.stats.processed || 0} IP</span>
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

                {/* Top Actions */}
                <div className="flex items-center gap-1">
                    {/* Cancel Schedule Button */}
                    <button
                        onClick={async (e) => {
                            e.stopPropagation();
                            try { await onStop(bot.id); } catch (err) { console.error(err); }
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

                    {/* Edit/Save Toggle */}
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
    );
}
