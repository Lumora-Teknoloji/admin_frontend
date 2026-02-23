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

export function StatsCard({ title, value, subValue, subLabel, status = "neutral", borderColor = "border-gray-800" }: StatsCardProps) {
    return (
        <div
            key={`container-${value}`}
            className={cn(
                "rounded-md border border-gray-800 bg-gray-900/50 p-6 shadow-sm transition-all hover:bg-gray-800 animate-glow-hit", // Standard colors + animation
                borderColor
            )}>
            <div className="flex flex-col items-center justify-center space-y-3 text-center">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{title}</h3>
                <div
                    key={`value-${value}`}
                    className="text-4xl font-extrabold text-white tracking-tight animate-value-pop"
                >
                    {value}
                </div>

                {(subValue || subLabel) && (
                    <div className={cn(
                        "flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide",
                        // Specific pill colors based on screenshot
                        status === "success" && "bg-[#2d3a32] text-[#4ade80]",
                        status === "warning" && "bg-[#3a3528] text-[#facc15]",
                        status === "danger" && "bg-[#3a2828] text-[#f87171]",
                        status === "neutral" && "bg-[#2d3035] text-gray-400"
                    )}>
                        {status === "success" && "↑"}
                        {status === "danger" && "↓"}
                        {subValue && <span className="font-extrabold">{subValue}</span>}
                        <span className="opacity-100">{subLabel}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
