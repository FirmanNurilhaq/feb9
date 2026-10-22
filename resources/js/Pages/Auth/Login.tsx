import React, { FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { LockKey, Envelope, ArrowRight, Sparkle } from '@phosphor-icons/react';

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'admin@febnine.com',
        password: 'password',
        remember: true as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-[#FCFCFC] flex flex-col justify-center relative overflow-hidden font-sans">
            {/* Subtle luxury geometric background accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F7DDE2]/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#EFF6F2]/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

            <Head title="Masuk — Febnine Atelier Dashboard" />

            <div className="max-w-md w-full mx-auto px-6 py-12 relative z-10">
                {/* Brand Logo & Editorial Header */}
                <div className="text-left mb-8">
                    <img 
                        src="/images/logo_clean.png" 
                        alt="Febnine Atelier" 
                        className="h-20 w-auto object-contain mb-6"
                    />
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF4F5] border border-[#E59AA6]/30 text-[#B86875] text-xs font-semibold mb-3">
                        <Sparkle size={14} weight="fill" />
                        Gudang & Inventori Terpusat
                    </div>
                    <h1 className="text-2xl font-bold text-[#27272A] tracking-tight">
                        Selamat Datang Kembali
                    </h1>
                    <p className="mt-1 text-xs text-[#959595] leading-relaxed">
                        Silakan masukkan kredensial otoritas tunggal untuk mengakses manajemen stok dan data penjualan Febnine Atelier.
                    </p>
                </div>

                {status && (
                    <div className="mb-4 p-3 rounded-xl bg-[#EFF6F2] border border-[#7A9D8C]/30 text-[#436453] text-xs font-medium">
                        {status}
                    </div>
                )}

                {/* Login Form Card */}
                <div className="bg-white p-8 rounded-2xl border border-[#E8E8E9] shadow-diffused">
                    <form onSubmit={submit} className="space-y-5 text-xs">
                        <div>
                            <label className="block font-medium text-[#27272A] mb-1.5">Alamat Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="admin@febnine.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-1 focus:ring-[#E59AA6] transition-luxury"
                                    required
                                    autoFocus
                                />
                                <Envelope size={16} className="absolute left-3 top-3 text-[#959595]" />
                            </div>
                            {errors.email && <p className="text-[#D9777F] mt-1.5 text-[11px]">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block font-medium text-[#27272A] mb-1.5">Kata Sandi</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border border-[#E8E8E9] focus:border-[#E59AA6] focus:ring-1 focus:ring-[#E59AA6] transition-luxury"
                                    required
                                />
                                <LockKey size={16} className="absolute left-3 top-3 text-[#959595]" />
                            </div>
                            {errors.password && <p className="text-[#D9777F] mt-1.5 text-[11px]">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-[#E8E8E9] text-[#E59AA6] focus:ring-[#E59AA6]"
                                />
                                <span className="text-[#959595] text-[11px]">Ingat sesi login</span>
                            </label>
                            <span className="text-[11px] text-[#959595]">Otorisasi Tunggal</span>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-[#E59AA6] hover:bg-[#DB8B97] transition-luxury disabled:opacity-50 shadow-xs"
                        >
                            <span>{processing ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
                            <ArrowRight size={16} />
                        </button>
                    </form>
                </div>

                {/* Footer copyright */}
                <div className="text-center mt-8 text-[11px] text-[#B3B3B3]">
                    <p>&copy; {new Date().getFullYear()} Febnine Atelier. Seluruh hak cipta dilindungi.</p>
                </div>
            </div>
        </div>
    );
}
