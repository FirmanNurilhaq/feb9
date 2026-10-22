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

            <div className="min-h-screen bg-[#F8F8FA] text-[#27272A] antialiased selection:bg-[#F7DDE2] selection:text-[#B86875] flex flex-col justify-between relative overflow-hidden">
                {/* Aksen Latar Belakang Gradasi Radial Dusty Pink Lembut Khas Studio Feb Nine */}
                <div
                    className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#F7DDE2]/40 rounded-full blur-3xl pointer-events-none -mr-36 -mt-36"
                    aria-hidden="true"
                />
                <div
                    className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#E8E8E9]/60 rounded-full blur-3xl pointer-events-none -ml-28 -mb-28"
                    aria-hidden="true"
                />

                {/* 1. Header Bersih & Minimalis (Abu Muda & Kaca) */}
                <header className="sticky top-0 z-50 bg-[#F8F8FA]/85 backdrop-blur-md border-b border-[#E8E8E9] transition-all">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
                        {/* Logo & Identitas Brand Febnine Atelier */}
                        <Link href="/" className="flex items-center gap-3.5 group">
                            <img
                                src="/images/logo_clean.png"
                                alt="Febnine Atelier"
                                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                            />
                            <div className="flex flex-col">
                                <span className="font-serif text-2xl tracking-tight font-medium text-[#27272A] select-none leading-none">
                                    Febnine Atelier.
                                </span>
                                <span className="text-[10px] uppercase tracking-widest text-[#B86875] font-medium mt-1">
                                    Atelier & Studio
                                </span>
                            </div>
                        </Link>
                    </div>
                </header>

                {/* 2. Hero Section Utama (Quiet Elegance Gateway) */}
                <main className="flex-1 flex items-center py-12 lg:py-20 relative z-10">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
                            {/* Kolom Kiri: Deskripsi & SATU-SATUNYA Tombol Masuk Dusty Pink */}
                            <div className="w-full lg:w-1/2 z-10 text-left">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF4F5] border border-[#F7DDE2] text-[#B86875] mb-6">
                                    <span className="w-2 h-2 rounded-full bg-[#D86B81]"></span>
                                    <span className="text-xs uppercase tracking-[0.2em] font-medium">
                                        Febnine Atelier &bull; Quiet Elegance
                                    </span>
                                </div>

                                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#27272A] leading-[1.08] mb-6">
                                    The Art of Quiet Elegance
                                </h1>

                                <p className="text-[#52525B] text-base sm:text-lg leading-relaxed max-w-xl font-light mb-10">
                                    Portal operasional terpusat Febnine Atelier. Dirancang khusus untuk mengelola master koleksi busana mewah,
                                    pemantauan stok barang, serta pencatatan aktivitas atelier dengan ketelitian dan integritas tinggi.
                                </p>

                                {/* Satu-satunya Tombol Masuk: Aksen Dusty Pink Khas Feb Nine */}
                                <div>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center gap-3 bg-[#D86B81] hover:bg-[#C85B71] text-white px-10 py-4 text-xs tracking-widest uppercase font-medium active:bg-[#B84E64] transition-all duration-300 shadow-xl shadow-[#D86B81]/25 group rounded-sm"
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

                            {/* Kolom Kanan: Visual Hero Asimetris dengan Layer Dusty Pink Lembut */}
                            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
                                <div className="relative max-w-md lg:max-w-lg w-full">
                                    {/* Layer dekoratif dirotasi khas nuansa dusty pink studio */}
                                    <div
                                        className="absolute inset-0 bg-[#F7DDE2] rotate-3 scale-105 opacity-80 rounded-tl-[80px] rounded-br-[80px] -z-0 transition-transform duration-700 shadow-md"
                                        aria-hidden="true"
                                    ></div>

                                    <div className="relative z-10 overflow-hidden rounded-tl-[80px] rounded-br-[80px] shadow-2xl bg-white border border-[#E8E8E9] group">
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
                <footer className="bg-[#27272A] text-[#A1A1AA] py-8 border-t border-[#3F3F46] relative z-10">
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

                        <p className="text-xs text-[#A1A1AA] font-light">
                            &copy; {new Date().getFullYear()} Febnine Atelier. Seluruh hak cipta dilindungi.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
