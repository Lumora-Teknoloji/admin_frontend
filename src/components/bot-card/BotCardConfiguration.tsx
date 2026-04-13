import React from 'react';
import { Edit2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BotCardConfigProps } from './types';

export function BotCardConfiguration({
    bot,
    isReview,
    isWorker,
    isEditing,
    keyword,
    setKeyword,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    pageLimit,
    setPageLimit,
    setIsEditing,
    proxyModeActive,
    handleProxyMode,
}: BotCardConfigProps) {
    return (
        <>
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

                {!isWorker && !isReview && (
                    <>
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest px-1">Başlangıç - Bitiş</label>
                            <div className="flex items-center gap-2">
                                <div className={cn("flex items-center gap-2 w-full", !isEditing && "hidden")}>
                                    <input type="time" value={startTime || ''} onChange={(e) => setStartTime(e.target.value)} className="bg-[#0d0f14] border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white w-full text-center focus:outline-none focus:border-green-500" />
                                    <span className="text-gray-600">-</span>
                                    <input type="time" value={endTime || ''} onChange={(e) => setEndTime(e.target.value)} className="bg-[#0d0f14] border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white w-full text-center focus:outline-none focus:border-green-500" />
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
        </>
    );
}
