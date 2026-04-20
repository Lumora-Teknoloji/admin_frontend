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
    task_status?: "active" | "stopped" | "scheduled";
    keyword: string;
    mode: "linker" | "worker" | "normal" | "review";
    source_task_id?: number;
    source_bot_name?: string;
    start_time: string;
    end_time: string;
    scrape_interval_hours: number;
    page_limit: number;
    is_active: boolean;
    pending_links: number;
    pages_scraped?: number;
    bot_state?: "scraping" | "waiting_ip" | "blocked" | "cooldown" | "queue_empty" | "critical" | "error_streak" | "context_refresh" | "speed_mode" | "api_mode" | "idle";
    state_message?: string;
    state_countdown?: number;
    state_started_at?: string;
    uptime_seconds?: number;
    session_started_at?: string;
    stats: BotStats;
    last_message?: string;
    last_product_url?: string;
    is_critical?: boolean;
    last_error?: string;
    use_proxy?: boolean;
}

export interface DetailedError {
    id: number;
    task_name: string;
    mode: string;
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

export interface ReportSummaryResponse {
    new_products: number;
    avg_price: number | null;
    avg_rating: number | null;
    unique_brands: number;
    total_favorites: number;
    total_cart: number;
    unique_sellers: number;
    top_brands: { brand: string; count: number }[];
}

export interface SystemHealthResponse {
    status: string;
    pulse?: {
        status: "healthy" | "busy" | "critical" | "error";
        message: string;
    };
    database: {
        connection: string;
        total_products: number;
        total_tasks: number;
        total_logs: number;
    };
    server: {
        cpu: string;
        memory: string;
        disk: string;
        os: string;
        uptime: string;
    };
}

export interface SystemHealth extends SystemHealthResponse { }

export interface LiveProduct {
    id: number;
    name: string;
    brand: string;
    price: string;
    url: string;
    scraped_at: string;
    bot: string;
    platform: string;
    image: string | null;
}

export interface Product {
    id: number;
    product_code: string | null;
    name: string | null;
    brand: string | null;
    seller: string | null;
    url: string | null;
    image_url: string | null;
    category_tag: string | null;
    category: string | null;
    attributes: Record<string, any> | null;
    review_summary: string | null;
    sizes: string[] | null;
    last_price: number | null;
    last_discount_rate: number | null;
    avg_sales_velocity: number | null;
    first_seen_at: string | null;
    last_scraped_at: string | null;
    favorite_count: number | null;
    cart_count: number | null;
    view_count: number | null;
    avg_rating: number | null;
    rating_count: number | null;
    qa_count: number | null;
    original_price: number | null;
    discounted_price: number | null;
    page_number: number | null;
    search_rank: number | null;
    absolute_rank: number | null;
    search_term: string | null;
    bot_mode: string | null;
    task_name: string | null;
    scrape_mode: string | null;
}

export interface ProductListResponse {
    items: Product[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export interface ProductCollection {
    id: number;
    name: string;
    color: string;
    icon: string;
    product_count: number;
}

export interface ProductReaction {
    product_id: number;
    reaction: "like" | "dislike";
}

