import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatRupiah } from '@/Components/MetricCard';
import { Product, Category } from '@/types/models';
import { 
    Plus, 
    MagnifyingGlass, 
    Funnel, 
    PencilSimple, 
    Trash, 
    X, 
    Image as ImageIcon,
    Tag,
    WarningCircle,
    CheckCircle,
    FolderPlus
} from '@phosphor-icons/react';

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface ProductsIndexProps {
    products: PaginatedProducts;
    categories: Category[];
    filters: {
        search?: string;
        category_id?: string;
        status?: string;
    };
}

export default function ProductsIndex({ products, categories, filters }: ProductsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Modal Tambah Kategori Baru
    const [catModalOpen, setCatModalOpen] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatDesc, setNewCatDesc] = useState('');
    const [catProcessing, setCatProcessing] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        category_id: '',
        sku: '',
        name: '',
        variant_color: '',
        variant_size: '',
        unit: 'pcs',
        cost_price: '',
        selling_price: '',
        min_stock: '5',
        description: '',
        image: null as File | null,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/products', { ...filters, search }, { preserveState: true, replace: true });
    };

    const handleCategoryFilter = (catId: string) => {
        router.get('/products', { ...filters, category_id: catId || undefined }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        reset();
        clearErrors();
        setModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        clearErrors();
        setData({
            category_id: product.category_id.toString(),
            sku: product.sku,
            name: product.name,
            variant_color: product.variant_color || '',
            variant_size: product.variant_size || '',
            unit: product.unit,
            cost_price: product.cost_price.toString(),
            selling_price: product.selling_price.toString(),
            min_stock: product.min_stock.toString(),
            description: product.description || '',
            image: null,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            router.post(`/products/${editingProduct.id}`, {
                _method: 'PUT',
                ...data,
            }, {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/products', {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleCreateCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) return;
        setCatProcessing(true);
        router.post('/categories', {
            name: newCatName,
            description: newCatDesc,
        }, {
            onSuccess: () => {
                setCatModalOpen(false);
                setNewCatName('');
                setNewCatDesc('');
                setCatProcessing(false);
            },
            onError: () => setCatProcessing(false),
        });
    };

    const handleDelete = (product: Product) => {
        if (confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}" (${product.sku})?`)) {
            router.delete(`/products/${product.id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-lg font-semibold text-[#27272A] tracking-tight">Katalog Master SKU</h1>
                    <p className="text-xs text-[#959595]">Febnine Atelier &bull; Manajemen Data Barang & Varian Unik</p>
                </div>
            }
        >
            <Head title="Katalog Produk (SKU) — Febnine Atelier" />

            <div className="space-y-6">
                {/* Action Bar & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Search & Category Filter */}
                    <div className="flex flex-wrap items-center gap-3">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Cari nama, SKU, warna..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-1 focus:ring-[#E59AA6] w-64 text-[#27272A] transition-luxury"
                            />
                            <MagnifyingGlass size={16} className="absolute left-3 top-2.5 text-[#959595]" />
                        </form>

                        <select
                            value={filters.category_id || ''}
                            onChange={(e) => handleCategoryFilter(e.target.value)}
                            className="text-xs py-2 px-3 rounded-xl bg-white border border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-1 focus:ring-[#E59AA6] text-[#27272A] transition-luxury"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCatModalOpen(true)}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-[#27272A] bg-white border border-[#D4D4D8] hover:bg-[#F5F5F7] transition-luxury shadow-xs"
                        >
                            <FolderPlus size={16} className="text-[#959595]" />
                            Tambah Kategori
                        </button>

                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E59AA6] hover:bg-[#DB8B97] transition-luxury shadow-xs"
                        >
                            <Plus size={16} weight="bold" />
                            Tambah Produk Baru
                        </button>
                    </div>
                </div>

                {/* Table View */}
                <div className="bg-white rounded-2xl border border-[#E8E8E9] shadow-diffused overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#FAF9FA] text-[#959595] border-b border-[#F0F0F1] font-medium tracking-wide">
                                <tr>
                                    <th className="py-4 px-6">Info Produk</th>
                                    <th className="py-4 px-4">Kategori & Varian</th>
                                    <th className="py-4 px-4 text-right">HPP (Modal)</th>
                                    <th className="py-4 px-4 text-right">Harga Jual</th>
                                    <th className="py-4 px-4 text-center">Stok Gudang</th>
                                    <th className="py-4 px-6 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F0F1]">
                                {products.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-[#959595]">
                                            Tidak ada produk yang sesuai dengan pencarian Anda.
                                        </td>
                                    </tr>
                                ) : (
                                    products.data.map((product) => {
                                        const stock = product.current_stock ?? 0;
                                        const isLow = stock <= product.min_stock;

                                        return (
                                            <tr key={product.id} className="hover:bg-[#FAF9FA]/60 transition-luxury group">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-lg bg-[#F5F5F7] border border-[#E8E8E9] overflow-hidden flex items-center justify-center shrink-0">
                                                            {product.image_path ? (
                                                                <img src={product.image_path} alt={product.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <ImageIcon size={20} className="text-[#B3B3B3]" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-sm text-[#27272A]">{product.name}</p>
                                                            <p className="text-[11px] font-mono text-[#959595] mt-0.5">{product.sku}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-4">
                                                    <span className="inline-block px-2.5 py-1 rounded-md bg-[#F5F5F7] text-[11px] text-[#646467] font-medium mb-1">
                                                        {product.category?.name || 'Uncategorized'}
                                                    </span>
                                                    {(product.variant_color || product.variant_size) && (
                                                        <p className="text-[11px] text-[#959595]">
                                                            {[product.variant_color, product.variant_size].filter(Boolean).join(' • ')}
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="py-4 px-4 text-right font-medium text-[#959595]">
                                                    {formatRupiah(Number(product.cost_price))}
                                                </td>

                                                <td className="py-4 px-4 text-right font-semibold text-[#27272A]">
                                                    {formatRupiah(Number(product.selling_price))}
                                                </td>

                                                <td className="py-4 px-4 text-center">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        isLow 
                                                            ? 'bg-[#FCF0F1] text-[#D9777F] border border-[#D9777F]/30' 
                                                            : 'bg-[#EFF6F2] text-[#436453] border border-[#7A9D8C]/30'
                                                    }`}>
                                                        {isLow && <WarningCircle size={14} />}
                                                        {stock} {product.unit}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-luxury">
                                                        <button
                                                            onClick={() => openEditModal(product)}
                                                            className="p-1.5 text-[#959595] hover:text-[#27272A] hover:bg-[#F5F5F7] rounded-lg transition-luxury"
                                                            title="Edit Produk"
                                                        >
                                                            <PencilSimple size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product)}
                                                            className="p-1.5 text-[#959595] hover:text-[#D9777F] hover:bg-[#FCF0F1] rounded-lg transition-luxury"
                                                            title="Hapus Produk"
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {products.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-[#F0F0F1] flex items-center justify-between text-xs text-[#959595]">
                            <span>Total {products.total} produk</span>
                            <div className="flex gap-1">
                                {products.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg border ${
                                            link.active 
                                                ? 'bg-[#E59AA6] text-white border-[#E59AA6] font-semibold' 
                                                : 'bg-white border-[#E8E8E9] text-[#646467] hover:bg-[#F5F5F7]'
                                        } ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Tambah Kategori */}
            {catModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-sm w-full border border-[#E8E8E9] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-[#F0F0F1] flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-[#27272A] flex items-center gap-2">
                                <FolderPlus size={18} className="text-[#E59AA6]" />
                                Tambah Kategori Baru
                            </h3>
                            <button onClick={() => setCatModalOpen(false)} className="text-[#959595] hover:text-[#27272A]">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCategory} className="p-5 space-y-3 text-xs">
                            <div>
                                <label className="block font-medium text-[#27272A] mb-1">Nama Kategori *</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Aksesoris & Bros"
                                    value={newCatName}
                                    onChange={(e) => setNewCatName(e.target.value)}
                                    className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-[#27272A] mb-1">Deskripsi Singkat (Opsional)</label>
                                <textarea
                                    rows={2}
                                    placeholder="Keterangan kategori..."
                                    value={newCatDesc}
                                    onChange={(e) => setNewCatDesc(e.target.value)}
                                    className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                />
                            </div>

                            <div className="pt-3 border-t border-[#F0F0F1] flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCatModalOpen(false)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#27272A] bg-[#F5F5F7] hover:bg-[#E8E8E9] transition-luxury"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={catProcessing}
                                    className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#E59AA6] hover:bg-[#DB8B97] transition-luxury disabled:opacity-50 shadow-xs"
                                >
                                    {catProcessing ? 'Menyimpan...' : 'Simpan Kategori'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Tambah / Edit Produk */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-xl w-full border border-[#E8E8E9] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-[#F0F0F1] flex items-center justify-between">
                            <h3 className="text-base font-semibold text-[#27272A]">
                                {editingProduct ? 'Edit Data Produk' : 'Tambah Produk Baru'}
                            </h3>
                            <button onClick={() => setModalOpen(false)} className="text-[#959595] hover:text-[#27272A]">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="font-medium text-[#27272A]">Kategori *</label>
                                        <button
                                            type="button"
                                            onClick={() => setCatModalOpen(true)}
                                            className="text-[11px] font-medium text-[#E59AA6] hover:text-[#DB8B97]"
                                        >
                                            + Baru
                                        </button>
                                    </div>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-[#D9777F] mt-1">{errors.category_id}</p>}
                                </div>

                                <div>
                                    <label className="block font-medium text-[#27272A] mb-1">SKU Unik Varian *</label>
                                    <input
                                        type="text"
                                        placeholder="FA-DRS-01-S"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value.toUpperCase())}
                                        className="w-full text-xs font-mono rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                        required
                                    />
                                    {errors.sku && <p className="text-[#D9777F] mt-1">{errors.sku}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium text-[#27272A] mb-1">Nama Produk *</label>
                                <input
                                    type="text"
                                    placeholder="Luna Silk Tiered Dress"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                    required
                                />
                                {errors.name && <p className="text-[#D9777F] mt-1">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block font-medium text-[#27272A] mb-1">Warna Varian</label>
                                    <input
                                        type="text"
                                        placeholder="Signature Rose"
                                        value={data.variant_color}
                                        onChange={(e) => setData('variant_color', e.target.value)}
                                        className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-[#27272A] mb-1">Ukuran Varian</label>
                                    <input
                                        type="text"
                                        placeholder="S / M / All Size"
                                        value={data.variant_size}
                                        onChange={(e) => setData('variant_size', e.target.value)}
                                        className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-[#27272A] mb-1">Satuan</label>
                                    <input
                                        type="text"
                                        value={data.unit}
                                        onChange={(e) => setData('unit', e.target.value)}
                                        className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block font-medium text-[#27272A] mb-1">HPP / Modal (Rp) *</label>
                                    <input
                                        type="number"
                                        placeholder="285000"
                                        value={data.cost_price}
                                        onChange={(e) => setData('cost_price', e.target.value)}
                                        className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-[#27272A] mb-1">Harga Jual (Rp) *</label>
                                    <input
                                        type="number"
                                        placeholder="549000"
                                        value={data.selling_price}
                                        onChange={(e) => setData('selling_price', e.target.value)}
                                        className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-[#27272A] mb-1">Batas Minimal Stok *</label>
                                    <input
                                        type="number"
                                        value={data.min_stock}
                                        onChange={(e) => setData('min_stock', e.target.value)}
                                        className="w-full text-xs rounded-xl border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-[#E59AA6]"
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium text-[#27272A] mb-1">Foto Produk (Maks 10MB)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                    className="w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#F5F5F7] file:text-[#27272A] file:font-medium file:cursor-pointer text-[#959595]"
                                />
                                {errors.image && <p className="text-[#D9777F] mt-1">{errors.image}</p>}
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
                                    {processing ? 'Menyimpan...' : (editingProduct ? 'Perbarui Produk' : 'Simpan Produk')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
