import { Bot } from "@/services/botApi";

export interface BotCardHeaderProps {
    bot: Bot;
    statusInfo: any;
    modeTheme: any;
    stateVisuals: any;
    isRunning: boolean;
    isSpeedMode: boolean;
    apiModeActive: boolean;
    proxyModeActive: boolean;
    liveUptime: number;
    uptimeText: string;
    isEditing: boolean;
    isProcessing: boolean;
    setIsEditing: (editing: boolean) => void;
    handleSave: () => Promise<void>;
    handleCancel: () => void;
    handleDelete: () => Promise<void>;
    onStop: (id: number) => Promise<void>;
}

export interface BotCardConfigProps {
    bot: Bot;
    isReview: boolean;
    isWorker: boolean;
    isEditing: boolean;
    keyword: string;
    setKeyword: (kw: string) => void;
    startTime: string;
    setStartTime: (st: string) => void;
    endTime: string;
    setEndTime: (et: string) => void;
    pageLimit: number;
    setPageLimit: (pl: number) => void;
    setIsEditing: (editing: boolean) => void;
    proxyModeActive: boolean;
    handleProxyMode: () => Promise<void>;
}

export interface BotCardStatsProps {
    bot: Bot;
    isReview: boolean;
    isLinker: boolean;
    isSpeedMode: boolean;
    modeTheme: any;
    handleNavigateToLogs: () => void;
}

export interface BotCardBannersProps {
    bot: Bot;
    isSpeedMode: boolean;
    speedModeRemaining: number;
    speedProgress: number;
    speedMinLeft: number;
    speedSecLeft: number;
    apiModeActive: boolean;
    stateVisuals: any;
    countdown: number;
}

export interface BotCardTerminalProps {
    bot: Bot;
    isSpeedMode: boolean;
    stateVisuals: any;
    modeTheme: any;
    messageHistory: { message: string; url: string; time: string }[];
    scrollRef: React.RefObject<HTMLDivElement | null>;
}

export interface BotCardActionsProps {
    bot: Bot;
    isRunning: boolean;
    isProcessing: boolean;
    isWorker: boolean;
    isLinker: boolean;
    isReview: boolean;
    isSpeedMode: boolean;
    speedModeRemaining: number;
    speedMinLeft: number;
    speedSecLeft: number;
    apiModeActive: boolean;
    buttonText: string;
    showPauseIcon: boolean;
    setIsEditing: (editing: boolean) => void;
    handleSpeedMode: () => Promise<void>;
    handleApiMode: () => Promise<void>;
    handleToggleStatus: () => Promise<void>;
    handleWorkerStart: () => Promise<void>;
}
