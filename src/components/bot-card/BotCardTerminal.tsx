import React from 'react';
import { cn } from '@/lib/utils';
import { BotCardTerminalProps } from './types';

export function BotCardTerminal({
    bot,
    isSpeedMode,
    stateVisuals,
    modeTheme,
    messageHistory,
    scrollRef
}: BotCardTerminalProps) {
    return (
        <div className={cn(
            "bg-[#0a0b10] rounded-xl border border-white/5 p-3 mb-5 relative overflow-hidden h-32 flex flex-col shadow-inner border-l-2 transition-all duration-500",
            isSpeedMode ? 'border-l-fuchsia-500/50 border-fuchsia-500/20' :
                stateVisuals ? stateVisuals.bannerBorder :
                    bot.is_critical ? "border-l-red-500/50 border-red-500/20" : modeTheme.terminalBorder
        )}>
            <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-[#0a0b10] to-transparent z-10 pointer-events-none" />

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
                                <span className="text-gray-500 mr-2">{entry.time}</span>
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
    );
}
