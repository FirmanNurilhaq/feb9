import React from 'react';
import { Icon as PhosphorIcon } from '@phosphor-icons/react';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: PhosphorIcon;
    iconColor?: string;
    iconBg?: string;
}

export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);
}

export default function MetricCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor = 'text-[#E59AA6]',
    iconBg = 'bg-[#FDF4F5]',
}: MetricCardProps) {
    return (
        <div className="bg-white p-5 rounded-xl border border-[#E8E8E9] shadow-diffused transition-luxury hover:border-[#D4D4D8] hover:shadow-card-soft">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#959595]">{title}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-[#27272A] tracking-tight">
                        {typeof value === 'number' ? formatRupiah(value) : value}
                    </h3>
                    {subtitle && (
                        <p className="mt-1 text-xs text-[#959595]">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${iconBg} ${iconColor} shrink-0`}>
                    <Icon size={22} weight="regular" />
                </div>
            </div>
        </div>
    );
}
