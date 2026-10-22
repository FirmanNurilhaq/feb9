import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Gear, 
    EnvelopeSimple, 
    PaperPlaneTilt, 
    CheckCircle, 
    WarningCircle, 
    Key, 
    Clock, 
    Copy, 
    Check, 
    Terminal, 
    Lightning,
    ShieldCheck
} from '@phosphor-icons/react';

interface SettingsProps {
    settings: {
        alert_email: string;
        brevo_sender_email: string;
        brevo_sender_name: string;
        has_api_key: boolean;
        masked_api_key: string;
    };
    cron_command: string;
    server_path: string;
}

export default function SettingsIndex({ settings, cron_command, server_path }: SettingsProps) {
    const { data, setData, post, processing, errors } = useForm({
        alert_email: settings.alert_email || '',
    });

    const [testLoading, setTestLoading] = useState(false);
    const [copiedCron, setCopiedCron] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings', {
            preserveScroll: true,
        });
    };

    const handleTestEmail = () => {
        setTestLoading(true);
        post('/settings/test-email', {
            preserveScroll: true,
            onFinish: () => setTestLoading(false),
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedCron(true);
        setTimeout(() => setCopiedCron(false), 2000);
    };

    const fullCronCommand = `* * * * * cd ${server_path} && php artisan schedule:run >> /dev/null 2>&1`;
    const directCronCommand = `0 * * * * php ${server_path}/artisan ${cron_command}`;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-[#27272A]">Pengaturan Notifikasi & Brevo</h1>
                    <p className="text-xs text-[#959595] mt-0.5">Konfigurasi penerima email stok menipis dan sistem pemicu otomatis</p>
                </div>
            }
        >
            <Head title="Pengaturan Notifikasi" />

            <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
                {/* Status Banner */}
                <div className="bg-white border border-[#E8E8E9] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#E59AA6]/15 border border-[#E59AA6]/30 flex items-center justify-center shrink-0 text-[#E59AA6]">
                            <EnvelopeSimple size={26} weight="duotone" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-semibold text-base text-[#27272A]">Brevo REST API v3</h2>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EFF6F2] text-[#436453] border border-[#7A9D8C]/30">
                                    <ShieldCheck size={14} weight="bold" />
                                    Terhubung & Siap
                                </span>
                            </div>
                            <p className="text-xs text-[#646467] mt-1 max-w-xl leading-relaxed">
                                Notifikasi stok menipis dikirim via protokol HTTPS REST API Brevo. Lebih andal daripada SMTP konvensional dan bebas dari risiko blokir port hosting/cPanel.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleTestEmail}
                        disabled={testLoading}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#E59AA6] hover:bg-[#D9777F] transition-luxury shadow-xs disabled:opacity-50 shrink-0 cursor-pointer"
                    >
                        <PaperPlaneTilt size={16} weight="bold" className={testLoading ? 'animate-bounce' : ''} />
                        <span>{testLoading ? 'Mengirim Uji Coba...' : 'Kirim Email Uji Coba'}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Settings Form Column */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white border border-[#E8E8E9] rounded-2xl p-6 shadow-xs">
                            <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-[#F0F0F1]">
                                <Gear size={20} className="text-[#E59AA6]" weight="bold" />
                                <h3 className="font-bold text-sm text-[#27272A]">Konfigurasi Email & API</h3>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Target Recipient Email */}
                                <div>
                                    <label className="block text-xs font-semibold text-[#27272A] mb-1.5">
                                        Target Email Penerima Notifikasi (Low Stock Alert) <span className="text-[#D9777F]">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#959595]">
                                            <EnvelopeSimple size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            value={data.alert_email}
                                            onChange={(e) => setData('alert_email', e.target.value)}
                                            placeholder="contoh: owner@febnine.com"
                                            required
                                            className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#E8E8E9] rounded-xl focus:outline-none focus:border-[#E59AA6] focus:ring-1 focus:ring-[#E59AA6] transition-luxury text-[#27272A]"
                                        />
                                    </div>
                                    <p className="text-[11px] text-[#959595] mt-1.5">
                                        Email ini akan otomatis menerima surat peringatan saat stok produk tersisa ≤ reorder point.
                                    </p>
                                    {errors.alert_email && (
                                        <p className="text-[11px] text-[#D9777F] mt-1">{errors.alert_email}</p>
                                    )}
                                </div>

                                {/* Sender Info Pill */}
                                <div className="p-3.5 bg-[#FBFBFC] rounded-xl border border-[#F0F0F1] flex items-start gap-2.5">
                                    <div className="w-2 h-2 rounded-full bg-[#7A9D8C] mt-1.5 shrink-0" />
                                    <div className="text-[11px] text-[#646467] leading-relaxed">
                                        <span className="font-semibold text-[#27272A]">Identitas Pengirim Terintegrasi:</span> Email dikirim otomatis atas nama <strong>Febnine Atelier</strong> menggunakan akun Brevo Anda (<code>manzrockys@gmail.com</code>). Anda tidak perlu mengaturnya lagi.
                                    </div>
                                </div>

                                <div className="pt-3 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#27272A] hover:bg-[#3F3F46] transition-luxury shadow-xs disabled:opacity-50 cursor-pointer"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Automation Architecture Column */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Dual Trigger Card */}
                        <div className="bg-white border border-[#E8E8E9] rounded-2xl p-6 shadow-xs space-y-5">
                            <div className="flex items-center gap-2.5 pb-4 border-b border-[#F0F0F1]">
                                <Lightning size={20} className="text-[#E59AA6]" weight="fill" />
                                <h3 className="font-bold text-sm text-[#27272A]">Pemicu Otomatis (Push Triggers)</h3>
                            </div>

                            {/* Trigger 1: Realtime Push */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[#E59AA6]/15 text-[#E59AA6] text-[10px] font-bold flex items-center justify-center">1</span>
                                    <h4 className="text-xs font-bold text-[#27272A]">Realtime Event (Live Trigger)</h4>
                                </div>
                                <p className="text-[11px] text-[#646467] leading-relaxed pl-7">
                                    Setiap kali penjualan dicatat atau mutasi keluar terjadi, sistem langsung membandingkan sisa fisik dengan <span className="font-semibold text-[#27272A]">Reorder Point</span> produk. Jika stok menyentuh batas minimum, Brevo API seketika mendorong email alert ke target penerima.
                                </p>
                            </div>

                            {/* Trigger 2: Autonomous Cron */}
                            <div className="space-y-2 pt-2 border-t border-[#F0F0F1]">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[#7A9D8C]/20 text-[#436453] text-[10px] font-bold flex items-center justify-center">2</span>
                                    <h4 className="text-xs font-bold text-[#27272A]">Autonomous Background Scheduler</h4>
                                </div>
                                <p className="text-[11px] text-[#646467] leading-relaxed pl-7">
                                    <span className="font-semibold text-[#27272A]">Tanpa ada orang yang membuka website sekalipun</span>, server dapat menjalankan pengecekan otomatis secara berkala melalui scheduler cPanel / Linux Cron.
                                </p>
                            </div>
                        </div>

                        {/* Cron Command Setup Card */}
                        <div className="bg-[#FCFCFC] border border-[#E8E8E9] rounded-2xl p-6 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E9]">
                                <div className="flex items-center gap-2 text-[#27272A] font-bold text-xs">
                                    <Terminal size={18} className="text-[#646467]" />
                                    <span>Konfigurasi Cron Server / cPanel</span>
                                </div>
                                <span className="text-[10px] bg-[#F0F0F1] px-2 py-0.5 rounded text-[#646467] font-mono">CLI</span>
                            </div>

                            <p className="text-[11px] text-[#646467] leading-relaxed">
                                Pasang baris berikut pada menu <strong>Cron Jobs</strong> di cPanel hosting atau <code>crontab -e</code> server Anda:
                            </p>

                            <div className="bg-[#18181B] text-[#F4F4F5] p-3.5 rounded-xl font-mono text-[11px] relative group overflow-x-auto">
                                <div className="pr-12 whitespace-nowrap">
                                    {fullCronCommand}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(fullCronCommand)}
                                    className="absolute right-2 top-2 p-1.5 bg-[#27272A] hover:bg-[#3F3F46] rounded-lg text-white transition-colors cursor-pointer"
                                    title="Salin Command"
                                >
                                    {copiedCron ? <Check size={14} className="text-[#7A9D8C]" /> : <Copy size={14} />}
                                </button>
                            </div>

                            <div className="text-[10px] text-[#959595] leading-relaxed">
                                Atau perintah langsung satu command per jam:
                                <div className="mt-1 font-mono text-[#27272A] bg-white p-2 rounded border border-[#E8E8E9] select-all">
                                    {directCronCommand}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
