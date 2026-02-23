// Use environment variables for configuration
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/bot-admin';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || BASE_PATH;
const API_URL = `${API_BASE}/api`;

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isFormData = options.body instanceof FormData;

    const headers: Record<string, string> = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers as Record<string, string> || {}),
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: 'include', // Important for HttpOnly cookies
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        const errorMessage = error.detail || error.error || 'İşlem başarısız';
        throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    }

    if (res.status === 204) return {} as T;
    return res.json();
}

export const authApi = {
    login: (username: string, password: string) =>
        request<any>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        }),

    register: (data: { username: string, email: string, password: string, full_name?: string }) =>
        request<any>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    logout: () =>
        request<any>('/auth/logout', {
            method: 'POST',
        }),

    me: () =>
        request<any>('/users/me'),
};
