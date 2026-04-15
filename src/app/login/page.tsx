"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, User, ShieldCheck, ArrowRight } from "lucide-react";
import { authApi } from "@/lib/api";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await authApi.login(username, password);
            router.refresh();
            router.replace('/admin');
        } catch (err: any) {
            setError(err.message || "Giriş yapılamadı. Bilgilerinizi kontrol edin.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0c0f] flex items-center justify-center p-4 relative overflow-hidden text-gray-300">
            {/* Background Decor */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse-slow transition-opacity duration-1000"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full animate-pulse transition-opacity duration-1000"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10">
                    <div className="mb-6 relative h-28 w-28 rounded-full overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.3)] border-[4px] border-black/90 ring-1 ring-emerald-500/30 flex items-center justify-center bg-[#0b0c0f]">
                        <Image
                            src="/lumora_orb.png"
                            alt="Lumora Logo"
                            width={120}
                            height={120}
                            className="relative z-10 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-pulse-slow mix-blend-screen object-cover scale-110"
                        />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-[0.2em] animate-fade-in">LUMORA</h1>
                    <p className="text-xs text-green-500 font-bold tracking-[0.4em] uppercase mt-2 opacity-80">Admin Dashboard</p>
                </div>

                {/* Auth Card */}
                <div className="bg-[#13151a]/60 backdrop-blur-3xl border border-gray-800/50 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative animate-scale-in">
                    <div className="absolute -top-4 -left-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl backdrop-blur-md shadow-xl">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6">
                        <div className="mb-2">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Erişim Paneli</h2>
                            <p className="text-sm text-gray-400 mt-1">Yönetici bilgilerinizi kullanarak oturum açın.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Kullanıcı Adı</label>
                            <div className="relative flex items-center group">
                                <div className="absolute left-4 w-5 h-5 flex items-center justify-center text-gray-500 transition-colors group-focus-within:text-emerald-500">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[#0b0c0f]/80 border border-gray-800/50 focus:border-emerald-500/40 rounded-2xl py-4.5 pl-12 pr-4 outline-none transition-all placeholder:text-gray-700 text-white shadow-inner"
                                    placeholder="Kullanıcı adınız"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Şifre</label>
                            <div className="relative flex items-center group">
                                <div className="absolute left-4 w-5 h-5 flex items-center justify-center text-gray-500 transition-colors group-focus-within:text-emerald-500">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0b0c0f]/80 border border-gray-800/50 focus:border-emerald-500/40 rounded-2xl py-4.5 pl-12 pr-4 outline-none transition-all placeholder:text-gray-700 text-white shadow-inner"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-4 px-5 rounded-2xl flex items-center gap-3 animate-shake shadow-lg">
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse flex-shrink-0"></div>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 hover:from-emerald-400 hover:via-emerald-500 hover:to-teal-600 text-white font-black py-5 rounded-2xl shadow-[0_15px_30px_rgba(16,185,129,0.25)] transition-all flex items-center justify-center gap-3 active:scale-[0.97] disabled:opacity-50 mt-4 group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="relative z-10 flex items-center gap-3">
                                {isLoading ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        SİSTEMİ BAŞLAT
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>
                </div>

                <div className="flex flex-col items-center mt-12 space-y-4">
                    <div className="h-px w-12 bg-gray-800"></div>
                    <p className="text-[10px] text-gray-700 uppercase tracking-[0.5em] font-bold text-center leading-relaxed">
                        &copy; 2026 LUMORA ANALYSIS ENGINE <br />
                        <span className="text-gray-800/40">SECURE MODULE v1.2</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
