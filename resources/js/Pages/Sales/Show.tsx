import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatRupiah } from '@/Components/MetricCard';
import { SalesTransaction } from '@/types/models';
import { Printer, ArrowLeft, CheckCircle, WarningCircle } from '@phosphor-icons/react';

interface SalesShowProps {
    transaction: SalesTransaction;
}

export default function SalesShow({ transaction }: SalesShowProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href="/sales"
                        className="p-1.5 text-[#959595] hover:text-[#27272A] hover:bg-[#F5F5F7] rounded-lg transition-luxury"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-lg font-semibold text-[#27272A] tracking-tight">
                            Nota Penjualan #{transaction.invoice_number}
                        </h1>
                        <p className="text-xs text-[#959595]">Rincian Transaksi & Kalkulasi Laba</p>
                    </div>
                </div>
            }
        >
            <Head title={`Nota Penjualan ${transaction.invoice_number} — Febnine Atelier`} />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Action Bar (Hidden when printing) */}
                <div className="flex items-center justify-between no-print">
                    <span className="text-xs text-[#959595]">
                        Dibuat pada: {transaction.created_at || transaction.transaction_date}
                    </span>
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#27272A] bg-white border border-[#D4D4D8] hover:bg-[#F5F5F7] transition-luxury shadow-xs"
                    >
                        <Printer size={16} />
                        Cetak Nota (Print)
                    </button>
                </div>

                {/* Printable Invoice Card */}
                <div className="bg-white p-8 rounded-2xl border border-[#E8E8E9] shadow-diffused printable-content">
                    {/* Invoice Header */}
                    <div className="flex items-start justify-between border-b border-[#F0F0F1] pb-6">
                        <div className="flex items-center gap-4">
                            <img 
                                src="/images/logo_clean.png" 
                                alt="Febnine Atelier" 
                                className="h-16 w-auto object-contain"
                            />
                            <div>
                                <h2 className="text-base font-bold text-[#27272A] tracking-tight">Febnine Atelier</h2>
                                <p className="text-xs text-[#959595]">Butik Fashion & Atelier Eksklusif</p>
                                <p className="text-xs text-[#959595]">Gudang Pusat Distribusi</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF4F5] text-[#B86875] border border-[#E59AA6]/30">
                                {transaction.has_override ? 'Selesai (Override)' : 'Lunas'}
                            </span>
                            <p className="font-mono text-sm font-semibold text-[#27272A] mt-2">
                                {transaction.invoice_number}
                            </p>
                            <p className="text-xs text-[#959595]">
                                Tanggal: {transaction.transaction_date}
                            </p>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="py-6 border-b border-[#F0F0F1] grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <span className="text-[#959595] block mb-1">Kepada Pembeli:</span>
                            <p className="font-semibold text-sm text-[#27272A]">{transaction.buyer_name}</p>
                            {transaction.notes && (
                                <p className="text-[#959595] mt-1 italic">{transaction.notes}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <span className="text-[#959595] block mb-1">Diverifikasi Oleh:</span>
                            <p className="font-medium text-[#27272A]">Admin Gudang Febnine</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="py-6">
                        <table className="w-full text-left text-xs">
                            <thead className="text-[#959595] border-b border-[#F0F0F1] pb-2 font-medium">
                                <tr>
                                    <th className="py-2.5">Deskripsi Barang</th>
                                    <th className="py-2.5 text-center">Qty</th>
                                    <th className="py-2.5 text-right">Harga Satuan</th>
                                    <th className="py-2.5 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F0F1]">
                                {transaction.items?.map((item) => (
                                    <tr key={item.id} className="py-3">
                                        <td className="py-3">
                                            <p className="font-semibold text-[#27272A]">{item.product?.name}</p>
                                            <p className="text-[11px] font-mono text-[#959595]">
                                                {item.product?.sku} &bull; {[item.product?.variant_color, item.product?.variant_size].filter(Boolean).join(' / ')}
                                            </p>
                                        </td>
                                        <td className="py-3 text-center font-medium text-[#27272A]">
                                            {item.quantity} pcs
                                        </td>
                                        <td className="py-3 text-right text-[#646467]">
                                            {formatRupiah(Number(item.selling_price))}
                                        </td>
                                        <td className="py-3 text-right font-semibold text-[#27272A]">
                                            {formatRupiah(Number(item.subtotal_amount))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals & Net Profit summary */}
                    <div className="border-t border-[#F0F0F1] pt-4 space-y-2 text-xs">
                        <div className="flex justify-between text-[#646467]">
                            <span>Total Penjualan:</span>
                            <span className="font-semibold text-base text-[#27272A]">
                                {formatRupiah(Number(transaction.total_amount))}
                            </span>
                        </div>

                        {/* Internal Profit Ledger (Hidden in print if customer receipt, visible on screen) */}
                        <div className="no-print pt-3 mt-3 border-t border-dashed border-[#E8E8E9] flex items-center justify-between p-3 rounded-xl bg-[#EFF6F2] text-[#436453]">
                            <div>
                                <span className="font-medium block">Kalkulasi Laba Bersih Transaksi:</span>
                                <span className="text-[11px] text-[#7A9D8C]">
                                    (Omzet {formatRupiah(Number(transaction.total_amount))} - Total HPP {formatRupiah(Number(transaction.total_cogs))})
                                </span>
                            </div>
                            <span className="text-base font-bold">
                                {formatRupiah(Number(transaction.total_profit))}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-[#F0F0F1] text-center text-[11px] text-[#959595]">
                        <p>Terima kasih telah mempercayakan koleksi busana Anda kepada Febnine Atelier.</p>
                        <p className="mt-0.5">Sistem Manajemen Stok & Penjualan Terpusat</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
