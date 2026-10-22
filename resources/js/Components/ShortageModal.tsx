import React from 'react';
import { WarningCircle, ArrowCounterClockwise, Check } from '@phosphor-icons/react';

export interface ShortageItem {
    product_id: number;
    sku: string;
    name: string;
    current_stock: number;
    requested_qty: number;
    difference: number;
}

interface ShortageModalProps {
    isOpen: boolean;
    shortages: ShortageItem[];
    onCancel: () => void;
    onForceComplete: () => void;
}

export default function ShortageModal({
    isOpen,
    shortages,
    onCancel,
    onForceComplete,
}: ShortageModalProps) {
    if (!isOpen || shortages.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs transition-luxury">
            <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E8E8E9] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-[#F0F0F1] flex items-start gap-4">
                    <div className="p-3 rounded-full bg-[#FCF0F1] text-[#D9777F] shrink-0">
                        <WarningCircle size={26} weight="regular" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-[#27272A]">
                            Peringatan: Stok Fisik Tidak Mencukupi
                        </h3>
                        <p className="mt-1 text-xs text-[#959595] leading-relaxed">
                            Sistem mendeteksi transaksi penjualan ini meminta jumlah barang yang melebihi catatan stok gudang saat ini.
                        </p>
                    </div>
                </div>

                {/* Shortage Items List */}
                <div className="p-6 max-h-60 overflow-y-auto">
                    <div className="border border-[#E8E8E9] rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#F5F5F7] text-[#959595] font-medium border-b border-[#E8E8E9]">
                                <tr>
                                    <th className="px-3.5 py-2.5">Produk / SKU</th>
                                    <th className="px-3 py-2.5 text-center">Stok Ada</th>
                                    <th className="px-3 py-2.5 text-center">Diminta</th>
                                    <th className="px-3 py-2.5 text-right text-[#D9777F]">Kurang</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F0F1]">
                                {shortages.map((item) => (
                                    <tr key={item.product_id} className="hover:bg-[#FDF4F5]/30">
                                        <td className="px-3.5 py-2.5">
                                            <p className="font-semibold text-[#27272A]">{item.name}</p>
                                            <p className="text-[11px] text-[#959595] font-mono">{item.sku}</p>
                                        </td>
                                        <td className="px-3 py-2.5 text-center font-medium text-[#646467]">
                                            {item.current_stock} pcs
                                        </td>
                                        <td className="px-3 py-2.5 text-center font-semibold text-[#27272A]">
                                            {item.requested_qty} pcs
                                        </td>
                                        <td className="px-3 py-2.5 text-right font-semibold text-[#D9777F]">
                                            -{item.difference} pcs
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-3 text-[11px] text-[#959595]">
                        * Jika memilih <strong>Paksa Selesai</strong>, transaksi tetap dicatat dan stok gudang akan bernilai negatif hingga dicatat barang masuk (inbound) berikutnya.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-[#F5F5F7] border-t border-[#E8E8E9] flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium text-[#27272A] bg-white border border-[#D4D4D8] hover:bg-[#F0F0F1] transition-luxury"
                    >
                        <ArrowCounterClockwise size={16} />
                        Perbaiki Stok Dulu
                    </button>
                    <button
                        type="button"
                        onClick={onForceComplete}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#D9777F] hover:bg-[#C2626B] transition-luxury shadow-xs"
                    >
                        <Check size={16} />
                        Paksa Selesai
                    </button>
                </div>
            </div>
        </div>
    );
}
