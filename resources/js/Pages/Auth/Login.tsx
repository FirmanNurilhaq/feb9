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
        <div className="min-h-screen bg-stone-50 flex flex-col justify-center relative overflow-hidden font-sans text-stone-900 selection:bg-stone-200">
            {/* Background subtle radial texture & blur */}
            <div
                className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-100/40 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28"
                aria-hidden="true"
            />
            <div
                className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-stone-200/50 rounded-full blur-3xl pointer-events-none -ml-28 -mb-28"
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

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-stone-700 text-[11px] font-medium uppercase tracking-widest mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-800"></span>
                        Portal Otoritas Tunggal Gudang
                    </div>

                    <h1 className="font-serif text-3xl font-normal text-stone-900 tracking-tight">
                        Febnine Atelier
                    </h1>
                    <p className="mt-2 text-xs text-stone-500 font-light leading-relaxed max-w-xs mx-auto">
                        Akses sistem manajemen inventori, pergerakan stok SKU, dan pencatatan penjualan terpusat.
                    </p>
                </div>

                {status && (
                    <div className="mb-4 p-3.5 bg-stone-100 border border-stone-300 text-stone-800 text-xs font-medium rounded-sm">
                        {status}
                    </div>
                )}

                {/* Kartu Form Login dengan Nuansa Quiet Elegance */}
                <div className="bg-white p-8 sm:p-10 border border-stone-200 shadow-xl relative">
                    <form onSubmit={submit} className="space-y-6 text-xs">
                        <div>
                            <label
                                htmlFor="email"
                                className="block uppercase tracking-widest text-[10px] font-medium text-stone-600 mb-2"
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
                                    className="w-full pl-10 pr-4 py-3 text-xs bg-stone-50/50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:bg-white focus:border-stone-800 focus:outline-none transition-colors"
                                    required
                                    autoFocus
                                />
                                <div className="absolute left-3.5 top-3.5 text-stone-400 pointer-events-none flex items-center">
                                    <iconify-icon
                                        icon="solar:user-linear"
                                        width="16"
                                        height="16"
                                        style={{ strokeWidth: '1.5' }}
                                    ></iconify-icon>
                                </div>
                            </div>
                            {errors.email && (
                                <p className="text-rose-600 mt-1.5 text-[11px]">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block uppercase tracking-widest text-[10px] font-medium text-stone-600 mb-2"
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
                                    className="w-full pl-10 pr-4 py-3 text-xs bg-stone-50/50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:bg-white focus:border-stone-800 focus:outline-none transition-colors"
                                    required
                                />
                                <div className="absolute left-3.5 top-3.5 text-stone-400 pointer-events-none flex items-center">
                                    <iconify-icon
                                        icon="solar:shield-check-linear"
                                        width="16"
                                        height="16"
                                        style={{ strokeWidth: '1.5' }}
                                    ></iconify-icon>
                                </div>
                            </div>
                            {errors.password && (
                                <p className="text-rose-600 mt-1.5 text-[11px]">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="border-stone-300 text-stone-900 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                />
                                <span className="text-stone-500 text-[11px]">Ingat sesi login</span>
                            </label>

                            <Link
                                href="/"
                                className="text-stone-400 hover:text-stone-700 text-[11px] transition-colors"
                            >
                                &larr; Beranda
                            </Link>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-stone-900 text-white py-3.5 text-xs uppercase tracking-widest font-medium hover:bg-stone-800 active:bg-black transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
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

                    {/* Catatan Bantuan Kredensial */}
                    <div className="mt-8 pt-6 border-t border-stone-100 text-center">
                        <p className="text-[11px] text-stone-400 font-light">
                            Akun seeder bawaan: <span className="font-mono text-stone-600">admin@febnine.com</span> /{' '}
                            <span className="font-mono text-stone-600">password</span>
                        </p>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-[11px] text-stone-400">
                        &copy; {new Date().getFullYear()} Febnine Atelier. Sistem Manajemen Inventori Gudang Terpusat.
                    </p>
                </div>
            </div>
        </div>
    );
}
