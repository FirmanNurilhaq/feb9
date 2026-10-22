import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatRupiah } from '@/Components/MetricCard';
import { InboundShipment, Product } from '@/types/models';
import { 
    Plus, 
    MagnifyingGlass, 
    ArrowDownLeft, 
    Trash, 
    X, 
    CalendarBlank,
    Buildings,
    Package
} from '@phosphor-icons/react';

interface PaginatedShipments {
    data: InboundShipment[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface InboundIndexProps {
    shipments: PaginatedShipments;
    products: Product[];
    filters: { search?: string };
}

interface InboundRow {
    product_id: string;
    quantity: number;
    purchase_price: number;
    update_cost_price: boolean;
}

export default function InboundIndex({ shipments, products, filters }: InboundIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [modalOpen, setModalOpen] = useState(false);

    const [rows, setRows] = useState<InboundRow[]>([
        { product_id: '', quantity: 1, purchase_price: 0, update_cost_price: false },
    ]);

    const { data, setData, post, processing, errors, reset } = useForm({
        shipment_number: '',
        supplier_name: '',
        inbound_date: new Date().toISOString().split('T')[0],
        notes: '',
        items: [] as any[],
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/inbound', { search }, { preserveState: true, replace: true });
    };

    const addRow = () => {
        setRows([...rows, { product_id: '', quantity: 1, purchase_price: 0, update_cost_price: false }]);
    };

    const removeRow = (index: number) => {
        if (rows.length === 1) return;
        setRows(rows.filter((_, i) => i !== index));
    };

    const updateRow = (index: number, field: keyof InboundRow, value: any) => {
        const updated = [...rows];
        updated[index] = { ...updated[index], [field]: value };

        // If product selected, auto-fill default purchase price from product cost_price
        if (field === 'product_id') {
            const prod = products.find((p) => p.id === Number(value));
            if (prod) {
                updated[index].purchase_price = Number(prod.cost_price);
            }
        }

        setRows(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validRows = rows.filter((r) => r.product_id && r.quantity > 0);
        if (validRows.length === 0) {
            alert('Silakan pilih minimal 1 produk dan masukkan jumlah barang masuk.');
            return;
        }

        router.post('/inbound', {
            ...data,
            items: validRows as any,
        }, {
            onSuccess: () => {
                setModalOpen(false);
                reset();
                setRows([{ product_id: '', quantity: 1, purchase_price: 0, update_cost_price: false }]);
            },
        });
    };

    const totalBatchCost = rows.reduce((acc, r) => acc + (r.quantity * (r.purchase_price || 0)), 0);

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-lg font-semibold text-[#27272A] tracking-tight">Barang Masuk (Inbound)</h1>
                    <p className="text-xs text-[#959595]">Febnine Atelier &bull; Pencatatan Penerimaan Stok dari Konveksi / Supplier</p>
                </div>
            }
        >
            <Head title="Barang Masuk (Inbound) — Febnine Atelier" />

            <div className="space-y-6">
                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <form onSubmit={handleSearch} className="relative w-64">
                        <input
                            type="text"
                            placeholder="Cari nomor surat / supplier..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-1 focus:ring-[#E59AA6] text-[#27272A] transition-luxury"
                        />
                        <MagnifyingGlass size={16} className="absolute left-3 top-2.5 text-[#959595]" />
                    </form>

                    <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#7A9D8C] hover:bg-[#688A79] transition-luxury shadow-xs"
                    >
                        <Plus size={16} weight="bold" />
                        Catat Penerimaan Stok
                    </button>
                </div>

                {/* Table View */}
                <div className="bg-white rounded-2xl border border-[#E8E8E9] shadow-diffused overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#FAF9FA] text-[#959595] border-b border-[#F0F0F1] font-medium tracking-wide">
                                <tr>
                                    <th className="py-4 px-6">No. Penerimaan</th>
                                    <th className="py-4 px-4">Tanggal Terima</th>
                                    <th className="py-4 px-4">Supplier / Konveksi</th>
                                    <th className="py-4 px-4">Detail Barang</th>
                                    <th className="py-4 px-6 text-right">Total Nilai Pembelian</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F0F1]">
                                {shipments.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-[#959595]">
                                            Belum ada data barang masuk.
                                        </td>
                                    </tr>
                                ) : (
                                    shipments.data.map((shipment) => {
                                        const totalValue = shipment.items?.reduce((sum, item) => sum + Number(item.subtotal), 0) || 0;
                                        const totalQty = shipment.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

                                        return (
                                            <tr key={shipment.id} className="hover:bg-[#FAF9FA]/60 transition-luxury">
                                                <td className="py-4 px-6 font-semibold text-[#27272A] font-mono">
                                                    {shipment.shipment_number}
                                                </td>

                                                <td className="py-4 px-4 text-[#646467]">
                                                    {shipment.inbound_date}
                                                </td>

                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-1.5 text-[#27272A] font-medium">
                                                        <Buildings size={14} className="text-[#959595]" />
                                                        <span>{shipment.supplier_name || 'Vendor Konveksi'}</span>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-4">
                                                    <div className="space-y-1">
                                                        {shipment.items?.slice(0, 3).map((item) => (
                                                            <div key={item.id} className="text-[11px] text-[#646467] flex items-center gap-1.5">
                                                                <span className="font-semibold text-[#27272A]">+{item.quantity} pcs</span>
                                                                <span className="text-[#959595] truncate max-w-[180px]">{item.product?.name}</span>
                                                            </div>
                                                        ))}
                                                        {shipment.items && shipment.items.length > 3 && (
                                                            <span className="text-[10px] text-[#959595] italic">
                                                                +{shipment.items.length - 3} item lainnya ({totalQty} total pcs)
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="py-4 px-6 text-right font-semibold text-[#27272A]">
                                                    {formatRupiah(totalValue)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Catat Barang Masuk */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E8E8E9] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-[#F0F0F1] flex items-center justify-between">
                            <h3 className="text-base font-semibold text-[#27272A] flex items-center gap-2">
                                <ArrowDownLeft size={20} className="text-[#7A9D8C]" />
                                Catat Penerimaan Barang Masuk (Inbound)
                            </h3>
                            <button onClick={() => setModalOpen(false)} className="text-[#959595] hover:text-[#27272A]">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium text-[#27272A] mb-1">Supplier / Konveksi</label>
                                    <input
                                        type="text"
                                        placeholder="Nama vendor konveksi"
                                        value={data.supplier_name}
                                        onChange={(e) => setData('supplier_name', e.target.value)}
                                        className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#7A9D8C] focus:ring-[#7A9D8C]"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-[#27272A] mb-1">Tanggal Terima *</label>
                                    <input
                                        type="date"
                                        value={data.inbound_date}
                                        onChange={(e) => setData('inbound_date', e.target.value)}
                                        className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#7A9D8C] focus:ring-[#7A9D8C]"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Dynamic Items */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-[#27272A]">Daftar Barang Masuk</h4>
                                    <button
                                        type="button"
                                        onClick={addRow}
                                        className="text-xs font-medium text-[#7A9D8C] hover:text-[#688A79] flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Tambah Baris
                                    </button>
                                </div>

                                <div className="space-y-2 border border-[#E8E8E9] p-3 rounded-xl bg-[#FAF9FA]">
                                    {rows.map((row, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-lg border border-[#E8E8E9]">
                                            <div className="col-span-6">
                                                <select
                                                    value={row.product_id}
                                                    onChange={(e) => updateRow(index, 'product_id', e.target.value)}
                                                    className="w-full text-xs rounded-lg border-[#E8E8E9] focus:border-[#7A9D8C] focus:ring-[#7A9D8C]"
                                                    required
                                                >
                                                    <option value="">Pilih Produk (SKU)</option>
                                                    {products.map((p) => (
                                                        <option key={p.id} value={p.id}>
                                                            {p.sku} - {p.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-span-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    placeholder="Qty"
                                                    value={row.quantity}
                                                    onChange={(e) => updateRow(index, 'quantity', parseInt(e.target.value) || 1)}
                                                    className="w-full text-xs text-center rounded-lg border-[#E8E8E9] focus:border-[#7A9D8C] focus:ring-[#7A9D8C]"
                                                    required
                                                />
                                            </div>

                                            <div className="col-span-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="Harga Beli"
                                                    value={row.purchase_price}
                                                    onChange={(e) => updateRow(index, 'purchase_price', parseFloat(e.target.value) || 0)}
                                                    className="w-full text-xs text-right rounded-lg border-[#E8E8E9] focus:border-[#7A9D8C] focus:ring-[#7A9D8C]"
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
                                    ))}
                                </div>
                            </div>

                            {/* Summary bar */}
                            <div className="p-3 bg-[#EFF6F2] rounded-xl flex items-center justify-between text-xs font-semibold text-[#436453]">
                                <span>Total Valuasi Pembelian:</span>
                                <span className="text-sm">{formatRupiah(totalBatchCost)}</span>
                            </div>

                            <div>
                                <label className="block font-medium text-[#27272A] mb-1">Catatan Tambahan (Opsional)</label>
                                <textarea
                                    rows={2}
                                    placeholder="Nomor batch produksi atau catatan kondisi kiriman..."
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#7A9D8C] focus:ring-[#7A9D8C]"
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
                                    disabled={processing}
                                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#7A9D8C] hover:bg-[#688A79] transition-luxury disabled:opacity-50 shadow-xs"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Barang Masuk'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
