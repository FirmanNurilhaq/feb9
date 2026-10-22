import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MetricCard, { formatRupiah } from '@/Components/MetricCard';
import RevenueAreaChart from '@/Components/RevenueAreaChart';
import { 
    CurrencyDollar, 
    TrendUp, 
    Package, 
    Receipt, 
    WarningCircle,
    ArrowUpRight,
    ArrowDownLeft,
    Plus,
    ClockCounterClockwise,
    Sparkle
} from '@phosphor-icons/react';

interface TopSellingProduct {
    product_id: number;
    name: string;
    sku: string;
    category: string;
    total_sold: number;
    total_revenue: number;
    total_profit: number;
}

interface LowStockProduct {
    id: number;
    sku: string;
    name: string;
    variant: string;
    current_stock: number;
    min_stock: number;
    cost_price: number;
    selling_price: number;
}

interface RecentActivity {
    id: number;
    type: string;
    quantity: number;
    balance_after: number;
    product_name: string;
    sku: string;
    notes?: string;
    created_at: string;
}

interface DashboardProps {
    metrics: {
        total_revenue: number;
        total_profit: number;
        total_asset_value: number;
        total_transactions: number;
        low_stock_count: number;
    };
    chartData: Array<{ label: string; revenue: number; profit: number }>;
    period: 'daily' | 'weekly' | 'monthly';
    topSelling: TopSellingProduct[];
    lowStockProducts: LowStockProduct[];
    recentActivities: RecentActivity[];
}

