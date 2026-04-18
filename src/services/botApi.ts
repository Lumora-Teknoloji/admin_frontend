import { Bot, BotStats, DetailedError, LogsResponse, BotSettingsUpdate, ReportSummaryResponse, SystemHealthResponse } from "@/types";

export * from "@/types";

// API Functions
// API Functions
import { request } from "@/lib/api";

export interface LinkerBot {
    id: number;
    name: string;
    keyword: string;
    queue_count: number;
}

export const botApi = {
    // Get all bots status
    getAllBots: () => request<Bot[]>("/scraper/bots/status"),

    // Get linker bots for worker source selection
    getLinkerBots: () => request<LinkerBot[]>("/scraper/bots/linkers"),

    // Start a bot
    startBot: (id: number) => request<{ success: boolean; message: string }>(`/scraper/bots/${id}/start`, { method: "POST" }),

    // Stop a bot
    stopBot: (id: number) => request<{ success: boolean; message: string }>(`/scraper/bots/${id}/stop`, { method: "POST" }),

    // Schedule a bot
    scheduleBot: (id: number) => request<{ success: boolean; message: string }>(`/scraper/bots/${id}/schedule`, { method: "POST" }),

    // Reset a bot's stats
    resetBot: (id: number) => request<{ success: boolean; message: string }>(`/scraper/bots/${id}/reset`, { method: "POST" }),

    // Update bot settings
    updateSettings: (id: number, settings: BotSettingsUpdate) =>
        request<{ success: boolean }>(`/scraper/bots/${id}/settings`, {
            method: "PATCH",
            body: JSON.stringify(settings),
        }),

    // Get system logs (optionally filtered by bot_id)
    getLogs: (limit: number = 100, botId: number = 0) => request<LogsResponse>(`/scraper/logs?limit=${limit}&bot_id=${botId}`),

    // Get general system status
    getSystemStatus: () =>
        request<{ total_products: number; total_scraped: number; daily_scraped: number; active_bots: number; system_health: number; pending_links: number; last_scrape_date: string | null }>("/scraper/status")
            .catch(() => ({ total_products: 0, total_scraped: 0, daily_scraped: 0, active_bots: 0, system_health: 0, pending_links: 0, last_scrape_date: null })),

    // Create a new bot task
    createBot: (data: unknown) =>
        request<{ id?: number; message?: string; detail?: string; [key: string]: unknown }>("/scraper/tasks", {
            method: "POST",
            body: JSON.stringify(data),
        }).then(result => ({ ...result, success: !!result.id })),

    // Delete a bot
    deleteBot: (id: number) =>
        request<{ success: boolean; message: string; detail?: string }>(`/scraper/bots/${id}`, { method: "DELETE" })
            .then(result => ({ success: true, message: "Bot silindi" })) // Request helper throws on error, so success is implicit here or caught by caller
            .catch(err => ({ success: false, message: err.message })),

    // Start bot in worker mode
    startWorker: (botId: number) => request<{ success: boolean; message?: string }>(`/scraper/bots/${botId}/worker`, { method: "POST" }),

    // Activate speed mode (max 30 minutes)
    activateSpeedMode: (botId: number, minutes: number = 30) =>
        request<{ success: boolean; message: string; expires_in_minutes: number }>(
            `/scraper/bots/${botId}/speed-mode?minutes=${minutes}`, { method: "POST" }
        ),

    // Toggle API mode (on/off)
    toggleApiMode: (botId: number) =>
        request<{ success: boolean; message: string }>(
            `/scraper/bots/${botId}/api-mode`, { method: "POST" }
        ),

    // Toggle Proxy mode (on/off)
    toggleProxyMode: (botId: number) =>
        request<{ success: boolean; message: string }>(
            `/scraper/bots/${botId}/proxy-mode`, { method: "POST" }
        ),

    // Get live products feed
    getLiveProducts: (limit: number = 50) => request<unknown[]>(`/scraper/live-products?limit=${limit}`).catch(() => []),

    // Delete single log
    deleteLog: (id: number) => request<{ success: boolean }>(`/scraper/logs/${id}`, { method: "DELETE" }),

    // Clear all error logs
    clearErrorLogs: () => request<{ success: boolean }>("/scraper/logs/errors", { method: "DELETE" }),

    // Get deep system health metrics
    getSystemHealth: () =>
        request<SystemHealthResponse>("/scraper/system/health")
            .catch(() => ({ status: "offline", database: { connection: "error" } } as unknown as SystemHealthResponse)),

    // Get backend logs
    getBackendLogs: (limit: number = 100) =>
        request<{ logs: string[] }>(`/scraper/logs/backend?limit=${limit}`)
            .catch(() => ({ logs: ["Backend logları yüklenemedi."] })),

    // Get data quality statistics
    getDataQuality: () =>
        request<DataQuality>("/products/quality")
            .catch(() => ({
                total_products: 0, seller_filled: 0, seller_pct: 0,
                attributes_filled: 0, attributes_pct: 0, image_filled: 0, image_pct: 0,
                review_summary_filled: 0, review_summary_pct: 0, sizes_filled: 0, sizes_pct: 0,
                avg_rating_filled: 0, avg_rating_pct: 0, cart_filled: 0, cart_pct: 0,
                favorite_filled: 0, favorite_pct: 0,
            })),

    // Monitor scraper health
    monitorCheck: () =>
        request<{ status: string; minutes_since_last_data: number }>("/scraper/monitor/check")
            .catch(() => ({ status: "offline", minutes_since_last_data: -1 })),

    // Get Report Summary
    getReportSummary: (days: number = 7) => 
        request<ReportSummaryResponse>(`/products/reports/summary?days=${days}`)
};

// Data Quality type
export interface DataQuality {
    total_products: number;
    seller_filled: number;
    seller_pct: number;
    attributes_filled: number;
    attributes_pct: number;
    image_filled: number;
    image_pct: number;
    review_summary_filled: number;
    review_summary_pct: number;
    sizes_filled: number;
    sizes_pct: number;
    avg_rating_filled: number;
    avg_rating_pct: number;
    cart_filled: number;
    cart_pct: number;
    favorite_filled: number;
    favorite_pct: number;
}
