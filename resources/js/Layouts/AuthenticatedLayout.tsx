import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    House, 
    TShirt, 
    ArrowDownLeft, 
    Receipt, 
    ArrowCounterClockwise, 
    ClipboardText, 
    ChartBar, 
    Notebook,
    SignOut,
    UserCircle,
    List,
    X,
    Bell,
    Gear
} from '@phosphor-icons/react';
import { PageProps } from '@/types';

interface AuthenticatedLayoutProps {
    header?: React.ReactNode;
    children: React.ReactNode;
}

export default function AuthenticatedLayout({ header, children }: AuthenticatedLayoutProps) {
    const { auth, flash } = usePage<PageProps<{ flash?: { success?: string; error?: string } }>>().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const currentUrl = window.location.pathname;

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: House, active: currentUrl === '/dashboard' },
        { name: 'Master Produk (SKU)', href: '/products', icon: TShirt, active: currentUrl.startsWith('/products') },
        { name: 'Barang Masuk (Inbound)', href: '/inbound', icon: ArrowDownLeft, active: currentUrl.startsWith('/inbound') },
        { name: 'Pencatatan Penjualan', href: '/sales', icon: Receipt, active: currentUrl.startsWith('/sales') },
        { name: 'Manajemen Retur', href: '/returns', icon: ArrowCounterClockwise, active: currentUrl.startsWith('/returns') },
        { name: 'Stock Opname', href: '/opname', icon: ClipboardText, active: currentUrl.startsWith('/opname') },
        { name: 'Laporan Laba Rugi', href: '/reports/sales', icon: ChartBar, active: currentUrl.startsWith('/reports/sales') },
        { name: 'Kartu Stok Gudang', href: '/reports/stock-card', icon: Notebook, active: currentUrl.startsWith('/reports/stock-card') },
        { name: 'Pengaturan Notifikasi', href: '/settings', icon: Gear, active: currentUrl.startsWith('/settings') },
    ];

    return (
        <div className="min-h-screen bg-[#FCFCFC] text-[#27272A] flex">
            {/* Mobile Sidebar Backdrop */}
            {mobileOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs transition-opacity md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E8E8E9] flex flex-col justify-between
                transition-transform duration-200 ease-in-out md:translate-x-0
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                no-print
            `}>
                <div>
                    {/* Brand Header */}
                    <div className="h-24 px-6 flex items-center justify-between border-b border-[#F0F0F1]">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <img 
                                src="/images/logo_clean.png" 
                                alt="Febnine Atelier" 
                                className="h-14 w-auto object-contain transition-luxury hover:opacity-90"
                            />
                        </Link>
                        <button 
                            className="p-1 text-[#959595] hover:text-[#27272A] md:hidden"
                            onClick={() => setMobileOpen(false)}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="p-4 space-y-1">
                        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-[#959595] uppercase">
                            Menu Gudang
                        </div>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-luxury
                                        ${item.active 
                                            ? 'bg-[#E59AA6]/10 text-[#27272A] font-semibold border-l-2 border-[#E59AA6] shadow-xs' 
                                            : 'text-[#646467] hover:bg-[#F5F5F7] hover:text-[#27272A]'
                                        }
                                    `}
                                >
                                    <Icon 
                                        size={20} 
                                        weight={item.active ? 'fill' : 'regular'} 
                                        className={item.active ? 'text-[#E59AA6]' : 'text-[#959595]'}
                                    />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* User & Logout section */}
                <div className="p-4 border-t border-[#F0F0F1]">
                    <div className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-[#E59AA6]/20 flex items-center justify-center text-[#B86875] font-semibold text-xs shrink-0">
                                {auth.user.name.charAt(0)}
                            </div>
                            <div className="truncate">
                                <p className="text-xs font-semibold text-[#27272A] truncate">{auth.user.name}</p>
                                <p className="text-[11px] text-[#959595] truncate">Pemilik Gudang</p>
                            </div>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-1.5 text-[#959595] hover:text-[#D9777F] transition-luxury rounded-md hover:bg-[#FCF0F1]"
                            title="Keluar"
                        >
                            <SignOut size={18} />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {/* Topbar */}
                <header className="h-16 px-6 bg-white/80 backdrop-blur-md border-b border-[#E8E8E9] flex items-center justify-between sticky top-0 z-30 no-print">
                    <div className="flex items-center gap-3">
                        <button 
                            className="p-1.5 text-[#27272A] hover:bg-[#F5F5F7] rounded-lg md:hidden"
                            onClick={() => setMobileOpen(true)}
                        >
                            <List size={22} />
                        </button>
                        {header}
                    </div>

                    <div className="flex items-center gap-3">
                        <Link 
                            href="/settings"
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#646467] hover:text-[#27272A] bg-[#F5F5F7] hover:bg-[#EAEAEA] rounded-full border border-[#E8E8E9] transition-luxury"
                            title="Pengaturan Notifikasi Email & Brevo"
                        >
                            <Gear size={15} className="text-[#959595]" />
                            <span>Pengaturan Email</span>
                        </Link>
                    </div>
                </header>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mx-6 mt-4 p-4 rounded-lg bg-[#EFF6F2] border border-[#7A9D8C]/30 text-[#436453] text-sm flex items-center justify-between transition-luxury">
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-6 mt-4 p-4 rounded-lg bg-[#FCF0F1] border border-[#D9777F]/30 text-[#9B3C44] text-sm flex items-center justify-between transition-luxury">
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Page Body */}
                <main className="p-6 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
