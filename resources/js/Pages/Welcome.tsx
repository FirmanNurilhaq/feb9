import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function Welcome() {
    return (
        <>
            <Head>
                <title>Febnine Atelier | Quiet Elegance</title>
                <meta
                    name="description"
                    content="Febnine Atelier — Portal Resmi Manajemen Busana Luxury dan Sistem Operasional Terpusat."
                />
            </Head>

            <div className="min-h-screen bg-stone-50 text-stone-900 antialiased selection:bg-stone-200 flex flex-col justify-between">
                {/* 1. Header Bersih & Minimalis */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200/80 transition-all">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
                        {/* Logo & Identitas Brand Febnine Atelier */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <img
                                src="/images/logo_clean.png"
                                alt="Febnine Atelier"
                                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                            />
                            <span className="font-serif text-2xl tracking-tight font-medium text-stone-900 select-none">
                                Febnine Atelier.
                            </span>
                        </Link>
                    </div>
                </header>

                {/* 2. Hero Section Utama (Quiet Elegance Gateway) */}
                <main className="flex-1 flex items-center py-12 lg:py-20">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
                            {/* Kolom Kiri: Deskripsi & SATU-SATUNYA Tombol Masuk */}
                            <div className="w-full lg:w-1/2 z-10 text-left">
                                <div className="inline-flex items-center gap-2 mb-6">
                                    <span className="h-px w-8 bg-stone-400"></span>
                                    <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-medium">
                                        Febnine Atelier &bull; Quiet Elegance
                                    </span>
                                </div>

                                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-stone-900 leading-[1.08] mb-6">
                                    The Art of Quiet Elegance
                                </h1>

                                <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl font-light mb-10">
                                    Portal operasional terpusat Febnine Atelier. Dirancang khusus untuk mengelola master koleksi busana mewah,
                                    pemantauan stok barang, serta pencatatan aktivitas atelier dengan ketelitian dan integritas tinggi.
                                </p>

                                {/* Satu-satunya Tombol Masuk: Masuk ke Sistem */}
                                <div>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center gap-3 bg-stone-900 text-white px-10 py-4 text-xs tracking-widest uppercase font-medium hover:bg-stone-800 active:bg-black transition-all duration-300 shadow-xl group"
                                    >
                                        <span>Masuk ke Sistem</span>
                                        <iconify-icon
                                            icon="solar:arrow-right-linear"
                                            width="18"
                                            height="18"
                                            style={{ strokeWidth: '1.5' }}
                                            className="group-hover:translate-x-1 transition-transform"
                                        ></iconify-icon>
                                    </Link>
                                </div>
                            </div>

                            {/* Kolom Kanan: Visual Hero Asimetris Mewah */}
                            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
                                <div className="relative max-w-md lg:max-w-lg w-full">
                                    {/* Layer dekoratif dirotasi khas desain referensi */}
                                    <div
                                        className="absolute inset-0 bg-stone-200 rotate-3 scale-105 opacity-50 rounded-tl-[80px] rounded-br-[80px] -z-0 transition-transform duration-700"
                                        aria-hidden="true"
                                    ></div>

                                    <div className="relative z-10 overflow-hidden rounded-tl-[80px] rounded-br-[80px] shadow-2xl bg-stone-100 group">
                                        <img
                                            src="https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1887&auto=format&fit=crop"
                                            alt="Febnine Atelier Siluet"
                                            className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-700"
                                            loading="eager"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* 3. Footer Sederhana & Minimalis */}
                <footer className="bg-stone-900 text-stone-400 py-8 border-t border-stone-800">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <img
                                src="/images/logo_clean.png"
                                alt="Febnine Atelier"
                                className="h-6 w-auto object-contain brightness-0 invert"
                            />
                            <span className="font-serif text-lg font-normal text-white tracking-tight">
                                Febnine Atelier.
                            </span>
                        </div>

                        <p className="text-xs text-stone-500 font-light">
                            &copy; {new Date().getFullYear()} Febnine Atelier. Seluruh hak cipta dilindungi.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
