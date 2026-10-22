import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

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
        <div className="min-h-screen bg-[#F8F8FA] flex flex-col justify-center relative overflow-hidden font-sans text-[#27272A] selection:bg-[#F7DDE2] selection:text-[#B86875]">
            {/* Latar Belakang Gradasi Radial Dusty Pink Lembut Khas Studio Feb Nine */}
            <div
                className="absolute top-0 right-0 w-[520px] h-[520px] bg-[#F7DDE2]/45 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"
                aria-hidden="true"
            />
            <div
                className="absolute bottom-0 left-0 w-[520px] h-[520px] bg-[#E8E8E9]/70 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32"
                aria-hidden="true"
            />

            <Head title="Masuk Portal Otoritas — Febnine Atelier" />

            <div className="max-w-md w-full mx-auto px-6 py-12 relative z-10">
                {/* Header Brand Febnine Atelier */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block group mb-4">
                        <img
                            src="/images/logo_clean.png"
                            alt="Febnine Atelier"
                            className="h-16 w-auto mx-auto object-contain transition-transform group-hover:scale-105"
                        />
                    </Link>

                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF4F5] border border-[#F7DDE2] text-[#B86875] text-[11px] font-medium uppercase tracking-widest mb-3">
                        <span className="w-2 h-2 rounded-full bg-[#D86B81]"></span>
                        Portal Otoritas Tunggal Gudang
                    </div>

                    <h1 className="font-serif text-3xl font-normal text-[#27272A] tracking-tight">
                        Febnine Atelier
                    </h1>
                    <p className="mt-2 text-xs text-[#71717A] font-light leading-relaxed max-w-xs mx-auto">
                        Akses sistem manajemen inventori, pergerakan stok SKU, dan pemantauan penjualan terpusat.
                    </p>
                </div>

                {status && (
                    <div className="mb-4 p-3.5 bg-[#FDF4F5] border border-[#F7DDE2] text-[#B86875] text-xs font-medium rounded-sm">
                        {status}
                    </div>
                )}

                {/* Kartu Form Login dengan Nuansa Abu Muda & Dusty Pink */}
                <div className="bg-white p-8 sm:p-10 border border-[#E8E8E9] shadow-xl relative rounded-sm">
                    <form onSubmit={submit} className="space-y-6 text-xs">
                        <div>
                            <label
                                htmlFor="email"
                                className="block uppercase tracking-widest text-[10px] font-medium text-[#52525B] mb-2"
                            >
                                Alamat Email Otoritas
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="admin@febnine.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 text-xs bg-[#F8F8FA] border border-[#E8E8E9] text-[#27272A] placeholder-[#A1A1AA] focus:bg-white focus:border-[#D86B81] focus:ring-1 focus:ring-[#D86B81] focus:outline-none transition-colors"
                                    required
                                    autoFocus
                                />
                                <div className="absolute left-3.5 top-3.5 text-[#A1A1AA] pointer-events-none flex items-center">
                                    <iconify-icon
                                        icon="solar:user-linear"
                                        width="16"
                                        height="16"
                                        style={{ strokeWidth: '1.5' }}
                                    ></iconify-icon>
                                </div>
                            </div>
                            {errors.email && (
                                <p className="text-[#D9777F] mt-1.5 text-[11px]">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block uppercase tracking-widest text-[10px] font-medium text-[#52525B] mb-2"
                            >
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 text-xs bg-[#F8F8FA] border border-[#E8E8E9] text-[#27272A] placeholder-[#A1A1AA] focus:bg-white focus:border-[#D86B81] focus:ring-1 focus:ring-[#D86B81] focus:outline-none transition-colors"
                                    required
                                />
                                <div className="absolute left-3.5 top-3.5 text-[#A1A1AA] pointer-events-none flex items-center">
                                    <iconify-icon
                                        icon="solar:shield-check-linear"
                                        width="16"
                                        height="16"
                                        style={{ strokeWidth: '1.5' }}
                                    ></iconify-icon>
                                </div>
                            </div>
                            {errors.password && (
                                <p className="text-[#D9777F] mt-1.5 text-[11px]">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="border-[#E8E8E9] text-[#D86B81] focus:ring-[#D86B81] rounded-sm cursor-pointer"
                                />
                                <span className="text-[#71717A] text-[11px]">Ingat sesi login</span>
                            </label>

                            <Link
                                href="/"
                                className="text-[#A1A1AA] hover:text-[#B86875] text-[11px] transition-colors"
                            >
                                &larr; Beranda
                            </Link>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#D86B81] hover:bg-[#C85B71] active:bg-[#B84E64] text-white py-3.5 text-xs uppercase tracking-widest font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#D86B81]/25 rounded-sm"
                            >
                                {processing ? 'Memverifikasi...' : 'Masuk ke Dashboard Gudang'}
                                <iconify-icon
                                    icon="solar:bag-2-linear"
                                    width="16"
                                    height="16"
                                    style={{ strokeWidth: '1.5' }}
                                ></iconify-icon>
                            </button>
                        </div>
                    </form>

                    {/* Catatan Kredensial Bawaan */}
                    <div className="mt-8 pt-6 border-t border-[#F5F5F7] text-center">
                        <p className="text-[11px] text-[#A1A1AA] font-light">
                            Akun seeder bawaan: <span className="font-mono text-[#52525B]">admin@febnine.com</span> /{' '}
                            <span className="font-mono text-[#52525B]">password</span>
                        </p>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-[11px] text-[#A1A1AA]">
                        &copy; {new Date().getFullYear()} Febnine Atelier. Sistem Manajemen Inventori Gudang Terpusat.
                    </p>
                </div>
            </div>
        </div>
    );
}
