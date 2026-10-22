import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { StockOpname, Product } from '@/types/models';
import { 
    Plus, 
    ClipboardText, 
    Trash, 
    X, 
    CheckCircle,
    WarningCircle,
    ArrowsLeftRight
} from '@phosphor-icons/react';

interface PaginatedOpnames {
    data: StockOpname[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface OpnameIndexProps {
    opnames: PaginatedOpnames;
    products: Array<Product & { current_stock: number }>;
}

interface OpnameRow {
    product_id: string;
    physical_stock: number;
    reason: string;
    notes?: string;
}

const REASONS = [
    'Cacat/Noda saat Display Showroom',
    'Sample Pemotretan / Endorsement',
    'Hilang / Selisih Hitung Gudang',
    'Kerusakan Kemasan / Packing',
    'Penyesuaian Fisik Berkala',
];

export default function OpnameIndex({ opnames, products }: OpnameIndexProps) {
    const [modalOpen, setModalOpen] = useState(false);

    const [rows, setRows] = useState<OpnameRow[]>([
        { product_id: '', physical_stock: 0, reason: REASONS[0], notes: '' },
    ]);

    const { data, setData, post, processing, errors, reset } = useForm({
        opname_date: new Date().toISOString().split('T')[0],
        notes: '',
        items: [] as any[],
    });

    const addRow = () => {
        setRows([...rows, { product_id: '', physical_stock: 0, reason: REASONS[0], notes: '' }]);
    };

    const removeRow = (index: number) => {
        if (rows.length === 1) return;
        setRows(rows.filter((_, i) => i !== index));
    };

    const updateRow = (index: number, field: keyof OpnameRow, value: any) => {
        const updated = [...rows];
        updated[index] = { ...updated[index], [field]: value };

        // If product selected, auto-fill default physical stock to match current system stock
        if (field === 'product_id') {
            const prod = products.find((p) => p.id === Number(value));
            if (prod) {
                updated[index].physical_stock = prod.current_stock;
            }
        }

        setRows(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validRows = rows.filter((r) => r.product_id);
        if (validRows.length === 0) {
            alert('Silakan pilih minimal 1 produk untuk disesuaikan.');
            return;
        }

        router.post('/opname', {
            ...data,
            items: validRows as any,
        }, {
            onSuccess: () => {
                setModalOpen(false);
                reset();
                setRows([{ product_id: '', physical_stock: 0, reason: REASONS[0], notes: '' }]);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-lg font-semibold text-[#27272A] tracking-tight">Stock Opname Gudang</h1>
                    <p className="text-xs text-[#959595]">Febnine Atelier &bull; Penyesuaian Catatan Database vs Hitungan Fisik Rak</p>
                </div>
            }
        >
            <Head title="Stock Opname — Febnine Atelier" />

            <div className="space-y-6">
                {/* Action Bar */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-[#959595]">
                            Catatan penyesuaian stok fisik otomatis memperbarui saldo di tabel ledger mutasi.
                        </p>
                    </div>

                    <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#D4B872] hover:bg-[#C2A660] transition-luxury shadow-xs"
                    >
                        <Plus size={16} weight="bold" />
                        Input Stock Opname Baru
                    </button>
                </div>

                {/* Table View */}
                <div className="bg-white rounded-2xl border border-[#E8E8E9] shadow-diffused overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#FAF9FA] text-[#959595] border-b border-[#F0F0F1] font-medium tracking-wide">
                                <tr>
                                    <th className="py-4 px-6">No. Opname & Tanggal</th>
                                    <th className="py-4 px-4">Item Disesuaikan</th>
                                    <th className="py-4 px-4 text-center">Fisik vs Sistem</th>
                                    <th className="py-4 px-4">Alasan Penyesuaian</th>
                                    <th className="py-4 px-6">Catatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F0F1]">
                                {opnames.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-[#959595]">
                                            Belum ada riwayat stock opname.
                                        </td>
                                    </tr>
                                ) : (
                                    opnames.data.map((opname) => (
                                        <tr key={opname.id} className="hover:bg-[#FAF9FA]/60 transition-luxury">
                                            <td className="py-4 px-6">
                                                <p className="font-semibold text-[#27272A] font-mono">{opname.opname_number}</p>
                                                <p className="text-[11px] text-[#959595]">{opname.opname_date}</p>
                                            </td>

                                            <td className="py-4 px-4">
                                                <div className="space-y-1">
                                                    {opname.items?.map((item) => (
                                                        <div key={item.id} className="text-xs">
                                                            <span className="font-medium text-[#27272A]">{item.product?.name}</span>
                                                            <span className="text-[11px] text-[#959595] font-mono ml-1.5">({item.product?.sku})</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 text-center">
                                                <div className="space-y-1">
                                                    {opname.items?.map((item) => {
                                                        const diff = item.difference;
                                                        return (
                                                            <div key={item.id} className="flex items-center justify-center gap-1.5 font-medium">
                                                                <span className="text-[#646467]">{item.physical_stock} fisik</span>
                                                                <span className="text-[#B3B3B3]">/</span>
                                                                <span className="text-[#959595]">{item.system_stock} sistem</span>
                                                                <span className={`font-semibold ml-1 px-1.5 py-0.2 rounded text-[11px] ${
                                                                    diff > 0 ? 'text-[#7A9D8C] bg-[#EFF6F2]' : (diff < 0 ? 'text-[#D9777F] bg-[#FCF0F1]' : 'text-[#959595]')
                                                                }`}>
                                                                    ({diff > 0 ? `+${diff}` : diff})
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </td>

                                            <td className="py-4 px-4">
                                                <div className="space-y-1">
                                                    {opname.items?.map((item) => (
                                                        <span key={item.id} className="block text-[#27272A] font-medium">
                                                            {item.reason || '-'}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 text-[#959595] italic">
                                                {opname.notes || '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Input Stock Opname */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E8E8E9] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-[#F0F0F1] flex items-center justify-between">
                            <h3 className="text-base font-semibold text-[#27272A] flex items-center gap-2">
                                <ClipboardText size={20} className="text-[#D4B872]" />
                                Input Stock Opname Baru
                            </h3>
                            <button onClick={() => setModalOpen(false)} className="text-[#959595] hover:text-[#27272A]">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium text-[#27272A] mb-1">Tanggal Opname *</label>
                                    <input
                                        type="date"
                                        value={data.opname_date}
                                        onChange={(e) => setData('opname_date', e.target.value)}
                                        className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#D4B872] focus:ring-[#D4B872]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-[#27272A] mb-1">Catatan Opname</label>
                                    <input
                                        type="text"
                                        placeholder="Misal: Opname mingguan rak display"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#D4B872] focus:ring-[#D4B872]"
                                    />
                                </div>
                            </div>

                            {/* Item Rows */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-[#27272A]">Daftar Item Penyesuaian</h4>
                                    <button
                                        type="button"
                                        onClick={addRow}
                                        className="text-xs font-medium text-[#D4B872] hover:text-[#C2A660] flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Tambah Item
                                    </button>
                                </div>

                                <div className="space-y-3 border border-[#E8E8E9] p-3 rounded-xl bg-[#FAF9FA]">
                                    {rows.map((row, index) => {
                                        const prod = products.find((p) => p.id === Number(row.product_id));
                                        const sysStock = prod ? prod.current_stock : 0;
                                        const diff = row.physical_stock - sysStock;

                                        return (
                                            <div key={index} className="bg-white p-3 rounded-lg border border-[#E8E8E9] space-y-2">
                                                <div className="grid grid-cols-12 gap-2 items-center">
                                                    <div className="col-span-7">
                                                        <select
                                                            value={row.product_id}
                                                            onChange={(e) => updateRow(index, 'product_id', e.target.value)}
                                                            className="w-full text-xs rounded-lg border-[#E8E8E9] focus:border-[#D4B872] focus:ring-[#D4B872]"
                                                            required
                                                        >
                                                            <option value="">Pilih Produk (SKU)</option>
                                                            {products.map((p) => (
                                                                <option key={p.id} value={p.id}>
                                                                    {p.sku} - {p.name} (Sistem: {p.current_stock} pcs)
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="col-span-4 flex items-center gap-2">
                                                        <div className="w-1/2">
                                                            <span className="text-[10px] text-[#959595] block mb-0.5">Fisik Nyata</span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={row.physical_stock}
                                                                onChange={(e) => updateRow(index, 'physical_stock', parseInt(e.target.value) || 0)}
                                                                className="w-full text-xs text-center rounded-lg border-[#E8E8E9] focus:border-[#D4B872] focus:ring-[#D4B872]"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="w-1/2 text-center">
                                                            <span className="text-[10px] text-[#959595] block mb-0.5">Selisih</span>
                                                            <span className={`font-bold text-xs ${
                                                                diff > 0 ? 'text-[#7A9D8C]' : (diff < 0 ? 'text-[#D9777F]' : 'text-[#959595]')
                                                            }`}>
                                                                {diff > 0 ? `+${diff}` : diff}
                                                            </span>
                                                        </div>
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

                                                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F5F5F7]">
                                                    <div>
                                                        <label className="text-[10px] text-[#959595] block mb-0.5">Alasan Penyesuaian</label>
                                                        <select
                                                            value={row.reason}
                                                            onChange={(e) => updateRow(index, 'reason', e.target.value)}
                                                            className="w-full text-[11px] rounded-lg border-[#E8E8E9] focus:border-[#D4B872] focus:ring-[#D4B872]"
                                                        >
                                                            {REASONS.map((r) => (
                                                                <option key={r} value={r}>{r}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-[#959595] block mb-0.5">Keterangan Item</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Misal: noda di bagian kerah"
                                                            value={row.notes || ''}
                                                            onChange={(e) => updateRow(index, 'notes', e.target.value)}
                                                            className="w-full text-[11px] rounded-lg border-[#E8E8E9] focus:border-[#D4B872] focus:ring-[#D4B872]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
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
                                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#D4B872] hover:bg-[#C2A660] transition-luxury disabled:opacity-50 shadow-xs"
                                >
                                    {processing ? 'Menyimpan...' : 'Sinkronkan Stok Opname'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
