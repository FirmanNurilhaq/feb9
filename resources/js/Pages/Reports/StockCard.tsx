import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Product } from '@/types/models';
import { 
    Notebook, 
    CalendarBlank, 
    Printer, 
    ArrowDownLeft, 
    ArrowUpRight,
    Tag,
    Archive
} from '@phosphor-icons/react';

interface MovementEntry {
    id: number;
    date: string;
    type: string;
    quantity: number;
    in_qty: number;
    out_qty: number;
    balance_after: number;
    notes?: string;
}

interface StockCardProps {
    products: Product[];
    selectedProduct: Product | null;
    openingBalance: number;
    endingBalance: number;
    movements: MovementEntry[];
    filters: {
        product_id?: string;
        start_date: string;
        end_date: string;
    };
}

export default function StockCard({
    products,
    selectedProduct,
    openingBalance,
    endingBalance,
    movements,
    filters,
}: StockCardProps) {
    const [productId, setProductId] = useState(filters.product_id || (products[0]?.id?.toString() || ''));
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/reports/stock-card', {
            product_id: productId,
            start_date: startDate,
            end_date: endDate,
        }, { preserveState: true });
    };

    const handlePrint = () => {
        window.print();
    };

    const totalIn = movements.reduce((acc, m) => acc + m.in_qty, 0);
    const totalOut = movements.reduce((acc, m) => acc + m.out_qty, 0);

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-lg font-semibold text-[#27272A] tracking-tight">Kartu Stok Gudang (Stock Card)</h1>
                    <p className="text-xs text-[#959595]">Febnine Atelier &bull; Rekapitulasi Mutasi Masuk/Keluar Berbasis Ledger Tunggal</p>
                </div>
            }
        >
            <Head title="Kartu Stok — Febnine Atelier" />

            <div className="space-y-6">
                {/* Printable Header */}
                <div className="hidden print:flex items-center justify-between pb-6 border-b border-black/20">
                    <div className="flex items-center gap-4">
                        <img src="/images/logo_clean.png" alt="Febnine Atelier" className="h-16 w-auto object-contain" />
                        <div>
                            <h2 className="text-xl font-bold">Febnine Atelier</h2>
                            <p className="text-xs text-gray-600">Kartu Stok Barang (Stock Movement Ledger)</p>
                            <p className="text-xs text-gray-600">Periode: {filters.start_date} s/d {filters.end_date}</p>
                        </div>
                    </div>
                    <div className="text-right text-xs">
                        <p>Dicetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                        <p className="font-semibold text-sm mt-1">{selectedProduct?.name} ({selectedProduct?.sku})</p>
                    </div>
                </div>

                {/* Filter and Print Bar (Hidden on print) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
                    <form onSubmit={handleFilter} className="flex flex-wrap items-center gap-2">
                        <select
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            className="text-xs py-2 px-3 rounded-xl bg-white border border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-1 focus:ring-[#E59AA6] text-[#27272A] transition-luxury min-w-[220px]"
                        >
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.sku} - {p.name}
                                </option>
                            ))}
                        </select>

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
                            Tampilkan
                        </button>
                    </form>

                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E59AA6] hover:bg-[#DB8B97] transition-luxury shadow-xs"
                    >
                        <Printer size={16} />
                        Cetak Kartu Stok
                    </button>
                </div>

                {/* Product Summary Header Card */}
                {selectedProduct && (
                    <div className="bg-white p-6 rounded-2xl border border-[#E8E8E9] shadow-diffused grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                            <span className="text-[11px] font-medium text-[#959595] uppercase tracking-wider">Produk Terpilih</span>
                            <h3 className="text-base font-semibold text-[#27272A] mt-1">{selectedProduct.name}</h3>
                            <p className="text-xs font-mono text-[#E59AA6] mt-0.5">{selectedProduct.sku}</p>
                        </div>
                        <div>
                            <span className="text-[11px] font-medium text-[#959595] uppercase tracking-wider">Saldo Awal Periode</span>
                            <p className="text-xl font-bold text-[#646467] mt-1">{openingBalance} pcs</p>
                            <span className="text-[11px] text-[#959595]">Posisi stok per {filters.start_date}</span>
                        </div>
                        <div>
                            <span className="text-[11px] font-medium text-[#959595] uppercase tracking-wider">Total Mutasi Periode</span>
                            <p className="text-xl font-bold text-[#27272A] mt-1">
                                <span className="text-[#7A9D8C]">+{totalIn}</span> / <span className="text-[#D9777F]">-{totalOut}</span>
                            </p>
                            <span className="text-[11px] text-[#959595]">Masuk vs Keluar</span>
                        </div>
                        <div>
                            <span className="text-[11px] font-medium text-[#959595] uppercase tracking-wider">Saldo Akhir Periode</span>
                            <p className="text-xl font-bold text-[#27272A] mt-1">{endingBalance} pcs</p>
                            <span className="text-[11px] text-[#7A9D8C] font-semibold">Tercatat di sistem</span>
                        </div>
                    </div>
                )}

                {/* Ledger Movement Table */}
                <div className="bg-white rounded-2xl border border-[#E8E8E9] shadow-diffused overflow-hidden printable-content">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#FAF9FA] text-[#959595] border-b border-[#F0F0F1] font-medium">
                                <tr>
                                    <th className="py-3.5 px-6">Waktu & Tanggal</th>
                                    <th className="py-3.5 px-4">Jenis Transaksi</th>
                                    <th className="py-3.5 px-4 text-center text-[#7A9D8C]">Masuk (+)</th>
                                    <th className="py-3.5 px-4 text-center text-[#D9777F]">Keluar (-)</th>
                                    <th className="py-3.5 px-4 text-center font-bold text-[#27272A]">Saldo Akhir</th>
                                    <th className="py-3.5 px-6">Keterangan Mutasi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F0F1]">
                                <tr className="bg-[#FAF9FA]/40 font-medium">
                                    <td className="py-3 px-6 text-[#959595]" colSpan={4}>
                                        Saldo Awal ({filters.start_date})
                                    </td>
                                    <td className="py-3 px-4 text-center font-bold text-[#27272A]">
                                        {openingBalance} pcs
                                    </td>
                                    <td className="py-3 px-6 text-[#959595] italic">
                                        Posisi saldo awal periode
                                    </td>
                                </tr>

                                {movements.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-[#959595]">
                                            Tidak ada pergerakan stok untuk produk ini dalam rentang tanggal yang dipilih.
                                        </td>
                                    </tr>
                                ) : (
                                    movements.map((m) => (
                                        <tr key={m.id} className="hover:bg-[#FAF9FA]/60 transition-luxury">
                                            <td className="py-3.5 px-6 text-[#27272A] font-mono">
                                                {m.date}
                                            </td>

                                            <td className="py-3.5 px-4 capitalize">
                                                <span className="font-medium text-[#27272A]">
                                                    {m.type.replace('_', ' ')}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 text-center font-semibold text-[#7A9D8C]">
                                                {m.in_qty > 0 ? `+${m.in_qty}` : '-'}
                                            </td>

                                            <td className="py-3.5 px-4 text-center font-semibold text-[#D9777F]">
                                                {m.out_qty > 0 ? `-${m.out_qty}` : '-'}
                                            </td>

                                            <td className="py-3.5 px-4 text-center font-bold text-[#27272A]">
                                                {m.balance_after} pcs
                                            </td>

                                            <td className="py-3.5 px-6 text-[#646467]">
                                                {m.notes || '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            <tfoot className="bg-[#FAF9FA] font-bold border-t-2 border-[#E8E8E9]">
                                <tr>
                                    <td colSpan={2} className="py-4 px-6 text-[#27272A]">
                                        SALDO AKHIR PERIODE
                                    </td>
                                    <td className="py-4 px-4 text-center text-[#7A9D8C]">
                                        +{totalIn}
                                    </td>
                                    <td className="py-4 px-4 text-center text-[#D9777F]">
                                        -{totalOut}
                                    </td>
                                    <td className="py-4 px-4 text-center text-sm font-extrabold text-[#27272A]">
                                        {endingBalance} pcs
                                    </td>
                                    <td className="py-4 px-6 text-[#959595]">
                                        Tersinkronisasi
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Print Signatures */}
                <div className="hidden print:grid grid-cols-2 pt-12 text-xs">
                    <div>
                        <p className="text-gray-500">Petugas Gudang:</p>
                        <div className="h-16" />
                        <p className="font-semibold underline">Bagian Logistik & Inventori</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500">Penanggung Jawab:</p>
                        <div className="h-16" />
                        <p className="font-semibold underline">Kepala Gudang Febnine Atelier</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
