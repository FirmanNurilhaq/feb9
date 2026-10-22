import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatRupiah } from '@/Components/MetricCard';
import { SalesTransaction } from '@/types/models';
import { 
    CalendarBlank, 
    DownloadSimple, 
    Printer, 
    Funnel,
    CurrencyDollar,
    TrendUp,
    Percent
} from '@phosphor-icons/react';

interface SalesReportProps {
    transactions: SalesTransaction[];
    summary: {
        total_revenue: number;
        total_cogs: number;
        total_profit: number;
        profit_margin: number;
        transaction_count: number;
    };
    filters: {
        start_date: string;
        end_date: string;
    };
}

export default function SalesReport({ transactions, summary, filters }: SalesReportProps) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/reports/sales', { start_date: startDate, end_date: endDate }, { preserveState: true });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-lg font-semibold text-[#27272A] tracking-tight">Laporan Penjualan & Laba Rugi</h1>
                    <p className="text-xs text-[#959595]">Febnine Atelier &bull; Rekapitulasi Omzet, HPP & Keuntungan Bersih</p>
                </div>
            }
        >
            <Head title="Laporan Penjualan & Laba Rugi — Febnine Atelier" />

            <div className="space-y-6">
                {/* Printable Header (Visible only when printed) */}
                <div className="hidden print:flex items-center justify-between pb-6 border-b border-black/20">
                    <div className="flex items-center gap-4">
                        <img src="/images/logo_clean.png" alt="Febnine Atelier" className="h-16 w-auto object-contain" />
                        <div>
                            <h2 className="text-xl font-bold">Febnine Atelier</h2>
                            <p className="text-xs text-gray-600">Laporan Penjualan & Laba Rugi</p>
                            <p className="text-xs text-gray-600">Periode: {filters.start_date} s/d {filters.end_date}</p>
                        </div>
                    </div>
                    <div className="text-right text-xs">
                        <p>Dicetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                        <p>Otorisasi: Admin Gudang Febnine</p>
                    </div>
                </div>

                {/* Filter and Export Bar (Hidden on print) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
                    <form onSubmit={handleFilter} className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E8E8E9]">
                            <CalendarBlank size={16} className="text-[#959595]" />
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="text-xs border-0 p-0 text-[#27272A] focus:ring-0"
                            />
                            <span className="text-[#959595] text-xs">s/d</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="text-xs border-0 p-0 text-[#27272A] focus:ring-0"
                            />
                        </div>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-[#27272A] hover:bg-[#3F3F46] transition-luxury"
                        >
                            Terapkan
                        </button>
                    </form>

                    <div className="flex items-center gap-2">
                        <a
                            href={`/reports/sales/export-csv?start_date=${startDate}&end_date=${endDate}`}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-[#27272A] bg-white border border-[#D4D4D8] hover:bg-[#F5F5F7] transition-luxury shadow-xs"
                        >
                            <DownloadSimple size={16} />
                            Ekspor Excel (.csv)
                        </a>

                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E59AA6] hover:bg-[#DB8B97] transition-luxury shadow-xs"
                        >
                            <Printer size={16} />
                            Cetak Laporan
                        </button>
                    </div>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-[#E8E8E9] shadow-diffused">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-[#959595]">Total Omzet Kotor</span>
                        <p className="text-xl font-bold text-[#27272A] mt-1">{formatRupiah(summary.total_revenue)}</p>
                        <span className="text-[11px] text-[#959595] mt-0.5 block">{summary.transaction_count} transaksi dicatat</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#E8E8E9] shadow-diffused">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-[#959595]">Total HPP (Modal)</span>
                        <p className="text-xl font-bold text-[#646467] mt-1">{formatRupiah(summary.total_cogs)}</p>
                        <span className="text-[11px] text-[#959595] mt-0.5 block">Total pengeluaran produksi</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#E8E8E9] shadow-diffused">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-[#959595]">Laba Bersih</span>
                        <p className="text-xl font-bold text-[#7A9D8C] mt-1">{formatRupiah(summary.total_profit)}</p>
                        <span className="text-[11px] text-[#7A9D8C] mt-0.5 block">Omzet dikurangi HPP</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#E8E8E9] shadow-diffused">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-[#959595]">Margin Keuntungan</span>
                        <p className="text-xl font-bold text-[#E59AA6] mt-1">{summary.profit_margin}%</p>
                        <span className="text-[11px] text-[#959595] mt-0.5 block">Rasio laba terhadap omzet</span>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="bg-white rounded-2xl border border-[#E8E8E9] shadow-diffused overflow-hidden printable-content">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#FAF9FA] text-[#959595] border-b border-[#F0F0F1] font-medium">
                                <tr>
                                    <th className="py-3.5 px-6">Tanggal & No. Invoice</th>
                                    <th className="py-3.5 px-4">Pembeli</th>
                                    <th className="py-3.5 px-4">Item Terjual</th>
                                    <th className="py-3.5 px-4 text-right">Penjualan</th>
                                    <th className="py-3.5 px-4 text-right">HPP</th>
                                    <th className="py-3.5 px-6 text-right">Laba Bersih</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F0F1]">
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-[#959595]">
                                            Tidak ada transaksi dalam rentang tanggal yang dipilih.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-[#FAF9FA]/60 transition-luxury">
                                            <td className="py-3.5 px-6">
                                                <p className="font-semibold text-[#27272A] font-mono">{t.invoice_number}</p>
                                                <p className="text-[11px] text-[#959595]">{t.transaction_date}</p>
                                            </td>

                                            <td className="py-3.5 px-4 font-medium text-[#27272A]">
                                                {t.buyer_name}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="space-y-0.5">
                                                    {t.items?.map((item) => (
                                                        <div key={item.id} className="text-[11px] text-[#646467]">
                                                            <span className="font-semibold text-[#27272A]">{item.quantity}x</span>{' '}
                                                            <span>{item.product?.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 text-right text-[#27272A]">
                                                {formatRupiah(Number(t.total_amount))}
                                            </td>

                                            <td className="py-3.5 px-4 text-right text-[#959595]">
                                                {formatRupiah(Number(t.total_cogs))}
                                            </td>

                                            <td className="py-3.5 px-6 text-right font-semibold text-[#7A9D8C]">
                                                {formatRupiah(Number(t.total_profit))}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            {transactions.length > 0 && (
                                <tfoot className="bg-[#FAF9FA] font-bold border-t-2 border-[#E8E8E9]">
                                    <tr>
                                        <td colSpan={3} className="py-4 px-6 text-[#27272A]">
                                            TOTAL KESELURUHAN
                                        </td>
                                        <td className="py-4 px-4 text-right text-[#27272A]">
                                            {formatRupiah(summary.total_revenue)}
                                        </td>
                                        <td className="py-4 px-4 text-right text-[#959595]">
                                            {formatRupiah(summary.total_cogs)}
                                        </td>
                                        <td className="py-4 px-6 text-right text-[#7A9D8C]">
                                            {formatRupiah(summary.total_profit)}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>

                {/* Print Signature block (visible only on print) */}
                <div className="hidden print:grid grid-cols-2 pt-12 text-xs">
                    <div>
                        <p className="text-gray-500">Dibuat Oleh:</p>
                        <div className="h-16" />
                        <p className="font-semibold underline">Staff Administrasi Gudang</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500">Mengetahui & Menyetujui:</p>
                        <div className="h-16" />
                        <p className="font-semibold underline">Pemilik / Owner Febnine Atelier</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
