"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Bot, BotSettingsUpdate, botApi } from "@/services/botApi";

// Component imports
import { getModeTheme, getStatusInfo, getStateVisuals } from "./bot-card/BotStateVisuals";
import { BotCardHeader } from "./bot-card/BotCardHeader";
import { BotCardConfiguration } from "./bot-card/BotCardConfiguration";
import { BotCardStats } from "./bot-card/BotCardStats";
import { BotCardBanners } from "./bot-card/BotCardBanners";
import { BotCardTerminal } from "./bot-card/BotCardTerminal";
import { BotCardActions } from "./bot-card/BotCardActions";

interface BotCardProps {
    bot: Bot;
    onStart: (id: number) => Promise<void>;
    onWorkerStart: (id: number) => Promise<void>;
    onStop: (id: number) => Promise<void>;
    onUpdate: (id: number, settings: BotSettingsUpdate) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onSpeedMode?: (id: number) => Promise<void>;
}

export function BotCard({ bot, onStart, onWorkerStart, onStop, onUpdate, onDelete, onSpeedMode }: BotCardProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const showError = (msg: string, err: any) => {
        console.error(msg, err);
        const errMessage = err?.message || err?.detail || (typeof err === "string" ? err : "Bilinmeyen hata");
        setActionError(`⚠️ ${msg}: ${errMessage}`);
        setTimeout(() => setActionError(null), 5000);
    };

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

    // Uptime timer
    const [liveUptime, setLiveUptime] = useState(bot.uptime_seconds || 0);
    useEffect(() => {
        setLiveUptime(bot.uptime_seconds || 0);
    }, [bot.uptime_seconds]);
    useEffect(() => {
        if (!isRunning) return;
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
    const [messageHistory, setMessageHistory] = useState<{ message: string; url: string; time: string }[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bot.last_message) {
            const currentUrl = bot.last_product_url || (bot.keyword ? `https://www.trendyol.com/sr?q=${encodeURIComponent(bot.keyword)}` : "");
            setMessageHistory(prev => {
                const lastEntry = prev[prev.length - 1];
                if (!lastEntry || lastEntry.message !== bot.last_message || lastEntry.url !== currentUrl) {
                    const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    const newHistory = [...prev, { message: bot.last_message || "Bot hazır.", url: currentUrl, time }];
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
            showError("Ayar kaydetme başarısız", error);
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
            showError("Durum değiştirilemedi", error);
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
            showError("Worker başlatılamadı", error);
            setIsProcessing(false);
            setPendingStatus(null);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`DİKKAT: "${bot.name}" isimli botu silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve botun topladığı/bekleyen tüm veriler kaybolabilir.`)) {
            return;
        }
        setIsProcessing(true);
        try {
            await onDelete(bot.id);
        } catch (error) {
            showError("Bot silinemedi", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSpeedMode = async () => {
        setIsProcessing(true);
        try {
            await botApi.activateSpeedMode(bot.id, 30);
        } catch (error) {
            showError("Hız modu aktifleştirilemedi", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const isSpeedMode = bot.bot_state === 'speed_mode';
    const speedModeRemaining = isSpeedMode ? countdown * 1000 : 0;
    const speedMinLeft = Math.floor(speedModeRemaining / 60000);
    const speedSecLeft = Math.floor((speedModeRemaining % 60000) / 1000);
    const speedProgress = isSpeedMode ? (countdown / (30 * 60)) * 100 : 0;

    // API Mode
    const [apiModeActive, setApiModeActive] = useState(false);
    useEffect(() => {
        if (bot.bot_state === 'api_mode' && !apiModeActive) {
            setApiModeActive(true);
        }
    }, [bot.bot_state]);

    const handleApiMode = async () => {
        setIsProcessing(true);
        try {
            await botApi.toggleApiMode(bot.id);
            setApiModeActive(!apiModeActive);
        } catch (error) {
            showError("API modu aktif edilemedi", error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Proxy Mode
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
            showError("Proxy modu aktif edilemedi", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const buttonText = useMemo(() => {
        if (isProcessing) {
            if (pendingStatus === 'stopped') return "DURDURULUYOR...";
            if (pendingStatus === 'worker_running') return "BAŞLATILIYOR...";
            return "İŞLENİYOR...";
        }
        if (bot.status === "running") return bot.mode === "linker" ? "DURDUR" : "DURDUR";
        if (bot.status === "worker_running") return `DURDUR (KALAN: ${bot.pending_links})`;
        return bot.mode === "linker" ? "LİNK TOPLA" : bot.mode === "review" ? "API İLE TOPLA" : "BAŞLAT";
    }, [isProcessing, pendingStatus, bot.status, bot.pending_links, bot.mode]);

    const showPauseIcon = !isProcessing && isRunning;
    const isLinker = bot.mode === "linker";
    const isReview = bot.mode === "review";

    return (
        <div className="group relative">
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
                {isSpeedMode && (
                    <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                )}
                {apiModeActive && !isSpeedMode && (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />
                )}

                <div className={cn(
                    "absolute top-0 inset-x-0 pointer-events-none bg-gradient-to-r transition-all duration-500",
                    isSpeedMode
                        ? 'h-[3px] from-fuchsia-500/80 via-fuchsia-400 to-fuchsia-500/80 opacity-100'
                        : cn('h-[2px]', stateVisuals ? stateVisuals.topLine + ' opacity-100' : (isRunning ? modeTheme.topLine + ' opacity-80' : modeTheme.topLineIdle + ' opacity-40'))
                )} />

                <BotCardHeader
                    bot={bot}
                    statusInfo={statusInfo}
                    modeTheme={modeTheme}
                    stateVisuals={stateVisuals}
                    isRunning={isRunning}
                    isSpeedMode={isSpeedMode}
                    apiModeActive={apiModeActive}
                    proxyModeActive={proxyModeActive}
                    liveUptime={liveUptime}
                    uptimeText={uptimeText}
                    isEditing={isEditing}
                    isProcessing={isProcessing}
                    setIsEditing={setIsEditing}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                    handleDelete={handleDelete}
                    onStop={onStop}
                />

                <BotCardConfiguration
                    bot={bot}
                    isReview={isReview}
                    isWorker={isWorker}
                    isEditing={isEditing}
                    keyword={keyword}
                    setKeyword={setKeyword}
                    startTime={startTime}
                    setStartTime={setStartTime}
                    endTime={endTime}
                    setEndTime={setEndTime}
                    pageLimit={pageLimit}
                    setPageLimit={setPageLimit}
                    setIsEditing={setIsEditing}
                    proxyModeActive={proxyModeActive}
                    handleProxyMode={handleProxyMode}
                />

                <BotCardStats
                    bot={bot}
                    isReview={isReview}
                    isLinker={isLinker}
                    isSpeedMode={isSpeedMode}
                    modeTheme={modeTheme}
                    handleNavigateToLogs={handleNavigateToLogs}
                />

                <BotCardBanners
                    bot={bot}
                    isSpeedMode={isSpeedMode}
                    speedModeRemaining={speedModeRemaining}
                    speedProgress={speedProgress}
                    speedMinLeft={speedMinLeft}
                    speedSecLeft={speedSecLeft}
                    apiModeActive={apiModeActive}
                    stateVisuals={stateVisuals}
                    countdown={countdown}
                />

                {actionError && (
                    <div className="mb-3 rounded-lg border border-red-500/40 bg-gradient-to-r from-red-500/15 to-red-500/5 p-2.5 flex items-center gap-2.5 animate-in slide-in-from-top-1 fade-in duration-300">
                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)] flex-shrink-0" />
                        <span className="text-[10px] font-medium text-red-300 line-clamp-2 leading-relaxed">{actionError}</span>
                    </div>
                )}

                <BotCardTerminal
                    bot={bot}
                    isSpeedMode={isSpeedMode}
                    stateVisuals={stateVisuals}
                    modeTheme={modeTheme}
                    messageHistory={messageHistory}
                    scrollRef={scrollRef}
                />

                <BotCardActions
                    bot={bot}
                    isRunning={isRunning}
                    isProcessing={isProcessing}
                    isWorker={isWorker}
                    isLinker={isLinker}
                    isReview={isReview}
                    isSpeedMode={isSpeedMode}
                    speedModeRemaining={speedModeRemaining}
                    speedMinLeft={speedMinLeft}
                    speedSecLeft={speedSecLeft}
                    apiModeActive={apiModeActive}
                    buttonText={buttonText}
                    showPauseIcon={showPauseIcon}
                    setIsEditing={setIsEditing}
                    handleSpeedMode={handleSpeedMode}
                    handleApiMode={handleApiMode}
                    handleToggleStatus={handleToggleStatus}
                    handleWorkerStart={handleWorkerStart}
                />
            </div>
        </div>
    );
}
