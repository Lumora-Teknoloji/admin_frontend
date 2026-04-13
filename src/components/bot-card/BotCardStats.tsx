import React, { useMemo } from 'react';
import { Link as LinkIcon, FileText, AlertTriangle, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BotCardStatsProps } from './types';

export function BotCardStats({
    bot,
    isReview,
    isLinker,
    isSpeedMode,
    modeTheme,
    handleNavigateToLogs
}: BotCardStatsProps) {
    const statsData = useMemo(() => [
        { label: isReview ? "KAZILAN YORUM" : isLinker ? "TOPLANAN LİNK" : "KAZILAN ÜRÜN", value: bot.stats.scraped, color: "text-white", Icon: LinkIcon, hoverColor: "group-hover:text-blue-400" },
        { label: isReview ? "İŞLENEN ÜRÜN" : "SAYFA", value: isReview ? `${bot.pages_scraped || 0}/${bot.page_limit || 50}` : `${bot.pages_scraped || 0}/${bot.page_limit || 0}`, color: "text-purple-400", Icon: FileText, hoverColor: "group-hover:text-purple-300" },
        { label: "HATALAR", value: bot.stats.errors, color: "text-red-500", Icon: AlertTriangle, action: handleNavigateToLogs, hoverBorder: "hover:border-red-500/50" },
        { label: isReview ? "BOŞ ÜRÜN" : isLinker ? "BEKLEYENLER" : "KUYRUK", value: isReview ? Math.max(0, (bot.pages_scraped || 0) - bot.stats.scraped) : bot.pending_links, color: "text-amber-500", Icon: Layers, hoverColor: "group-hover:text-amber-400" }
    ], [bot.stats.scraped, bot.stats.errors, bot.pending_links, bot.pages_scraped, bot.page_limit, handleNavigateToLogs, isLinker, isReview]);

    return (
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

                    <stat.Icon className="absolute right-1 bottom-1 h-8 w-8 text-white/[0.02] group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500 pointer-events-none" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none transition-opacity" />
                </div>
            ))}
        </div>
    );
}
