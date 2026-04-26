import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';

export async function GET() {
    let agentSecret = process.env.AGENT_SECRET || process.env.NEXT_PUBLIC_AGENT_SECRET || "Tanımlanmamış";
    let backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    let apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || `${backendUrl}/api`;

    try {
        // Next.js dev server'ı veya build edilmiş hali olsa bile 
        // diske yazılan güncel .env.local dosyasından okumak için:
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');

            const secretMatch = content.match(/NEXT_PUBLIC_AGENT_SECRET\s*=\s*(.*)/);
            if (secretMatch && secretMatch[1]) agentSecret = secretMatch[1].trim();

            const apiMatch = content.match(/NEXT_PUBLIC_API_URL\s*=\s*(.*)/);
            if (apiMatch && apiMatch[1]) {
                apiUrl = apiMatch[1].trim();
            } else {
                const backendMatch = content.match(/NEXT_PUBLIC_BACKEND_URL\s*=\s*(.*)/);
                if (backendMatch && backendMatch[1]) {
                    let base = backendMatch[1].trim();
                    apiUrl = base.endsWith('/api') ? base : `${base}/api`;
                }
            }
        }
    } catch (e) {
        console.error("Config fetch error:", e);
    }

    return NextResponse.json({ agentSecret, apiUrl });
}
