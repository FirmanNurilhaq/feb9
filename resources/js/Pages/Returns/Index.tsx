import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ReturnRecord, Product, SalesTransaction } from '@/types/models';
import { 
    Plus, 
    ArrowCounterClockwise, 
    ArrowUUpLeft, 
    Trash, 
    X, 
    CheckCircle,
    WarningCircle,
    Receipt
} from '@phosphor-icons/react';

interface PaginatedReturns {
    data: ReturnRecord[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface ReturnsIndexProps {
    returns: PaginatedReturns;
    transactions: SalesTransaction[];
    products: Product[];
    filters: { disposition?: string };
}

export default function ReturnsIndex({ returns, transactions, products, filters }: ReturnsIndexProps) {
    const [modalOpen, setModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        sales_transaction_id: '',
        product_id: '',
        quantity: 1,
        disposition: 'restock' as 'restock' | 'discard',
        reason: '',
        notes: '',
        return_date: new Date().toISOString().split('T')[0],
    });

    const handleFilter = (disposition: string) => {
        router.get('/returns', { disposition: disposition || undefined }, { preserveState: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/returns', {
            onSuccess: () => {
                setModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-lg font-semibold text-[#27272A] tracking-tight">Manajemen Retur</h1>
                    <p className="text-xs text-[#959595]">Febnine Atelier &bull; Pencatatan Pengembalian Barang & Alur Stok</p>
                </div>
            }
        >
            <Head title="Manajemen Retur — Febnine Atelier" />

            <div className="space-y-6">
                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="inline-flex p-1 bg-[#F5F5F7] rounded-xl border border-[#E8E8E9]">
                        <button
                            type="button"
                            onClick={() => handleFilter('')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-luxury ${
                                !filters.disposition ? 'bg-white text-[#27272A] font-semibold shadow-xs' : 'text-[#959595]'
                            }`}
                        >
                            Semua Retur
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFilter('restock')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-luxury ${
                                filters.disposition === 'restock' ? 'bg-white text-[#436453] font-semibold shadow-xs' : 'text-[#959595]'
                            }`}
                        >
                            Dijual Kembali
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFilter('discard')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-luxury ${
                                filters.disposition === 'discard' ? 'bg-white text-[#D9777F] font-semibold shadow-xs' : 'text-[#959595]'
                            }`}
                        >
                            Dibuang / Rusak
                        </button>
                    </div>

                    <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E59AA6] hover:bg-[#DB8B97] transition-luxury shadow-xs"
                    >
                        <Plus size={16} weight="bold" />
                        Catat Retur Baru
                    </button>
                </div>

                {/* Table View */}
                <div className="bg-white rounded-2xl border border-[#E8E8E9] shadow-diffused overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#FAF9FA] text-[#959595] border-b border-[#F0F0F1] font-medium tracking-wide">
                                <tr>
                                    <th className="py-4 px-6">No. Retur & Tanggal</th>
                                    <th className="py-4 px-4">Produk</th>
                                    <th className="py-4 px-4 text-center">Jumlah</th>
                                    <th className="py-4 px-4">Alur / Disposisi</th>
                                    <th className="py-4 px-4">Alasan & Catatan</th>
                                    <th className="py-4 px-6">Ref. Nota</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F0F1]">
                                {returns.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-[#959595]">
                                            Belum ada pencatatan retur barang.
                                        </td>
                                    </tr>
                                ) : (
                                    returns.data.map((ret) => (
                                        <tr key={ret.id} className="hover:bg-[#FAF9FA]/60 transition-luxury">
                                            <td className="py-4 px-6">
                                                <p className="font-semibold text-[#27272A] font-mono">{ret.return_number}</p>
                                                <p className="text-[11px] text-[#959595]">{ret.return_date}</p>
                                            </td>

                                            <td className="py-4 px-4">
                                                <p className="font-semibold text-[#27272A]">{ret.product?.name}</p>
                                                <p className="text-[11px] font-mono text-[#959595]">{ret.product?.sku}</p>
                                            </td>

                                            <td className="py-4 px-4 text-center font-semibold text-[#27272A]">
                                                {ret.quantity} pcs
                                            </td>

                                            <td className="py-4 px-4">
                                                {ret.disposition === 'restock' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EFF6F2] text-[#436453] border border-[#7A9D8C]/30">
                                                        <CheckCircle size={14} />
                                                        Dijual Kembali (+Stok)
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FCF0F1] text-[#D9777F] border border-[#D9777F]/30">
                                                        <Trash size={14} />
                                                        Dibuang / Rusak (Afkir)
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-4 px-4">
                                                <p className="text-[#27272A] font-medium">{ret.reason}</p>
                                                {ret.notes && (
                                                    <p className="text-[11px] text-[#959595] italic">{ret.notes}</p>
                                                )}
                                            </td>

                                            <td className="py-4 px-6 text-[#959595] font-mono">
                                                {ret.transaction ? ret.transaction.invoice_number : '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Input Retur */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E8E8E9] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-[#F0F0F1] flex items-center justify-between">
                            <h3 className="text-base font-semibold text-[#27272A] flex items-center gap-2">
                                <ArrowCounterClockwise size={20} className="text-[#E59AA6]" />
                                Catat Pengembalian Barang (Retur)
                            </h3>
                            <button onClick={() => setModalOpen(false)} className="text-[#959595] hover:text-[#27272A]">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
                            <div>
                                <label className="block font-medium text-[#27272A] mb-1">Pilih Produk Diretur *</label>
                                <select
                                    value={data.product_id}
                                    onChange={(e) => setData('product_id', e.target.value)}
                                    className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                    required
                                >
                                    <option value="">Pilih Produk (SKU)</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                                    ))}
                                </select>
                                {errors.product_id && <p className="text-[#D9777F] mt-1">{errors.product_id}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium text-[#27272A] mb-1">Jumlah Diretur *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.quantity}
                                        onChange={(e) => setData('quantity', parseInt(e.target.value) || 1)}
                                        className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-[#27272A] mb-1">Tanggal Retur *</label>
                                    <input
                                        type="date"
                                        value={data.return_date}
                                        onChange={(e) => setData('return_date', e.target.value)}
                                        className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Pilihan Disposisi (Dijual Kembali vs Dibuang) */}
                            <div>
                                <label className="block font-medium text-[#27272A] mb-2">Tindakan Barang Retur *</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`
                                        p-3.5 rounded-xl border cursor-pointer transition-luxury flex flex-col justify-between
                                        ${data.disposition === 'restock' 
                                            ? 'border-[#7A9D8C] bg-[#EFF6F2]/60 text-[#436453]' 
                                            : 'border-[#E8E8E9] bg-white text-[#646467]'
                                        }
                                    `}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <input
                                                type="radio"
                                                name="disposition"
                                                value="restock"
                                                checked={data.disposition === 'restock'}
                                                onChange={() => setData('disposition', 'restock')}
                                                className="text-[#7A9D8C] focus:ring-[#7A9D8C]"
                                            />
                                            <span className="font-semibold text-xs">Dijual Kembali</span>
                                        </div>
                                        <p className="text-[10px] text-[#959595] pl-5">
                                            Kondisi bagus. Stok fisik gudang bertambah kembali (+1).
                                        </p>
                                    </label>

                                    <label className={`
                                        p-3.5 rounded-xl border cursor-pointer transition-luxury flex flex-col justify-between
                                        ${data.disposition === 'discard' 
                                            ? 'border-[#D9777F] bg-[#FCF0F1]/60 text-[#9B3C44]' 
                                            : 'border-[#E8E8E9] bg-white text-[#646467]'
                                        }
                                    `}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <input
                                                type="radio"
                                                name="disposition"
                                                value="discard"
                                                checked={data.disposition === 'discard'}
                                                onChange={() => setData('disposition', 'discard')}
                                                className="text-[#D9777F] focus:ring-[#D9777F]"
                                            />
                                            <span className="font-semibold text-xs">Dibuang / Rusak</span>
                                        </div>
                                        <p className="text-[10px] text-[#959595] pl-5">
                                            Cacat/rusak berat. Tidak menambah stok gudang (afkir).
                                        </p>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium text-[#27272A] mb-1">Alasan Retur *</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Salah ukuran, cacat jahitan, dll"
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-[#27272A] mb-1">Ref. Nota Penjualan (Opsional)</label>
                                <select
                                    value={data.sales_transaction_id}
                                    onChange={(e) => setData('sales_transaction_id', e.target.value)}
                                    className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                >
                                    <option value="">Pilih Nota (Jika ada)</option>
                                    {transactions.map((tx) => (
                                        <option key={tx.id} value={tx.id}>
                                            {tx.invoice_number} - {tx.buyer_name} ({tx.transaction_date})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 border-t border-[#F0F0F1] flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-medium text-[#27272A] bg-[#F5F5F7] hover:bg-[#E8E8E9] transition-luxury"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#E59AA6] hover:bg-[#DB8B97] transition-luxury disabled:opacity-50 shadow-xs"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Retur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
