"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ScrollText, Settings, LogOut, Disc, Package, Monitor } from "lucide-react"; // Updated icons
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api";

const menuItems = [
    {
        name: "Genel Bakış",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        name: "Ürünler",
        href: "/products",
        icon: Package,
    },
    {
        name: "Sistem Logları",
        href: "/logs",
        icon: ScrollText,
    },
    {
        name: "Agents",
        href: "/agents",
        icon: Monitor,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; full_name?: string } | null>(null);

    useEffect(() => {
        authApi.me().then(data => {
            setUser(data);
        }).catch(() => {
            // Unauthenticated or error
            setUser(null);
        });
    }, []);

    const displayName = user?.full_name || user?.username || "Admin";
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <div className="flex h-screen w-64 flex-col bg-[#0b0c0f] text-gray-300 border-r border-gray-800/50 justify-between">
            <div>
                {/* Logo Section */}
                <div className="flex flex-col items-center justify-center pt-10 pb-8">
                    <div className="mb-4 relative h-24 w-24 rounded-full overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.2)] border-[4px] border-black/80 ring-1 ring-emerald-500/20 flex items-center justify-center group cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                        {/* Green Glow Effect */}
                        <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-full"></div>
                        <Image
                            src="/lumora_orb.png"
                            alt="Lumora Logo"
                            width={110}
                            height={110}
                            className="relative z-10 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)] animate-pulse-slow mix-blend-screen object-cover scale-110"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-widest">LUMORA</h1>
                    <p className="text-[10px] text-green-500/80 tracking-[0.3em] font-bold mt-2 uppercase">Analysis Engine</p>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 px-4 mt-4">
                    <div className="text-[10px] font-bold text-gray-600 mb-4 px-2 tracking-[0.2em] uppercase">Main Navigation</div>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        // Special active style for Bot Control to match screenshot (Red Dot)
                        const isRedActive = item.name === "Bot Kontrol" && isActive;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all",
                                    isActive ? "text-white" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                                )}
                            >
                                <div className={cn(
                                    "mr-3 flex items-center justify-center transition-all",
                                    // Red dot if active, specifically for Bot Control as seen in screenshot
                                    isRedActive ? "text-red-500" : (isActive ? "text-white" : "text-gray-600 group-hover:text-gray-400")
                                )}>
                                    {isActive && <div className={cn("h-2 w-2 rounded-full mr-2", isRedActive ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-gray-400")} />}
                                    <item.icon className="h-5 w-5" />
                                </div>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* User Section (Fixed at bottom) */}
            <div className="p-6">
                <div className="rounded-2xl bg-[#13151a] p-5 mb-4 border border-gray-800/50 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
                    {/* User Avatar */}
                    <div className="h-14 w-14 rounded-full bg-[#4ade80] flex items-center justify-center text-black text-xl font-bold mb-3 shadow-[0_0_15px_rgba(74,222,128,0.4)] relative z-10 group-hover:scale-105 transition-transform">
                        {initial}
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-wide truncate w-full">{displayName}</h3>
                    <p className="text-[10px] text-green-500 font-bold tracking-widest uppercase mb-1">LUMORA ARCHITECT</p>
                </div>

                <button
                    onClick={async () => {
                        try {
                            await authApi.logout();
                            router.refresh();
                            router.replace('/login');
                        } catch (err) {
                            console.error("Logout failed:", err);
                            // Fallback in case of network error
                            router.refresh();
                            router.replace('/login');
                        }
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2a2d35] hover:bg-[#32363f] px-4 py-3 text-xs font-bold text-gray-400 hover:text-white transition-all border-l-4 border-l-[#a16207] shadow-lg"
                >
                    <LogOut className="h-4 w-4 text-[#a16207]" />
                    Güvenli Çıkış
                </button>
            </div>
        </div>
    );
}
