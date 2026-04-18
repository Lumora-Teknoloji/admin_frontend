"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { request } from "@/lib/api";
import { botApi } from "@/services/botApi";
import {
    Search, Package, Star, Heart, ShoppingCart, Eye, Filter,
    ChevronLeft, ChevronRight, ExternalLink, X, TrendingUp, BarChart3,
    Tag, MapPin, Layers, Hash
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Product, ProductListResponse } from "@/types";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [sortBy, setSortBy] = useState("last_scraped_at");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [newProductIds, setNewProductIds] = useState<Set<number>>(new Set());
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [todayOnly, setTodayOnly] = useState(true);
    const [globalTotal, setGlobalTotal] = useState(0);
    const prevIdsRef = useRef<Set<number>>(new Set());
    const isFirstLoad = useRef(true);

    const fetchProducts = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                page_size: "15",
                sort_by: sortBy,
                sort_order: "desc",
            });
            if (search) params.set("search", search);
            if (todayOnly) params.set("today_only", "true");

            const data = await request<ProductListResponse>(`/products?${params}`);

            // Yeni ürün tespiti (ilk yükleme hariç)
            if (!isFirstLoad.current && silent) {
                const incomingIds = new Set(data.items.map(p => p.id));
                const freshIds = new Set<number>();
                incomingIds.forEach(id => {
                    if (!prevIdsRef.current.has(id)) freshIds.add(id);
                });
                if (freshIds.size > 0) {
                    setNewProductIds(freshIds);
                    // 5 saniye sonra glow efektini kaldır
                    setTimeout(() => setNewProductIds(new Set()), 5000);
                }
            }
            isFirstLoad.current = false;
            prevIdsRef.current = new Set(data.items.map(p => p.id));

            setProducts(data.items);
            setTotal(data.total);
            setTotalPages(data.total_pages);
        } catch (err) {
            console.error("Products fetch error:", err);
        } finally {
            if (!silent) setLoading(false);
        }
    }, [page, search, sortBy, todayOnly]);

    const fetchGlobalStatus = useCallback(async () => {
        try {
            const statusData = await request<any>('/scraper/status');
            setGlobalTotal(statusData.total_products);
        } catch (e) {}
    }, []);

    // İlk yükleme
    useEffect(() => {
        fetchProducts();
        fetchGlobalStatus();
    }, [fetchProducts, fetchGlobalStatus]);

    // Auto-refresh: her 10 saniyede bir (sadece ilk sayfa + son güncelleme sıralaması)
    useEffect(() => {
        if (!autoRefresh || page !== 1 || sortBy !== "last_scraped_at") return;
        const interval = setInterval(() => {
            fetchProducts(true);
            fetchGlobalStatus();
        }, 10000);
        return () => clearInterval(interval);
    }, [autoRefresh, page, sortBy, fetchProducts, fetchGlobalStatus]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput);
    };

    const formatNumber = (n: number | null) => {
        if (n === null || n === undefined) return "–";
        if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
        return n.toLocaleString("tr-TR");
    };

    const formatPrice = (n: number | null) => {
        if (!n) return "–";
        return `${n.toFixed(2)} ₺`;
    };

    const timeAgo = (dateStr: string | null) => {
        if (!dateStr) return "–";
        const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
        if (diff < 60) return "Az önce";
        if (diff < 3600) return `${Math.floor(diff / 60)}dk`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}sa`;
        return `${Math.floor(diff / 86400)}g`;
    };

    return (
        <div className="container mx-auto max-w-7xl space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Ürün Veritabanı</h1>
                    <p className="text-gray-400 mt-1">
                        Kazınan tüm ürünleri görüntüleyin, filtreleyin ve analiz edin.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Auto-refresh indicator */}
                    {autoRefresh && page === 1 && sortBy === "last_scraped_at" && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                            </span>
                            <span className="text-[10px] text-green-400 font-medium">Canlı</span>
                        </div>
                    )}
                    <div className="text-right">
                        <div className="text-3xl font-bold text-green-400">{todayOnly ? total.toLocaleString() : (globalTotal || total).toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{todayOnly ? "Bugün Çekilen Ürün" : "Toplam Ürün"}</div>
                        {todayOnly && <div className="text-[10px] text-gray-600 mt-0.5">Genel Toplam: {(globalTotal || total).toLocaleString()}</div>}
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex gap-3">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Ürün adı ile ara..."
                        className="w-full bg-[#13151a] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </form>
                <select
                    className="bg-[#13151a] border border-gray-800 rounded-xl px-4 py-3 text-gray-300 text-sm focus:outline-none focus:border-green-500"
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                >
                    <option value="last_scraped_at">Son Güncelleme</option>
                    <option value="last_price">Fiyat</option>
                    <option value="name">İsim</option>
                    <option value="brand">Marka</option>
                    <option value="avg_sales_velocity">Satış Hızı</option>
                </select>
                <button
                    type="button"
                    onClick={() => { setTodayOnly(!todayOnly); setPage(1); }}
                    className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-colors border",
                        todayOnly 
                            ? "bg-green-500/10 border-green-500/30 text-green-400" 
                            : "bg-[#13151a] border-gray-800 text-gray-400 hover:text-gray-300"
                    )}
                >
                    Sadece Bugün
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-[#13151a] border border-gray-800 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="px-4 py-3 text-left">Ürün</th>
                                    <th className="px-3 py-3 text-right">Fiyat</th>
                                    <th className="px-3 py-3 text-center"><Star className="h-3.5 w-3.5 inline" /></th>
                                    <th className="px-3 py-3 text-center"><Heart className="h-3.5 w-3.5 inline" /></th>
                                    <th className="px-3 py-3 text-center"><ShoppingCart className="h-3.5 w-3.5 inline" /></th>
                                    <th className="px-3 py-3 text-center"><Eye className="h-3.5 w-3.5 inline" /></th>
                                    <th className="px-3 py-3 text-right">Güncelleme</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {products.map((p, index) => {
                                    const isNew = newProductIds.has(p.id);
                                    const mode = p.bot_mode || 'normal';
                                    const botClass = `bot-${mode}`;
                                    const glowClass = `glow-${mode}`;
                                    const badgeColors: Record<string, string> = {
                                        worker: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
                                        linker: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
                                        normal: 'bg-green-500/15 border-green-500/30 text-green-400',
                                    };
                                    const dotColors: Record<string, string> = {
                                        worker: 'bg-blue-400',
                                        linker: 'bg-amber-400',
                                        normal: 'bg-green-400',
                                    };
                                    const modeLabels: Record<string, string> = {
                                        worker: 'W',
                                        linker: 'L',
                                        normal: 'N',
                                    };
                                    return (
                                        <tr
                                            key={p.id}
                                            className={cn(
                                                "hover:bg-white/[0.02] cursor-pointer transition-all duration-500",
                                                isNew && `product-row-new ${botClass} ${glowClass}`
                                            )}
                                            style={isNew ? { animationDelay: `${index * 80}ms` } : undefined}
                                            onClick={() => setSelectedProduct(p)}
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {p.image_url ? (
                                                        <img
                                                            src={p.image_url}
                                                            alt=""
                                                            className="h-10 w-10 rounded-lg object-cover bg-gray-800"
                                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-lg bg-gray-800 flex items-center justify-center">
                                                            <Package className="h-4 w-4 text-gray-600" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="text-white font-medium truncate max-w-[250px]">{p.name || "İsimsiz"}</div>
                                                        <div className="text-xs text-gray-500">{p.brand || "–"} {p.seller ? `· ${p.seller}` : ""}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 text-right">
                                                <span className="text-white font-mono font-medium">{formatPrice(p.last_price)}</span>
                                                {p.last_discount_rate && p.last_discount_rate > 0 && (
                                                    <span className="text-red-400 text-xs ml-1">-{Math.round(p.last_discount_rate)}%</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-3 text-center">
                                                <span className="text-yellow-400 font-medium">{p.avg_rating?.toFixed(1) || "–"}</span>
                                                <span className="text-gray-600 text-xs ml-0.5">({formatNumber(p.rating_count)})</span>
                                            </td>
                                            <td className="px-3 py-3 text-center text-pink-400">{formatNumber(p.favorite_count)}</td>
                                            <td className="px-3 py-3 text-center text-orange-400">{formatNumber(p.cart_count)}</td>
                                            <td className="px-3 py-3 text-center text-blue-400">{formatNumber(p.view_count)}</td>
                                            <td className="px-3 py-3 text-right text-xs">
                                                {isNew ? (
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-bold text-[10px] animate-badge-pop",
                                                        badgeColors[mode]
                                                    )}>
                                                        <span className="relative flex h-1.5 w-1.5">
                                                            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", dotColors[mode])} />
                                                            <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", dotColors[mode])} />
                                                        </span>
                                                        {modeLabels[mode]} · YENİ
                                                    </span>
                                                ) : (
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="text-gray-500">{timeAgo(p.last_scraped_at)}</span>
                                                        {p.scrape_mode && (
                                                            <span className={cn(
                                                                "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border",
                                                                p.scrape_mode === 'api' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                                    : p.scrape_mode === 'speed' ? 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400'
                                                                        : 'bg-gray-500/10 border-gray-500/30 text-gray-400'
                                                            )}>
                                                                {p.scrape_mode === 'api' ? '🔌 API' : p.scrape_mode === 'speed' ? '⚡ HIZ' : '🐢 DOM'}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
                        <span className="text-xs text-gray-500">{total} üründen {(page - 1) * 15 + 1}-{Math.min(page * 15, total)} gösteriliyor</span>
                        <div className="flex gap-1">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                                className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 text-gray-400 transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const start = Math.max(1, page - 2);
                                const n = start + i;
                                if (n > totalPages) return null;
                                return (
                                    <button
                                        key={n}
                                        onClick={() => setPage(n)}
                                        className={cn(
                                            "px-3 py-1 rounded-lg text-sm transition-colors",
                                            n === page ? "bg-green-600 text-white" : "text-gray-400 hover:bg-white/5"
                                        )}
                                    >
                                        {n}
                                    </button>
                                );
                            })}
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                                className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 text-gray-400 transition-colors"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
                    <div className="bg-[#13151a] border border-gray-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-[#1a1d24] px-6 py-4 flex items-center justify-between border-b border-gray-800 z-10">
                            <div className="flex items-center gap-3 min-w-0">
                                {selectedProduct.image_url && (
                                    <img src={selectedProduct.image_url} alt="" className="h-12 w-12 rounded-xl object-cover bg-gray-800" />
                                )}
                                <div className="min-w-0">
                                    <h2 className="text-lg font-bold text-white truncate">{selectedProduct.name}</h2>
                                    <p className="text-xs text-gray-500">{selectedProduct.brand} · {selectedProduct.seller || "Satıcı yok"}</p>
                                    {selectedProduct.category && (
                                        <p className="text-[10px] text-gray-600 mt-0.5 truncate">{selectedProduct.category}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedProduct.url && (
                                    <a href={selectedProduct.url} target="_blank" rel="noopener" className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                        <ExternalLink className="h-5 w-5" />
                                    </a>
                                )}
                                <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Price Section — Enhanced */}
                            <div className="bg-[#0d0f14] rounded-2xl p-5 border border-white/5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-baseline gap-3">
                                        {selectedProduct.discounted_price && selectedProduct.original_price && selectedProduct.discounted_price < selectedProduct.original_price ? (
                                            <>
                                                <span className="text-3xl font-black text-green-400">{formatPrice(selectedProduct.discounted_price)}</span>
                                                <span className="text-lg text-gray-500 line-through font-medium">{formatPrice(selectedProduct.original_price)}</span>
                                                {selectedProduct.last_discount_rate && selectedProduct.last_discount_rate > 0 && (
                                                    <span className="px-2.5 py-1 bg-green-500/15 border border-green-500/30 text-green-400 rounded-full text-xs font-black">%{Math.round(selectedProduct.last_discount_rate)} İNDİRİM</span>
                                                )}
                                            </>
                                        ) : (
                                            <span className="text-3xl font-black text-white">{formatPrice(selectedProduct.last_price || selectedProduct.original_price)}</span>
                                        )}
                                    </div>
                                    {selectedProduct.category_tag && (
                                        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                            <Tag className="h-3 w-3 inline mr-1" />{selectedProduct.category_tag}
                                        </span>
                                    )}
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-4 gap-3">
                                    <div className="bg-[#13151a] rounded-xl p-3 text-center border border-white/5 hover:border-yellow-500/20 transition-colors">
                                        <Star className="h-4 w-4 text-yellow-400 mx-auto mb-1" />
                                        <div className="text-lg font-bold text-yellow-400">{selectedProduct.avg_rating?.toFixed(1) || "–"}</div>
                                        <div className="text-[9px] text-gray-500 font-medium">{formatNumber(selectedProduct.rating_count)} Değerlendirme</div>
                                    </div>
                                    <div className="bg-[#13151a] rounded-xl p-3 text-center border border-white/5 hover:border-pink-500/20 transition-colors">
                                        <Heart className="h-4 w-4 text-pink-400 mx-auto mb-1" />
                                        <div className="text-lg font-bold text-pink-400">{formatNumber(selectedProduct.favorite_count)}</div>
                                        <div className="text-[9px] text-gray-500 font-medium">Favori</div>
                                    </div>
                                    <div className="bg-[#13151a] rounded-xl p-3 text-center border border-white/5 hover:border-orange-500/20 transition-colors">
                                        <ShoppingCart className="h-4 w-4 text-orange-400 mx-auto mb-1" />
                                        <div className="text-lg font-bold text-orange-400">{formatNumber(selectedProduct.cart_count)}</div>
                                        <div className="text-[9px] text-gray-500 font-medium">Sepet</div>
                                    </div>
                                    <div className="bg-[#13151a] rounded-xl p-3 text-center border border-white/5 hover:border-blue-500/20 transition-colors">
                                        <Eye className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                                        <div className="text-lg font-bold text-blue-400">{formatNumber(selectedProduct.view_count)}</div>
                                        <div className="text-[9px] text-gray-500 font-medium">Görüntülenme</div>
                                    </div>
                                </div>
                            </div>

                            {/* Search Position + Secondary Metrics */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Search Position */}
                                {selectedProduct.page_number && (
                                    <div className="bg-[#0d0f14] rounded-2xl p-4 border border-white/5">
                                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                            <MapPin className="h-3 w-3" />Arama Pozisyonu
                                        </h4>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#13151a] rounded-xl px-4 py-2.5 text-center border border-cyan-500/20">
                                                <div className="text-xl font-black text-cyan-400">{selectedProduct.page_number}</div>
                                                <div className="text-[8px] text-gray-600 font-bold uppercase">Sayfa</div>
                                            </div>
                                            <div className="bg-[#13151a] rounded-xl px-4 py-2.5 text-center border border-emerald-500/20">
                                                <div className="text-xl font-black text-emerald-400">{selectedProduct.search_rank || "–"}</div>
                                                <div className="text-[8px] text-gray-600 font-bold uppercase">Sıra</div>
                                            </div>
                                            {selectedProduct.absolute_rank && (
                                                <div className="bg-[#13151a] rounded-xl px-4 py-2.5 text-center border border-amber-500/20">
                                                    <div className="text-xl font-black text-amber-400">#{selectedProduct.absolute_rank}</div>
                                                    <div className="text-[8px] text-gray-600 font-bold uppercase">Genel</div>
                                                </div>
                                            )}
                                        </div>
                                        {selectedProduct.search_term && (
                                            <div className="mt-2 text-[10px] text-gray-600">
                                                <Search className="h-3 w-3 inline mr-1" /> "{selectedProduct.search_term}"
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Secondary Metrics */}
                                <div className={cn("bg-[#0d0f14] rounded-2xl p-4 border border-white/5", !selectedProduct.page_number && "col-span-2")}>
                                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                        <TrendingUp className="h-3 w-3" />Performans
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Satış Hızı</span>
                                            <span className="text-sm font-bold text-green-400">{selectedProduct.avg_sales_velocity?.toFixed(1) || "–"}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Soru & Cevap</span>
                                            <span className="text-sm font-bold text-purple-400">{formatNumber(selectedProduct.qa_count)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Değerlendirme</span>
                                            <span className="text-sm font-bold text-cyan-400">{formatNumber(selectedProduct.rating_count)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Review Summary */}
                            {selectedProduct.review_summary && (
                                <div className="bg-[#0d0f14] rounded-xl p-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Yorum Özeti</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">{selectedProduct.review_summary}</p>
                                </div>
                            )}

                            {/* Attributes */}
                            {selectedProduct.attributes && Object.keys(selectedProduct.attributes).length > 0 && (
                                <div className="bg-[#0d0f14] rounded-xl p-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Ürün Özellikleri</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(selectedProduct.attributes)
                                            .filter(([k, v]) => v && v !== "" && k !== "image_urls" && k !== "sizes")
                                            .map(([key, value]) => (
                                                <div key={key} className="flex justify-between items-center py-1.5 px-3 bg-[#13151a] rounded-lg">
                                                    <span className="text-xs text-gray-500 capitalize">{key.replace(/_/g, " ")}</span>
                                                    <span className="text-xs text-white font-medium truncate max-w-[120px]">
                                                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                                    </span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}

                            {/* Sizes */}
                            {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                                <div className="bg-[#0d0f14] rounded-xl p-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Bedenler</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProduct.sizes.map((size: any, i: number) => {
                                            const isObj = typeof size === 'object' && size !== null;
                                            const name = isObj ? size.name : size;
                                            const inStock = isObj ? size.in_stock : true;
                                            const qty = isObj ? size.quantity : null;

                                            return (
                                                <div key={i} className="relative">
                                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-block ${inStock
                                                        ? 'bg-[#13151a] border border-emerald-800/50 text-white'
                                                        : 'bg-[#13151a] border border-red-800/50 text-gray-500 line-through'
                                                        }`}>
                                                        {name}
                                                    </span>
                                                    {isObj && (() => {
                                                        // API modunda quantity>0 varsa quantity'ye bak, DOM modunda sadece in_stock'a bak
                                                        const hasApiQty = qty !== null && qty !== undefined && qty > 0;
                                                        const isOut = !inStock;
                                                        const badgeColor = isOut ? 'bg-red-900 text-red-300' :
                                                            hasApiQty ? (
                                                                qty <= 10 ? 'bg-orange-900 text-orange-300' :
                                                                    qty <= 50 ? 'bg-yellow-900 text-yellow-300' :
                                                                        'bg-emerald-900 text-emerald-300'
                                                            ) : 'bg-emerald-900 text-emerald-300';
                                                        const badgeText = isOut ? '✗' : hasApiQty ? qty : '✓';
                                                        return (
                                                            <span className={`absolute -top-1.5 -right-1.5 text-[9px] px-1 rounded-full font-bold ${badgeColor}`}>
                                                                {badgeText}
                                                            </span>
                                                        );
                                                    })()}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Meta Info */}
                            <div className="flex justify-between text-xs text-gray-600 pt-2 border-t border-gray-800">
                                <span>ID: {selectedProduct.product_code}</span>
                                <span>İlk görülme: {selectedProduct.first_seen_at ? new Date(selectedProduct.first_seen_at).toLocaleDateString("tr-TR") : "–"}</span>
                                <span>Son güncelleme: {timeAgo(selectedProduct.last_scraped_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
