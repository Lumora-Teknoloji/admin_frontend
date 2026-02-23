// Types
export interface BotStats {
    scraped: number;
    validated: number;
    errors: number;
    processed: number;
}

export interface Bot {
    id: number;
    name: string;
    platform: string;
    status: "running" | "stopped" | "error" | "idle" | "worker_running";
    keyword: string;
    start_time: string;
    end_time: string;
    page_limit: number;
    is_active: boolean;
    pending_links: number;
    stats: BotStats;
    last_message?: string;
    last_product_url?: string;
    is_critical?: boolean;
    last_error?: string;
}

export interface DetailedError {
    id: number;
    task_name: string;
    error: string;
    screenshot: string | null;
    date: string;
}

export interface LogsResponse {
    logs: string[];
    detailed_errors: DetailedError[];
}

export interface BotSettingsUpdate {
    keyword?: string;
    start_time?: string;
    end_time?: string;
    page_limit?: number;
    is_active?: boolean;
}

// API Functions
// API Functions
import { request } from "@/lib/api";

export const botApi = {
    // Get all bots status
    getAllBots: () => request<Bot[]>("/scraper/bots/status"),

    // Start a bot
    startBot: (id: number) => request<{ success: boolean; message: string }>(`/scraper/bots/${id}/start`, { method: "POST" }),

    // Stop a bot
    stopBot: (id: number) => request<{ success: boolean; message: string }>(`/scraper/bots/${id}/stop`, { method: "POST" }),

    // Update bot settings
    updateSettings: (id: number, settings: BotSettingsUpdate) =>
        request<{ success: boolean }>(`/scraper/bots/${id}/settings`, {
            method: "PATCH",
            body: JSON.stringify(settings),
        }),

    // Get system logs
    getLogs: (limit: number = 100) => request<LogsResponse>(`/scraper/logs?limit=${limit}`),

    // Get general system status
    getSystemStatus: () =>
        request<{ total_products: number; total_scraped: number; daily_scraped: number; active_bots: number; system_health: number; pending_links: number; last_scrape_date: string | null }>("/scraper/status")
            .catch(() => ({ total_products: 0, total_scraped: 0, daily_scraped: 0, active_bots: 0, system_health: 0, pending_links: 0, last_scrape_date: null })),

    // Create a new bot task
    createBot: (data: any) =>
        request<any>("/scraper/tasks", {
            method: "POST",
            body: JSON.stringify(data),
        }).then(result => ({ ...result, success: !!result.id })),

    // Delete a bot
    deleteBot: (id: number) =>
        request<{ success: boolean; message: string; detail?: string }>(`/scraper/bots/${id}`, { method: "DELETE" })
            .then(result => ({ success: true, message: "Bot silindi" })) // Request helper throws on error, so success is implicit here or caught by caller
            .catch(err => ({ success: false, message: err.message })),

    // Start bot in worker mode
    startWorker: (botId: number) => request<any>(`/scraper/bots/${botId}/worker`, { method: "POST" }),

    // Get live products feed
    getLiveProducts: (limit: number = 50) => request<any[]>(`/scraper/live-products?limit=${limit}`).catch(() => []),

    // Delete single log
    deleteLog: (id: number) => request<{ success: boolean }>(`/scraper/logs/${id}`, { method: "DELETE" }),

    // Clear all error logs
    clearErrorLogs: () => request<{ success: boolean }>("/scraper/logs/errors", { method: "DELETE" }),

    // Get deep system health metrics
    getSystemHealth: () =>
        request<any>("/scraper/system/health")
            .catch(() => ({ status: "offline", database: { connection: "error" } })),

    // Get backend logs
    getBackendLogs: (limit: number = 100) =>
        request<{ logs: string[] }>(`/scraper/logs/backend?limit=${limit}`)
            .catch(() => ({ logs: ["Backend logları yüklenemedi."] })),
};