export default function Dashboard({
    metrics,
    chartData,
    period,
    topSelling,
    lowStockProducts,
    recentActivities,
}: DashboardProps) {
    const changePeriod = (newPeriod: string) => {
        router.get('/dashboard', { period: newPeriod }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-lg font-semibold text-[#27272A] tracking-tight">Dashboard Gudang</h1>
                    <p className="text-xs text-[#959595]">Febnine Atelier &bull; Pemantauan Stok & Kinerja Penjualan</p>
                </div>
            }
        >
            <Head title="Dashboard Gudang — Febnine Atelier" />

            <div className="space-y-6">
                {/* 1. Baris Metrik Utama */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Total Pendapatan"
                        value={metrics.total_revenue}
                        subtitle="Akumulasi omzet penjualan"
                        icon={CurrencyDollar}
                        iconBg="bg-[#FDF4F5]"
                        iconColor="text-[#E59AA6]"
                    />
                    <MetricCard
                        title="Laba Bersih"
                        value={metrics.total_profit}
                        subtitle="Laba kotor setelah HPP"
                        icon={TrendUp}
                        iconBg="bg-[#EFF6F2]"
                        iconColor="text-[#7A9D8C]"
                    />
                    <MetricCard
                        title="Nilai Aset Stok"
                        value={metrics.total_asset_value}
                        subtitle="Valuasi modal barang di gudang"
                        icon={Package}
                        iconBg="bg-[#F5F5F7]"
                        iconColor="text-[#27272A]"
                    />
                    <MetricCard
                        title="Stok Menipis"
                        value={`${metrics.low_stock_count} SKU`}
                        subtitle="Barang mencapai batas reorder"
                        icon={WarningCircle}
                        iconBg={metrics.low_stock_count > 0 ? 'bg-[#FCF0F1]' : 'bg-[#F5F5F7]'}
                        iconColor={metrics.low_stock_count > 0 ? 'text-[#D9777F]' : 'text-[#959595]'}
                    />
                </div>

                {/* 2. Visualisasi Tren Penjualan & Laba */}
                <div className="bg-white p-6 rounded-2xl border border-[#E8E8E9] shadow-diffused">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-base font-semibold text-[#27272A]">Tren Penjualan & Laba Bersih</h2>
                            <p className="text-xs text-[#959595]">Visualisasi arus kas masuk dan keuntungan aktual setelah pemotongan modal</p>
                        </div>
                        <div className="inline-flex p-1 bg-[#F5F5F7] rounded-lg border border-[#E8E8E9] self-start sm:self-auto">
                            {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => changePeriod(p)}
                                    className={`
                                        px-3 py-1.5 rounded-md text-xs font-medium transition-luxury capitalize
                                        ${period === p 
                                            ? 'bg-white text-[#27272A] shadow-xs font-semibold' 
                                            : 'text-[#959595] hover:text-[#27272A]'
                                        }
                                    `}
                                >
                                    {p === 'daily' ? 'Harian' : p === 'weekly' ? 'Mingguan' : 'Bulanan'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <RevenueAreaChart data={chartData} />
                </div>

                {/* 3. Baris Dua Kolom: Top Selling & Low Stock + Aktivitas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom 1 & 2: Top Selling Products */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E8E8E9] shadow-diffused flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-[#27272A] flex items-center gap-2">
                                        <Sparkle size={18} className="text-[#E59AA6]" weight="fill" />
                                        Produk Terlaris (Fast Moving)
                                    </h3>
                                    <p className="text-xs text-[#959595]">Rekomendasi prioritas restok ke konveksi</p>
                                </div>
                                <Link 
                                    href="/products" 
                                    className="text-xs font-medium text-[#E59AA6] hover:text-[#DB8B97] transition-luxury"
                                >
                                    Lihat Semua &rarr;
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="text-[#959595] border-b border-[#F0F0F1] font-medium">
                                        <tr>
                                            <th className="py-2.5">Produk</th>
                                            <th className="py-2.5 text-center">Terjual</th>
                                            <th className="py-2.5 text-right">Pendapatan</th>
                                            <th className="py-2.5 text-right">Laba Bersih</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F0F0F1]">
                                        {topSelling.map((item, idx) => (
                                            <tr key={item.product_id} className="hover:bg-[#F5F5F7]/50 transition-luxury">
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="w-5 h-5 rounded-full bg-[#F5F5F7] text-[11px] font-semibold text-[#959595] flex items-center justify-center shrink-0">
                                                            {idx + 1}
                                                        </span>
                                                        <div>
                                                            <p className="font-medium text-[#27272A]">{item.name}</p>
                                                            <p className="text-[11px] text-[#959595] font-mono">{item.sku}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-center font-semibold text-[#27272A]">
                                                    {item.total_sold} pcs
                                                </td>
                                                <td className="py-3 text-right text-[#27272A]">
                                                    {formatRupiah(item.total_revenue)}
                                                </td>
                                                <td className="py-3 text-right font-medium text-[#7A9D8C]">
                                                    {formatRupiah(item.total_profit)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Kolom 3: Peringatan Stok & Aktivitas Terkini */}
                    <div className="space-y-6">
                        {/* Peringatan Stok Menipis */}
                        <div className="bg-white p-5 rounded-2xl border border-[#E8E8E9] shadow-diffused">
                            <h3 className="text-sm font-semibold text-[#27272A] mb-3 flex items-center gap-2">
                                <WarningCircle size={18} className="text-[#D9777F]" />
                                Peringatan Stok Menipis
                            </h3>
                            {lowStockProducts.length === 0 ? (
                                <p className="text-xs text-[#959595] py-4 text-center">Seluruh stok berada di atas batas aman.</p>
                            ) : (
                                <div className="space-y-2.5">
                                    {lowStockProducts.map((p) => (
                                        <div 
                                            key={p.id}
                                            className="p-3 rounded-lg bg-[#FCF0F1]/60 border border-[#D9777F]/20 flex items-center justify-between text-xs"
                                        >
                                            <div>
                                                <p className="font-medium text-[#27272A] truncate max-w-[140px]">{p.name}</p>
                                                <p className="text-[11px] text-[#959595] font-mono">{p.sku}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="px-2 py-0.5 rounded-full bg-[#D9777F] text-white font-semibold text-[11px]">
                                                    Sisa {p.current_stock}
                                                </span>
                                                <p className="text-[10px] text-[#959595] mt-0.5">Min: {p.min_stock}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Log Aktivitas Terkini */}
                        <div className="bg-white p-5 rounded-2xl border border-[#E8E8E9] shadow-diffused">
                            <h3 className="text-sm font-semibold text-[#27272A] mb-3 flex items-center gap-2">
                                <ClockCounterClockwise size={18} className="text-[#959595]" />
                                Aktivitas Gudang Terakhir
                            </h3>
                            <div className="space-y-3">
                                {recentActivities.map((act) => (
                                    <div key={act.id} className="flex items-start gap-2.5 text-xs">
                                        <div className={`mt-0.5 p-1 rounded-full shrink-0 ${
                                            act.type === 'inbound' || act.type === 'return_restock' 
                                                ? 'bg-[#EFF6F2] text-[#7A9D8C]' 
                                                : 'bg-[#FDF4F5] text-[#E59AA6]'
                                        }`}>
                                            {act.type === 'inbound' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-[#27272A] truncate">
                                                {act.quantity > 0 ? `+${act.quantity}` : act.quantity} pcs &bull; {act.product_name}
                                            </p>
                                            <p className="text-[11px] text-[#959595] truncate">{act.notes}</p>
                                        </div>
                                        <span className="text-[10px] text-[#B3B3B3] shrink-0">{act.created_at}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
