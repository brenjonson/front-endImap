"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Template from '@/components/Template';
import { FaArrowLeft, FaDownload, FaShareAlt } from 'react-icons/fa';
import Link from 'next/link';
import { LuCalendarDays } from "react-icons/lu";
import { HiOutlineTag } from "react-icons/hi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getReceiptById, getCategories, updateReceiptCategory } from '@/lib/api';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

// Define interfaces for receipt data
interface Receipt {
    id: number;
    email_subject: string;
    email_from: string;
    vendor_name: string;
    category_id: number | null;
    receipt_date: string;
    amount: number;
    currency: string;
    receipt_number: string | null;
    payment_method: string | null;
    notes: string | null;
    receipt_file_path: string | null;
    created_at: string;
}

interface Category {
    id: number;
    name: string;
    color: string;
    icon: string | null;
}

export default function ReceiptDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    const [receipt, setReceipt] = useState<Receipt | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // ดึงข้อมูลหมวดหมู่
                const categoriesData = await getCategories();
                setCategories(categoriesData);
                
                // ดึงข้อมูลใบเสร็จ
                const receiptData = await getReceiptById(parseInt(id));
                setReceipt(receiptData);
                
                // ตั้งค่าหมวดหมู่ที่เลือกปัจจุบัน
                if (receiptData.category_id) {
                    setSelectedCategory(receiptData.category_id.toString());
                }
                
                setError(null);
            } catch (err: any) {
                console.error("Error fetching receipt:", err);
                setError('ไม่สามารถดึงข้อมูลใบเสร็จได้ กรุณาลองใหม่อีกครั้ง');
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            fetchData();
        }
    }, [id]);

    // ฟังก์ชันอัปเดตหมวดหมู่ใบเสร็จ
    const handleUpdateCategory = async () => {
        if (!selectedCategory || !receipt) return;
        
        try {
            setUpdating(true);
            
            // เรียกใช้ API สำหรับอัปเดตหมวดหมู่
            await updateReceiptCategory(receipt.id, parseInt(selectedCategory));
            
            // อัปเดตข้อมูลใบเสร็จในหน้าปัจจุบัน
            setReceipt({
                ...receipt,
                category_id: parseInt(selectedCategory)
            });
            
            // แสดงข้อความสำเร็จ
            setUpdateSuccess(true);
            setTimeout(() => setUpdateSuccess(false), 3000);
            
        } catch (err: any) {
            console.error("Error updating category:", err);
            setError('ไม่สามารถอัปเดตหมวดหมู่ได้ กรุณาลองใหม่อีกครั้ง');
        } finally {
            setUpdating(false);
        }
    };

    // ฟังก์ชันสำหรับแปลงรูปแบบวันที่เป็นไทย
    const formatDate = (dateStr: string): string => {
        try {
            const date = new Date(dateStr);
            return format(date, 'dd MMMM yyyy', { locale: th });
        } catch (err) {
            return dateStr;
        }
    };

    if (loading) {
        return (
            <Template>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F584F]"></div>
                </div>
            </Template>
        );
    }

    if (error || !receipt) {
        return (
            <Template>
                <div className="flex flex-col items-center justify-center h-96">
                    <h2 className="text-2xl font-semibold text-gray-700">
                        {error || 'ไม่พบข้อมูลใบเสร็จ'}
                    </h2>
                    <Link href="/user/billandreceipt" className="mt-4 text-[#2F584F] hover:underline">
                        กลับไปยังหน้ารายการใบเสร็จ
                    </Link>
                </div>
            </Template>
        );
    }

    return (
        <Template>
            <div className="container mx-auto h-full py-8 ">
                {/* Header with back button */}
                <div className="mb-6">
                    <Link href="/user/billandreceipt" className="inline-flex items-center text-[#2F584F] hover:underline">
                        <FaArrowLeft className="mr-2" />
                        <span>กลับไปยังรายการบิลและใบเสร็จ</span>
                    </Link>
                </div>

                {/* Success message */}
                {updateSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">อัปเดตหมวดหมู่สำเร็จ</span>
                    </div>
                )}

                {/* Main content */}
                <div className='flex gap-6'>
                    <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-full md:w-1/2 mx-auto">
                        {/* Receipt header */}
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold">รายละเอียดใบเสร็จ</h1>
                                    <p className="text-gray-500 mt-1">{receipt.vendor_name || "ไม่ระบุผู้ให้บริการ"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Receipt content */}
                        <div className="p-6">
                            <div>
                                <h2 className="text-lg font-semibold mb-4">ข้อมูลใบเสร็จ</h2>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm text-gray-500">หัวข้อ</p>
                                        <p className="font-medium">{receipt.email_subject || "ไม่มีหัวข้อ"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">จาก</p>
                                        <p className="font-medium">{receipt.email_from}</p>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">ผู้ให้บริการ</p>
                                        <p className="font-medium">{receipt.vendor_name || "ไม่ระบุ"}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500 flex"><LuCalendarDays className='mr-2 text-lg' />วันที่</p>
                                        <p className="font-medium">{formatDate(receipt.receipt_date)}</p>
                                    </div>

                                    <div className='flex space-x-10'>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-500 flex"><HiOutlineTag className='mr-2 text-lg' />ประเภท</p>
                                            <p className="font-medium">
                                                {categories.find(cat => cat.id === receipt.category_id)?.name || "ไม่ระบุหมวดหมู่"}
                                            </p>
                                        </div>
                                        <div className='flex space-x-4 justify-end items-end'>
                                            <div className='w-full md:w-64'>
                                                <label htmlFor="search" className="block text-gray-700 mb-1 text-sm">แก้ไขหมวดหมู่</label>
                                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='เลือกหมวดหมู่' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map(category => (
                                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <button 
                                                className='text-white bg-[#2F584F] px-4 rounded-lg h-9'
                                                onClick={handleUpdateCategory}
                                                disabled={updating || !selectedCategory}
                                            >
                                                {updating ? 'กำลังบันทึก...' : 'บันทึก'}
                                            </button>
                                        </div>
                                    </div>

                                    {receipt.receipt_number && (
                                        <div>
                                            <p className="text-sm text-gray-500">เลขที่ใบเสร็จ</p>
                                            <p className="font-medium">{receipt.receipt_number}</p>
                                        </div>
                                    )}

                                    {receipt.payment_method && (
                                        <div>
                                            <p className="text-sm text-gray-500">วิธีการชำระเงิน</p>
                                            <p className="font-medium">{receipt.payment_method}</p>
                                        </div>
                                    )}

                                    {receipt.notes && (
                                        <div>
                                            <p className="text-sm text-gray-500">บันทึก</p>
                                            <p className="font-medium">{receipt.notes}</p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm text-gray-500">จำนวนเงิน</p>
                                        <p className="font-medium text-xl text-[#2F584F]">
                                            {receipt.amount.toLocaleString()} {receipt.currency}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Template>
    );
}