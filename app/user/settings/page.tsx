"use client";
import React, { useState, useEffect } from 'react';
import Template from "@/components/Template";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { FaQuestionCircle, FaServer, FaKey, FaEnvelope, FaCog, FaSave, FaShieldAlt, FaSync, FaFolder, FaPencilAlt, FaTrash, FaPlus, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { getImapSettings, getCategories, syncEmails, createImapSetting } from '@/lib/api';

// Define interfaces for our data
interface ImapSetting {
    id: number;
    user_id: number;
    email: string;
    server: string;
    port: number;
    username: string;
    use_ssl: boolean;
    folder: string;
    last_sync: string | null;
    created_at: string;
}

interface Category {
    id: number;
    name: string;
    color: string;
    icon: string | null;
}

function SettingPage() {
    const [activeTab, setActiveTab] = useState('email');
    const [imapSettings, setImapSettings] = useState<ImapSetting[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [syncingEmail, setSyncingEmail] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        server: '',
        port: '993',
        username: '',
        use_ssl: true,
        folder: 'INBOX'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);



    const [syncSettings, setSyncSettings] = useState({
        daysBack: 30,
        limit: 50
    });

    // เพิ่มฟังก์ชันสำหรับการจัดการการเปลี่ยนแปลงค่าในฟอร์ม
    const handleSyncSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSyncSettings(prev => ({
            ...prev,
            [name]: parseInt(value) || 0
        }));
    };

    // Fetch IMAP settings and categories when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch IMAP settings
                const imapData = await getImapSettings();
                setImapSettings(imapData);

                // Fetch categories
                const categoriesData = await getCategories();
                setCategories(categoriesData);

                setError(null);
            } catch (err) {
                console.error("Error fetching settings data:", err);
                setError("ไม่สามารถโหลดข้อมูลได้ โปรดลองอีกครั้งในภายหลัง");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));

        // Auto-fill username with email if empty
        if (name === 'email' && !formData.username) {
            setFormData(prev => ({
                ...prev,
                username: value
            }));
        }
    };

    // Handle server preset selection
    const handleServerPreset = (preset: string) => {
        switch (preset) {
            case 'gmail':
                setFormData(prev => ({
                    ...prev,
                    server: 'imap.gmail.com',
                    port: '993',
                    use_ssl: true
                }));
                break;
            case 'outlook':
                setFormData(prev => ({
                    ...prev,
                    server: 'outlook.office365.com',
                    port: '993',
                    use_ssl: true
                }));
                break;
            case 'yahoo':
                setFormData(prev => ({
                    ...prev,
                    server: 'imap.mail.yahoo.com',
                    port: '993',
                    use_ssl: true
                }));
                break;
        }
    };

    // Handle form submission to create new IMAP setting
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);
        setIsSubmitting(true);

        try {
            // Call API to create IMAP setting
            const response = await createImapSetting({
                email: formData.email,
                server: formData.server,
                port: parseInt(formData.port),
                username: formData.username,
                password: formData.password,
                use_ssl: formData.use_ssl,
                folder: formData.folder
            });

            // Update local state
            setImapSettings(prev => [...prev, response]);

            // Reset form
            setFormData({
                email: '',
                password: '',
                server: '',
                port: '993',
                username: '',
                use_ssl: true,
                folder: 'INBOX'
            });

            setFormSuccess('บันทึกการตั้งค่าสำเร็จ');
            setTimeout(() => setFormSuccess(null), 3000);

        } catch (err: any) {
            console.error("Error saving IMAP settings:", err);
            if (err.response && err.response.data && err.response.data.detail) {
                setFormError(err.response.data.detail);
            } else {
                setFormError('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า กรุณาลองใหม่อีกครั้ง');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle email sync
    const handleSyncEmail = async (imapId: number) => {
        setSyncingEmail(imapId);
        
        try {
            // ใช้ค่าการตั้งค่าซิงค์จาก state
            await syncEmails(imapId, syncSettings.daysBack, syncSettings.limit);
            
            // อัปเดตเวลาซิงค์ล่าสุดในหน้า UI
            setImapSettings(prev => 
                prev.map(item => 
                    item.id === imapId 
                        ? { ...item, last_sync: new Date().toISOString() } 
                        : item
                )
            );
            
            setFormSuccess(`ซิงค์อีเมลเสร็จสิ้น (${syncSettings.limit} ฉบับ ย้อนหลัง ${syncSettings.daysBack} วัน)`);
            setTimeout(() => setFormSuccess(null), 5000);
            
        } catch (err) {
            console.error("Error syncing emails:", err);
            setError("ไม่สามารถซิงค์อีเมลได้ โปรดลองอีกครั้งในภายหลัง");
            setTimeout(() => setError(null), 5000);
        } finally {
            setSyncingEmail(null);
        }
    };

    // Format date for display
    const formatDate = (dateStr: string | null): string => {
        if (!dateStr) return "ไม่เคยซิงค์";

        const date = new Date(dateStr);
        return date.toLocaleString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Loading state
    if (loading) {
        return (
            <Template>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F584F]"></div>
                </div>
            </Template>
        );
    }

    return (
        <Template>
            <div className="container mx-auto px-4 pt-3 max-w-[100rem]">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="email" className="flex items-center justify-center">
                                <FaEnvelope className="mr-2" />
                                ตั้งค่าอีเมล
                            </TabsTrigger>

                            <TabsTrigger value="advanced" className="flex items-center justify-center">
                                <FaServer className="mr-2" />
                                ตั้งค่าขั้นสูง
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="email" className="space-y-4">
                            <Card className="shadow-md border-t-4 border-t-[#2F584F] py-8">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl flex items-center">
                                        <FaEnvelope className="mr-2 text-[#2F584F]" />
                                        ตั้งค่าการเชื่อมต่ออีเมล
                                    </CardTitle>
                                    <CardDescription>กรอกข้อมูลเพื่อเชื่อมต่อกับเซิร์ฟเวอร์อีเมลของคุณ</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {formError && (
                                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-4">
                                            <p className="text-sm text-red-700">{formError}</p>
                                        </div>
                                    )}

                                    {formSuccess && (
                                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md mb-4">
                                            <p className="text-sm text-green-700">{formSuccess}</p>
                                        </div>
                                    )}

                                    <div className="bg-[#e7eeec] border-l-4 border-[#2F584F] p-4 rounded-md mb-6">
                                        <p className="text-sm text-[#2F584F]">การเชื่อมต่ออีเมลช่วยให้ระบบสามารถดึงข้อมูลบิลและใบเสร็จจากอีเมลของคุณโดยอัตโนมัติ</p>
                                    </div>

                                    {/* Current IMAP settings */}
                                    {imapSettings.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-lg font-medium mb-4">อีเมลที่เชื่อมต่อแล้ว</h3>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full bg-white border">
                                                    <thead>
                                                        <tr className="bg-gray-50 border-b">
                                                            <th className="py-2 px-4 text-left">อีเมล</th>
                                                            <th className="py-2 px-4 text-left">เซิร์ฟเวอร์</th>
                                                            <th className="py-2 px-4 text-left">ซิงค์ล่าสุด</th>
                                                            <th className="py-2 px-4 text-left">จัดการ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {imapSettings.map(setting => (
                                                            <tr key={setting.id} className="border-b">
                                                                <td className="py-2 px-4">{setting.email}</td>
                                                                <td className="py-2 px-4">{setting.server}</td>
                                                                <td className="py-2 px-4">{formatDate(setting.last_sync)}</td>
                                                                <td className="py-2 px-4">
                                                                    <button
                                                                        className="bg-[#2F584F] text-white px-3 py-1 rounded-md hover:bg-[#8CA29D] mr-2 flex items-center text-xs"
                                                                        onClick={() => handleSyncEmail(setting.id)}
                                                                        disabled={syncingEmail === setting.id}
                                                                    >
                                                                        {syncingEmail === setting.id ? (
                                                                            <>
                                                                                <FaSpinner className="animate-spin mr-1" />
                                                                                กำลังซิงค์...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <FaSync className="mr-1" />
                                                                                ซิงค์เดี๋ยวนี้
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <h3 className="text-lg font-medium mb-4">เพิ่มการเชื่อมต่ออีเมลใหม่</h3>

                                        {/* Quick setup buttons */}
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <span className="text-sm text-gray-500">เลือกผู้ให้บริการ:</span>
                                            <button
                                                type="button"
                                                onClick={() => handleServerPreset('gmail')}
                                                className="text-sm px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
                                            >
                                                Gmail
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleServerPreset('outlook')}
                                                className="text-sm px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
                                            >
                                                Outlook
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleServerPreset('yahoo')}
                                                className="text-sm px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
                                            >
                                                Yahoo Mail
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="email" className="block text-sm font-medium">
                                                อีเมลที่ใช้รับบิลและใบเสร็จ
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F584F]"
                                                placeholder="example@example.com"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="username" className="block text-sm font-medium">
                                                ชื่อผู้ใช้
                                            </label>
                                            <input
                                                type="text"
                                                id="username"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F584F]"
                                                placeholder="ปกติคือที่อยู่อีเมลของคุณ"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="password" className="block text-sm font-medium">
                                                รหัสผ่านแอพ
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F584F]"
                                                placeholder="รหัสผ่านแอพของคุณ"
                                                required
                                            />
                                            <p className="text-xs text-gray-500">ใช้รหัสผ่านแอพแทนรหัสผ่านปกติเพื่อความปลอดภัย <Link href="#" className="text-[#2F584F] underline">เรียนรู้เพิ่มเติม</Link></p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="server" className="block text-sm font-medium">
                                                    เซิร์ฟเวอร์ IMAP
                                                </label>
                                                <input
                                                    type="text"
                                                    id="server"
                                                    name="server"
                                                    value={formData.server}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F584F]"
                                                    placeholder="imap.example.com"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="port" className="block text-sm font-medium">
                                                    พอร์ต
                                                </label>
                                                <input
                                                    type="number"
                                                    id="port"
                                                    name="port"
                                                    value={formData.port}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F584F]"
                                                    placeholder="993"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md">
                                            <input
                                                type="checkbox"
                                                id="use_ssl"
                                                name="use_ssl"
                                                checked={formData.use_ssl}
                                                onChange={handleChange as any}
                                                className="h-4 w-4 text-[#2F584F] focus:ring-[#2F584F] border-gray-300 rounded"
                                            />
                                            <label htmlFor="use_ssl" className="block text-sm font-medium">
                                                ใช้ SSL (แนะนำให้เปิดใช้งานเพื่อความปลอดภัย)
                                            </label>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="folder" className="block text-sm font-medium">
                                                โฟลเดอร์ที่จะตรวจสอบ
                                            </label>
                                            <input
                                                type="text"
                                                id="folder"
                                                name="folder"
                                                value={formData.folder}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F584F]"
                                                placeholder="INBOX"
                                            />
                                        </div>

                                        <div className="pt-4 flex items-center">
                                            <Button
                                                type="submit"
                                                className="bg-[#2F584F] hover:bg-[#8CA29D] text-white flex items-center"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <FaSpinner className="animate-spin mr-2" />
                                                        กำลังบันทึก...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaSave className="mr-2" />
                                                        บันทึกการตั้งค่า
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="advanced" className="space-y-4">
                            <Card className="shadow-md border-t-4 border-t-[#2F584F] py-8">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl flex items-center">
                                        <FaServer className="mr-2 text-[#2F584F]" />
                                        ตั้งค่าขั้นสูง
                                    </CardTitle>
                                    <CardDescription>ตัวเลือกการตั้งค่าขั้นสูงสำหรับการเชื่อมต่ออีเมล</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-6">
                                        <div className="bg-[#e7eeec] border-l-4 border-[#2F584F] p-4 rounded-md mb-6">
                                            <p className="text-sm text-[#2F584F]">การเปลี่ยนแปลงการตั้งค่าขั้นสูงอาจส่งผลต่อการทำงานของระบบ โปรดดำเนินการด้วยความระมัดระวัง</p>
                                        </div>

                                        {/* เพิ่มส่วนของการตั้งค่าการซิงค์อีเมล */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium">การตั้งค่าการซิงค์อีเมล</h3>
                                            <p className="text-sm text-gray-600">กำหนดค่าเริ่มต้นสำหรับการซิงค์อีเมลทั้งหมด</p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label htmlFor="daysBack" className="block text-sm font-medium">
                                                        ดึงข้อมูลย้อนหลังสูงสุด (วัน)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="daysBack"
                                                        name="daysBack"
                                                        value={syncSettings.daysBack}
                                                        onChange={handleSyncSettingsChange}
                                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F584F]"
                                                        placeholder="30"
                                                        min="1"
                                                        max="365"
                                                    />
                                                    <p className="text-xs text-gray-500">จำนวนวันย้อนหลังที่จะดึงอีเมล (ค่าแนะนำ: 30)</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <label htmlFor="limit" className="block text-sm font-medium">
                                                        จำนวนอีเมลสูงสุด (ฉบับ)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="limit"
                                                        name="limit"
                                                        value={syncSettings.limit}
                                                        onChange={handleSyncSettingsChange}
                                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F584F]"
                                                        placeholder="50"
                                                        min="1"
                                                        max="1000"
                                                    />
                                                    <p className="text-xs text-gray-500">จำนวนอีเมลสูงสุดที่จะดึงในแต่ละครั้ง (ค่าแนะนำ: 50)</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex items-center justify-between">
                                            <Button
                                                type="submit"
                                                className="bg-[#2F584F] hover:bg-[#8CA29D] text-white flex items-center"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    // บันทึกการตั้งค่าลง localStorage หรือ API ตามที่ต้องการ
                                                    localStorage.setItem('syncSettings', JSON.stringify(syncSettings));
                                                    setFormSuccess('บันทึกการตั้งค่าขั้นสูงสำเร็จ');
                                                    setTimeout(() => setFormSuccess(null), 3000);
                                                }}
                                            >
                                                <FaSave className="mr-2" />
                                                บันทึกการตั้งค่าขั้นสูง
                                            </Button>
                                            <Button
                                                type="button"
                                                className="bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center"
                                                onClick={() => {
                                                    // รีเซ็ตค่าเป็นค่าเริ่มต้น
                                                    setSyncSettings({
                                                        daysBack: 30,
                                                        limit: 50
                                                    });
                                                    localStorage.removeItem('syncSettings');
                                                }}
                                            >
                                                <FaSync className="mr-2" />
                                                คืนค่าเริ่มต้น
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <Card className="shadow-md border-t-4 border-t-[#2F584F] md:mt-18 w-full py-8">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl flex items-center">
                                <FaQuestionCircle className="mr-2 text-[#2F584F]" />
                                คำแนะนำการตั้งค่าอีเมล
                            </CardTitle>
                            <CardDescription>ข้อมูลเพิ่มเติมเกี่ยวกับการตั้งค่าอีเมลสำหรับผู้ให้บริการต่างๆ</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-[#e7eeec] border-l-4 border-[#2F584F] p-4 rounded-md mb-6">
                                <p className="text-sm text-[#2F584F]">เลือกผู้ให้บริการอีเมลของคุณจากตารางด้านล่างเพื่อดูการตั้งค่าที่แนะนำ</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้ให้บริการ</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เซิร์ฟเวอร์ IMAP</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">พอร์ต</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมายเหตุ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Gmail</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">imap.gmail.com</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">993</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">ต้องเปิดใช้งาน IMAP ในการตั้งค่า Gmail และใช้รหัสผ่านแอพ</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Outlook/Hotmail</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">outlook.office365.com</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">993</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">ต้องเปิดใช้งาน IMAP ในการตั้งค่า Outlook</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Yahoo Mail</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">imap.mail.yahoo.com</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">993</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">ต้องเปิดใช้งาน IMAP ในการตั้งค่า Yahoo Mail และใช้รหัสผ่านแอพ</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">iCloud Mail</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">imap.mail.me.com</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">993</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">ต้องเปิดใช้งาน IMAP ในการตั้งค่า iCloud และใช้รหัสผ่านแอพ</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Template>
    );
}

export default SettingPage;