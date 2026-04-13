import { request } from "@/lib/api";

// ─── Eski Agent modeli (heartbeat tabanlı) ────────────────────────────────────
export interface Agent {
    id: number;
    name: string;
    os: string;
    status: "online" | "offline" | "scraping" | "completed" | "error" | "idle" | "standby" | "syncing" | "linking" | "extracting" | "cancelling";
    current_task: string | null;
    stats: {
        products?: number;
        metrics?: number;
        errors?: number;
        uptime_start?: string;
        db_size_mb?: number;
        pages_scraped?: number;
        products_found?: number;
    };
    last_heartbeat: string | null;
    registered_at: string | null;
    schedule_config?: {
        enabled: boolean;
        time: string;
        keyword: string;
        mode: string;
    };
}

export interface CommandResponse {
    command_id: number;
    status: string;
    agent: string;
}

export interface LogEntry {
    id: number;
    level: string;
    logger: string;
    message: string;
    timestamp: string;
}

// ─── Yeni Redis Bot modeli ────────────────────────────────────────────────────
export interface RedisQueueStats {
    pending: number;
    processing: number;
    retry: number;
    results_buffer: number;
    scraped_total: number;
    throughput_estimate: { desc: string };
}

export interface RedisBotInfo {
    status: "active" | "waiting" | "error" | "stopped";
    last_seen: string;       // unix timestamp string
    last_seen_ago: number;   // seconds
    scraped: string;
    rate_per_min: string;
}

export type RedisBotsMap = Record<string, RedisBotInfo>;

// ─── Agent API ────────────────────────────────────────────────────────────────
export const agentApi = {
    list: () => request<Agent[]>("/agents/list"),

    sendCommand: (agentId: number, command: string, params: Record<string, any> = {}) =>
        request<CommandResponse>(`/agents/${agentId}/command`, {
            method: "POST",
            body: JSON.stringify({ command, params }),
        }),

    scrape: (agentId: number, keyword: string, mode: string = "linker", pageLimit: number = 1) =>
        request<CommandResponse>(`/agents/${agentId}/command`, {
            method: "POST",
            body: JSON.stringify({
                command: "scrape",
                params: { keyword, mode, page_limit: pageLimit },
            }),
        }),

    stop: (agentId: number) =>
        request<CommandResponse>(`/agents/${agentId}/command`, {
            method: "POST",
            body: JSON.stringify({ command: "stop", params: {} }),
        }),

    sync: (agentId: number) =>
        request<CommandResponse>(`/agents/${agentId}/command`, {
            method: "POST",
            body: JSON.stringify({ command: "sync", params: {} }),
        }),

    shutdown: (agentId: number) =>
        request<CommandResponse>(`/agents/${agentId}/command`, {
            method: "POST",
            body: JSON.stringify({ command: "shutdown", params: {} }),
        }),

    deleteAgent: (agentId: number) =>
        request<{ status: string; agent: string }>(`/agents/${agentId}`, {
            method: "DELETE",
        }),

    getLogs: (agentId: number, limit: number = 30) =>
        request<LogEntry[]>(`/agents/${agentId}/logs?limit=${limit}`),

    rename: (agentId: number, newName: string) =>
        request<{ status: string; agent_id: number; display_name: string }>(`/agents/${agentId}/name`, {
            method: "PATCH",
            body: JSON.stringify({ name: newName }),
        }),

    updateSchedule: (agentId: number, config: { enabled: boolean; time: string; keyword: string; mode: string }) =>
        request<{ status: string; agent_id: number; schedule_config: any }>(`/agents/${agentId}/schedule`, {
            method: "PATCH",
            body: JSON.stringify(config),
        }),
};

// ─── Redis Queue API (yeni stateless bot mimarisi) ────────────────────────────
const AGENT_SECRET = process.env.NEXT_PUBLIC_AGENT_SECRET ?? "";

export const redisApi = {
    getStats: () =>
        request<RedisQueueStats>("/redis/queue/stats", {
            headers: { "X-Agent-Secret": AGENT_SECRET },
        }),

    getBots: () =>
        request<RedisBotsMap>("/redis/bots", {
            headers: { "X-Agent-Secret": AGENT_SECRET },
        }),

    recover: () =>
        request<{ recovered: number }>("/redis/queue/recover", {
            method: "POST",
            headers: { "X-Agent-Secret": AGENT_SECRET },
        }),

    flushRetry: () =>
        request<{ moved: number }>("/redis/queue/flush_retry", {
            method: "POST",
            headers: { "X-Agent-Secret": AGENT_SECRET },
        }),
};
