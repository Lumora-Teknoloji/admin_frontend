import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    subLabel?: string;
    icon?: LucideIcon;
    status?: "success" | "warning" | "danger" | "neutral";
    trend?: "up" | "down" | "neutral";
    borderColor?: string; // New prop for custom border color
}

export function StatsCard({ title, value, subValue, subLabel, status = "neutral", borderColor }: StatsCardProps) {
    return (
        <div
            key={`container-${value}`}
            className={cn(
                "rounded-2xl border bg-[#0d0f14] p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden",
                borderColor || "border-white/[0.06]"
            )}>
            {/* Subtle top accent line */}
            <div className={cn(
                "absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-transparent to-transparent opacity-40",
                status === "success" && "via-green-500",
                status === "warning" && "via-amber-500",
                status === "danger" && "via-red-500",
                status === "neutral" && "via-gray-600"
            )} />

            <div className="flex flex-col items-center justify-center space-y-3 text-center">
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">{title}</h3>
                <div
                    key={`value-${value}`}
                    className="text-4xl font-black text-white tracking-tight animate-value-pop"
                >
                    {value}
                </div>

                {(subValue || subLabel) && (
                    <div className={cn(
                        "flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider",
                        status === "success" && "bg-green-500/10 text-green-400 border border-green-500/20",
                        status === "warning" && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                        status === "danger" && "bg-red-500/10 text-red-400 border border-red-500/20",
                        status === "neutral" && "bg-white/5 text-gray-500 border border-white/5"
                    )}>
                        {status === "success" && "↑"}
                        {status === "danger" && "↓"}
                        {subValue && <span className="font-extrabold">{subValue}</span>}
                        <span>{subLabel}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
