import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatRupiah } from '@/Components/MetricCard';
import ShortageModal, { ShortageItem } from '@/Components/ShortageModal';
import { SalesTransaction, Product } from '@/types/models';
import axios from 'axios';
import { 
    Plus, 
    MagnifyingGlass, 
    Receipt, 
    Trash, 
    X, 
    Eye,
    WarningCircle,
    User,
    CalendarBlank
} from '@phosphor-icons/react';

interface PaginatedTransactions {
    data: SalesTransaction[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface SalesIndexProps {
    transactions: PaginatedTransactions;
    products: Array<Product & { current_stock: number }>;
    filters: { search?: string };
}

interface SalesRow {
    product_id: string;
    quantity: number;
    selling_price: number;
}

export default function SalesIndex({ transactions, products, filters }: SalesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [modalOpen, setModalOpen] = useState(false);

    // Shortage validation state
    const [shortageModalOpen, setShortageModalOpen] = useState(false);
    const [shortages, setShortages] = useState<ShortageItem[]>([]);
    const [isCheckingStock, setIsCheckingStock] = useState(false);

    const [rows, setRows] = useState<SalesRow[]>([
        { product_id: '', quantity: 1, selling_price: 0 },
    ]);

    const { data, setData, post, processing, errors, reset } = useForm({
        buyer_name: '',
        transaction_date: new Date().toISOString().split('T')[0],
        force_complete: false,
        notes: '',
        items: [] as any[],
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/sales', { search }, { preserveState: true, replace: true });
    };

    const addRow = () => {
        setRows([...rows, { product_id: '', quantity: 1, selling_price: 0 }]);
    };

    const removeRow = (index: number) => {
        if (rows.length === 1) return;
        setRows(rows.filter((_, i) => i !== index));
    };

    const updateRow = (index: number, field: keyof SalesRow, value: any) => {
        const updated = [...rows];
        updated[index] = { ...updated[index], [field]: value };

        if (field === 'product_id') {
            const prod = products.find((p) => p.id === Number(value));
            if (prod) {
                updated[index].selling_price = Number(prod.selling_price);
            }
        }

        setRows(updated);
    };

    // Validasi stok sebelum submit
    const handlePreSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validRows = rows.filter((r) => r.product_id && r.quantity > 0);
        if (validRows.length === 0) {
            alert('Silakan pilih produk dan jumlah kuantitas yang valid.');
            return;
        }

        setIsCheckingStock(true);
        try {
            const res = await axios.post('/sales/check-stock', { items: validRows });
            if (res.data.has_shortage) {
                setShortages(res.data.shortages);
                setShortageModalOpen(true);
            } else {
                executeSubmit(false);
            }
        } catch (err) {
            console.error(err);
            executeSubmit(false);
        } finally {
            setIsCheckingStock(false);
        }
    };

    const executeSubmit = (force: boolean) => {
        const validRows = rows.filter((r) => r.product_id && r.quantity > 0);
        router.post('/sales', {
            ...data,
            force_complete: force,
            items: validRows as any,
        }, {
            onSuccess: () => {
                setModalOpen(false);
                setShortageModalOpen(false);
                reset();
                setRows([{ product_id: '', quantity: 1, selling_price: 0 }]);
            },
        });
    };

    const totalSaleAmount = rows.reduce((acc, r) => acc + (r.quantity * (r.selling_price || 0)), 0);

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-lg font-semibold text-[#27272A] tracking-tight">Pencatatan Penjualan</h1>
                    <p className="text-xs text-[#959595]">Febnine Atelier &bull; Input Pembelian Manual & Pemotongan Stok</p>
                </div>
            }
        >
            <Head title="Pencatatan Penjualan — Febnine Atelier" />

            <div className="space-y-6">
                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <form onSubmit={handleSearch} className="relative w-64">
                        <input
                            type="text"
                            placeholder="Cari no invoice / nama pembeli..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-1 focus:ring-[#E59AA6] text-[#27272A] transition-luxury"
                        />
                        <MagnifyingGlass size={16} className="absolute left-3 top-2.5 text-[#959595]" />
                    </form>

                    <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E59AA6] hover:bg-[#DB8B97] transition-luxury shadow-xs"
                    >
                        <Plus size={16} weight="bold" />
                        Input Penjualan Baru
                    </button>
                </div>

                {/* Table View */}
                <div className="bg-white rounded-2xl border border-[#E8E8E9] shadow-diffused overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#FAF9FA] text-[#959595] border-b border-[#F0F0F1] font-medium tracking-wide">
                                <tr>
                                    <th className="py-4 px-6">Invoice & Tanggal</th>
                                    <th className="py-4 px-4">Nama Pembeli</th>
                                    <th className="py-4 px-4">Rincian Barang</th>
                                    <th className="py-4 px-4 text-right">Total Transaksi</th>
                                    <th className="py-4 px-4 text-right">Laba Bersih</th>
                                    <th className="py-4 px-6 text-center">Status / Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F0F1]">
                                {transactions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-[#959595]">
                                            Belum ada transaksi penjualan yang dicatat.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.data.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-[#FAF9FA]/60 transition-luxury">
                                            <td className="py-4 px-6">
                                                <p className="font-semibold text-[#27272A] font-mono">{tx.invoice_number}</p>
                                                <p className="text-[11px] text-[#959595]">{tx.transaction_date}</p>
                                            </td>

                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-1.5 font-medium text-[#27272A]">
                                                    <User size={14} className="text-[#959595]" />
                                                    <span>{tx.buyer_name}</span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4">
                                                <div className="space-y-0.5">
                                                    {tx.items?.map((item) => (
                                                        <div key={item.id} className="text-[11px] text-[#646467]">
                                                            <span className="font-semibold text-[#27272A]">{item.quantity}x</span>{' '}
                                                            <span>{item.product?.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 text-right font-semibold text-[#27272A]">
                                                {formatRupiah(Number(tx.total_amount))}
                                            </td>

                                            <td className="py-4 px-4 text-right font-semibold text-[#7A9D8C]">
                                                {formatRupiah(Number(tx.total_profit))}
                                            </td>

                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {tx.has_override && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF5EC] text-[#D4B872] border border-[#D4B872]/30">
                                                            Paksa Selesai
                                                        </span>
                                                    )}
                                                    <Link
                                                        href={`/sales/${tx.id}`}
                                                        className="p-1.5 text-[#959595] hover:text-[#27272A] hover:bg-[#F5F5F7] rounded-lg transition-luxury"
                                                        title="Lihat Detail Nota"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Input Penjualan */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E8E8E9] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-[#F0F0F1] flex items-center justify-between">
                            <h3 className="text-base font-semibold text-[#27272A] flex items-center gap-2">
                                <Receipt size={20} className="text-[#E59AA6]" />
                                Catat Penjualan Baru
                            </h3>
                            <button onClick={() => setModalOpen(false)} className="text-[#959595] hover:text-[#27272A]">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handlePreSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium text-[#27272A] mb-1">Nama Pembeli *</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Ibu Jessica"
                                        value={data.buyer_name}
                                        onChange={(e) => setData('buyer_name', e.target.value)}
                                        className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-[#27272A] mb-1">Tanggal Transaksi *</label>
                                    <input
                                        type="date"
                                        value={data.transaction_date}
                                        onChange={(e) => setData('transaction_date', e.target.value)}
                                        className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Dynamic Product Rows */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-[#27272A]">Daftar Item Dibeli</h4>
                                    <button
                                        type="button"
                                        onClick={addRow}
                                        className="text-xs font-medium text-[#E59AA6] hover:text-[#DB8B97] flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Tambah Item
                                    </button>
                                </div>

                                <div className="space-y-2 border border-[#E8E8E9] p-3 rounded-xl bg-[#FAF9FA]">
                                    {rows.map((row, index) => {
                                        const selectedProd = products.find((p) => p.id === Number(row.product_id));
                                        const availableStock = selectedProd ? selectedProd.current_stock : null;

                                        return (
                                            <div key={index} className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-lg border border-[#E8E8E9]">
                                                <div className="col-span-6">
                                                    <select
                                                        value={row.product_id}
                                                        onChange={(e) => updateRow(index, 'product_id', e.target.value)}
                                                        className="w-full text-xs rounded-lg border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                                        required
                                                    >
                                                        <option value="">Pilih Produk (SKU)</option>
                                                        {products.map((p) => (
                                                            <option key={p.id} value={p.id}>
                                                                {p.sku} - {p.name} (Stok: {p.current_stock})
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {availableStock !== null && (
                                                        <span className="text-[10px] text-[#959595] mt-0.5 block">
                                                            Tersedia di gudang: <strong>{availableStock} pcs</strong>
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="col-span-2">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        placeholder="Qty"
                                                        value={row.quantity}
                                                        onChange={(e) => updateRow(index, 'quantity', parseInt(e.target.value) || 1)}
                                                        className="w-full text-xs text-center rounded-lg border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                                        required
                                                    />
                                                </div>

                                                <div className="col-span-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        placeholder="Harga Jual"
                                                        value={row.selling_price}
                                                        onChange={(e) => updateRow(index, 'selling_price', parseFloat(e.target.value) || 0)}
                                                        className="w-full text-xs text-right rounded-lg border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                                        required
                                                    />
                                                </div>

                                                <div className="col-span-1 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRow(index)}
                                                        className="text-[#959595] hover:text-[#D9777F] p-1 rounded"
                                                        disabled={rows.length === 1}
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Summary bar */}
                            <div className="p-3 bg-[#FDF4F5] rounded-xl flex items-center justify-between text-xs font-semibold text-[#B86875]">
                                <span>Total Penjualan:</span>
                                <span className="text-sm">{formatRupiah(totalSaleAmount)}</span>
                            </div>

                            <div>
                                <label className="block font-medium text-[#27272A] mb-1">Catatan Pesanan (Opsional)</label>
                                <textarea
                                    rows={2}
                                    placeholder="Catatan pesanan, kanal penjualan (misal WA / IG), dll..."
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                />
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
                                    disabled={processing || isCheckingStock}
                                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#E59AA6] hover:bg-[#DB8B97] transition-luxury disabled:opacity-50 shadow-xs"
                                >
                                    {isCheckingStock ? 'Memeriksa Stok...' : (processing ? 'Menyimpan...' : 'Simpan Transaksi')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Shortage Warning Modal */}
            <ShortageModal
                isOpen={shortageModalOpen}
                shortages={shortages}
                onCancel={() => setShortageModalOpen(false)}
                onForceComplete={() => executeSubmit(true)}
            />
        </AuthenticatedLayout>
    );
}
