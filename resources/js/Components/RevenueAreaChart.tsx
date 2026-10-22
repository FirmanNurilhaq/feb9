import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { formatRupiah } from './MetricCard';

interface ChartPoint {
    label: string;
    revenue: number;
    profit: number;
}

interface RevenueAreaChartProps {
    data: ChartPoint[];
}

export default function RevenueAreaChart({ data }: RevenueAreaChartProps) {
    return (
        <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        {/* Gradient for Revenue (Signature Rose) */}
                        <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#E59AA6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#E59AA6" stopOpacity={0.0} />
                        </linearGradient>
                        {/* Gradient for Profit (Sage Green) */}
                        <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7A9D8C" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#7A9D8C" stopOpacity={0.0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="#F0F0F1" 
                        vertical={false} 
                    />

                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#959595', fontSize: 12, fontFamily: 'Poppins' }}
                        dy={8}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#959595', fontSize: 11, fontFamily: 'Poppins' }}
                        tickFormatter={(value) => {
                            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}jt`;
                            if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`;
                            return `${value}`;
                        }}
                        dx={-8}
                    />

                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-[#E8E8E9] shadow-diffused text-xs font-sans">
                                        <p className="font-semibold text-[#27272A] mb-1.5">{label}</p>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="flex items-center gap-1.5 text-[#959595]">
                                                    <span className="w-2 h-2 rounded-full bg-[#E59AA6]" />
                                                    Pendapatan:
                                                </span>
                                                <span className="font-medium text-[#27272A]">
                                                    {formatRupiah(Number(payload[0]?.value || 0))}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="flex items-center gap-1.5 text-[#959595]">
                                                    <span className="w-2 h-2 rounded-full bg-[#7A9D8C]" />
                                                    Laba Bersih:
                                                </span>
                                                <span className="font-medium text-[#436453]">
                                                    {formatRupiah(Number(payload[1]?.value || 0))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />

                    <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Pendapatan"
                        stroke="#E59AA6"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#roseGradient)"
                    />

                    <Area
                        type="monotone"
                        dataKey="profit"
                        name="Laba Bersih"
                        stroke="#7A9D8C"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#profitGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
