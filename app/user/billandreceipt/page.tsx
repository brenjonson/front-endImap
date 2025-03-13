"use client";
import React, { useState, useEffect } from 'react';
import Template from '@/components/Template';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaSearch, FaReceipt, FaShoppingBag, FaGamepad, FaUniversity, FaEllipsisH } from 'react-icons/fa';
import { DatePicker } from "@/components/DatePicker"
import Link from 'next/link';
import { getReceipts, getCategories } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

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
    created_at: string;
}

interface Category {
    id: number;
    name: string;
    color: string;
    icon: string | null;
}

export default function BillAndReceipt() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'date-desc' | 'amount-desc'>('date-desc');
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ดึงข้อมูลใบเสร็จและหมวดหมู่
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                // ดึงข้อมูลหมวดหมู่
                const categoriesData = await getCategories();
                setCategories(categoriesData);
                
                // สร้าง query parameters สำหรับ API
                const params: any = { limit: 100 };
                
                if (startDate) {
                    params.start_date = format(startDate, 'yyyy-MM-dd');
                }
                
                if (endDate) {
                    params.end_date = format(endDate, 'yyyy-MM-dd');
                }
                
                // ดึงข้อมูลใบเสร็จ
                const receiptsData = await getReceipts(params);
                setReceipts(receiptsData);
                setFilteredReceipts(receiptsData);
                setError(null);
            } catch (err: any) {
                console.error("Error fetching data:", err);
                setError('ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [startDate, endDate]);

    // Filter and sort receipts when search, category, or sort changes
    useEffect(() => {
        let filtered = [...receipts];

        // Apply category filter
        if (selectedCategory !== 'all') {
            const categoryId = parseInt(selectedCategory);
            filtered = filtered.filter(receipt => receipt.category_id === categoryId);
        }

        // Apply search filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(receipt =>
                (receipt.email_subject?.toLowerCase().includes(query) || false) ||
                (receipt.vendor_name?.toLowerCase().includes(query) || false) ||
                (receipt.email_from?.toLowerCase().includes(query) || false)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            if (sortBy === 'date-desc') {
                return new Date(b.receipt_date).getTime() - new Date(a.receipt_date).getTime();
            } else if (sortBy === 'amount-desc') {
                return b.amount - a.amount;
            }
            return 0;
        });

        setFilteredReceipts(filtered);
    }, [searchQuery, selectedCategory, sortBy, receipts]);

    // Reset filters
    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSortBy('date-desc');
        setStartDate(undefined);
        setEndDate(undefined);
    };

    // Format date to Thai locale
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Get category name by id
    const getCategoryName = (categoryId: number | null): string => {
        if (!categoryId) return "ไม่ระบุหมวดหมู่";
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : "ไม่ระบุหมวดหมู่";
    };

    // Get category icon component by id
    const getCategoryIcon = (categoryId: number | null) => {
        if (!categoryId) return <FaEllipsisH className="text-gray-500" />;
        
        const category = categories.find(cat => cat.id === categoryId);
        if (!category) return <FaEllipsisH className="text-gray-500" />;
        
        // ตรวจสอบชื่อหมวดหมู่เพื่อเลือก icon ที่เหมาะสม
        switch(category.name) {
            case 'ช้อปปิ้ง':
                return <FaShoppingBag className="text-blue-500" />;
            case 'ความบันเทิง':
                return <FaGamepad className="text-purple-500" />;
            case 'ธนาคาร':
                return <FaUniversity className="text-green-500" />;
            default:
                return <FaEllipsisH className="text-gray-500" />;
        }
    };

    return (
        <Template>
            <div className='border size-full rounded-lg'>
                <div className='flex flex-col sm:flex-row justify-between items-center p-5'>
                    <h1 className='text-3xl font-bold'>รายการบิลและใบเสร็จ</h1>
                    <Button
                        onClick={resetFilters}
                        className='bg-[#2F584F] hover:bg-[#8CA29D] text-white py-2 px-4 rounded flex items-center mt-5 sm:mt-0'
                    >
                        รีเซ็ตตัวกรอง
                    </Button>
                </div>

                <div className='p-5'>
                    <div className='flex flex-col md:flex-row gap-4 mb-4'>
                        {/* Search input */}
                        <div className='flex-1 relative'>
                            <label htmlFor="search" className="block text-gray-700 mb-2">ค้นหา</label>
                            <div className='absolute inset-y-13 left-0 pl-3 flex items-center pointer-events-none'>
                                <FaSearch className='text-gray-400' />
                            </div>
                            <input
                                type='text'
                                placeholder='ค้นหาบิลหรือใบเสร็จ...'
                                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F584F] focus:border-transparent'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category dropdown */}
                        <div className='w-full md:w-64'>
                            <label htmlFor="category" className="block text-gray-700 mb-2">หมวดหมู่</label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='เลือกหมวดหมู่' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>ทั้งหมด</SelectItem>
                                    {categories.map(category => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full md:w-64">
                            <DatePicker
                                date={startDate}
                                onSelect={setStartDate}
                                label="ตั้งแต่วันที่"
                            />
                        </div>

                        <div className="w-full md:w-64">
                            <DatePicker
                                date={endDate}
                                onSelect={setEndDate}
                                label="ถึงวันที่"
                            />
                        </div>

                        {/* Sort options */}
                        <div className='w-full md:w-auto flex items-end mb-1'>
                            <Tabs defaultValue='date-desc' value={sortBy} onValueChange={(value) => setSortBy(value as 'date-desc' | 'amount-desc')} className='w-full'>                                    
                                <TabsList className='grid w-full grid-cols-2'>
                                    <TabsTrigger value='date-desc'>วันที่ล่าสุด</TabsTrigger>
                                    <TabsTrigger value='amount-desc'>ราคาสูงสุด</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>

                    {/* Results */}
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F584F]"></div>
                        </div>
                    ) : error ? (
                        <div className="mt-6 text-center text-red-500">
                            <p>{error}</p>
                        </div>
                    ) : filteredReceipts.length > 0 ? (
                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้ให้บริการ</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนเงิน</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมวดหมู่</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รายละเอียด</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredReceipts.map((receipt) => (
                                        <tr key={receipt.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{formatDate(receipt.receipt_date)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{receipt.vendor_name || "ไม่ระบุ"}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2F584F]">
                                                {receipt.amount.toLocaleString()} {receipt.currency}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-gray-100">
                                                        {getCategoryIcon(receipt.category_id)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {getCategoryName(receipt.category_id)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{receipt.email_subject || receipt.notes || "-"}</div>
                                            </td>
                                            
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <Link href={`/user/billandreceipt/receipt/${receipt.id}`}>
                                                    <button className='border border-[#4b746b] rounded-md px-3 py-1 text-sm text-[#2F584F] hover:bg-gray-100'>
                                                        ดูรายละเอียด
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className='mt-6 text-center text-gray-500'>
                            <p>ไม่พบรายการบิลหรือใบเสร็จ</p>
                        </div>
                    )}
                </div>
            </div>
        </Template>
    );
}