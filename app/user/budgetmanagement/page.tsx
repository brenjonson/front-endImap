"use client";
import React, { useState, useEffect } from 'react';
import Template from "@/components/Template";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BudgetFormModal from '@/components/budget/BudgetFormModal';
import { getBudgetComparisons, deleteBudget } from '@/lib/api';
import EditBudgetModal from '@/components/budget/EditBudgetModal';
import { BudgetWithSpent } from '@/types/budget';
import { FaPlus, FaPencilAlt, FaTrashAlt, FaChartLine, FaCalendarAlt, FaMoneyBillWave, FaWallet, FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';


function Budgetmanage() {
  const [budgetData, setBudgetData] = useState<BudgetWithSpent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetWithSpent | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'details'>('details');
  
  // ใช้เดือนและปีปัจจุบัน
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // เดือนปัจจุบัน (1-12)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());    // ปีปัจจุบัน
  
  // ดึงข้อมูลงบประมาณ
  useEffect(() => {
    fetchBudgetData();
  }, [selectedMonth, selectedYear]);
  
  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const data = await getBudgetComparisons(selectedMonth, selectedYear);
      setBudgetData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching budget data:", err);
      setError("ไม่สามารถดึงข้อมูลงบประมาณได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };
  
  // คำนวณสรุปงบประมาณ
  const calculateSummary = () => {
    const totalBudget = budgetData.reduce((sum, item) => sum + item.amount, 0);
    const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);
    const totalRemaining = totalBudget - totalSpent;
    const averagePercentage = budgetData.length > 0 
      ? Math.round(budgetData.reduce((sum, item) => sum + item.percentage, 0) / budgetData.length) 
      : 0;
      
    return { totalBudget, totalSpent, totalRemaining, averagePercentage };
  };
  
  // ลบงบประมาณ
  const handleDeleteBudget = async (budgetId: number) => {
    try {
      await deleteBudget(budgetId);
      fetchBudgetData();
      setConfirmDelete(null);
      toast({
        title: "ลบงบประมาณสำเร็จ",
        description: "ระบบได้ลบงบประมาณเรียบร้อยแล้ว",
        duration: 3000,
      });
    } catch (err) {
      console.error("Error deleting budget:", err);
      setError("ไม่สามารถลบงบประมาณได้ กรุณาลองใหม่อีกครั้ง");
    }
  };
  
  // เปิดฟอร์มแก้ไข
  const handleEditBudget = (budget: BudgetWithSpent) => {
    setSelectedBudget(budget);
    setShowEditModal(true);
  };
  
  // เปิดฟอร์มเพิ่มใหม่
  const handleAddBudget = () => {
    setShowAddModal(true);
  };
  
  // ชื่อเดือนภาษาไทย
  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  
  // คำนวณสรุป
  const summary = calculateSummary();

  // Determine progress bar color based on percentage
  const getProgressBarColor = (percentage: number) => {
    if (percentage < 60) return 'bg-emerald-500'; // สีเขียวมรกต
    if (percentage < 80) return 'bg-amber-500'; // สีเหลืองอำพัน
    return 'bg-rose-500'; // สีชมพูเข้ม
  };

  // ฟังก์ชันโหลดข้อมูลใหม่พร้อมเอฟเฟกต์
  const handleRefresh = () => {
    setLoading(true);
    fetchBudgetData();
  };

  return (
    <Template>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        {/* Header Section with background gradient */}
        <div className="bg-gradient-to-r from-[#2F584F] to-[#4a6f68] text-white p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FaMoneyBillWave className="text-3xl mr-3" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">การจัดการงบประมาณ</h1>
                <p className="text-white/80 text-sm mt-1">
                  จัดการและติดตามงบประมาณรายเดือนของคุณ
                </p>
              </div>
            </div>
            <Button
              onClick={handleAddBudget}
              className="bg-white text-[#2F584F] hover:bg-gray-100 shadow-md py-2 px-4 rounded-md flex items-center"
            >
              <FaPlus className="mr-2" /> ตั้งงบประมาณใหม่
            </Button>
          </div>

          {/* Navigation tabs */}
          <div className="flex mt-8 border-b border-white/20">
            <button
              className={`px-4 py-2 font-medium text-sm mr-4 ${
                activeTab === 'details' 
                  ? 'border-b-2 border-white text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setActiveTab('details')}
            >
              รายละเอียดงบประมาณ
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'summary' 
                  ? 'border-b-2 border-white text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setActiveTab('summary')}
            >
              ภาพรวมงบประมาณ
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-gray-50 p-4 border-b flex flex-wrap items-center justify-between">
          <div className="flex flex-wrap items-center gap-4 mb-3 md:mb-0">
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-600 mr-2">เดือน:</span>
              <div className="w-40">
                <Select 
                  value={selectedMonth.toString()} 
                  onValueChange={(value) => setSelectedMonth(parseInt(value))}
                >
                  <SelectTrigger className="border-gray-300 bg-white h-9">
                    <SelectValue placeholder="เลือกเดือน" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthNames.map((month, index) => (
                      <SelectItem key={index} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">ปี:</span>
              <div className="w-32">
                <Select 
                  value={selectedYear.toString()} 
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger className="border-gray-300 bg-white h-9">
                    <SelectValue placeholder="เลือกปี" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2023, 2024, 2025, 2026, 2027].map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            onClick={handleRefresh}
            variant="outline"
            className="border-gray-300 text-gray-700 h-9"
          >
            <svg 
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            รีเฟรช
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="m-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <FaExclamationTriangle className="text-red-500 flex-shrink-0 mt-0.5 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-4">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F584F] mb-4"></div>
              <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
            </div>
          ) : budgetData.length > 0 ? (
            activeTab === 'details' ? (
              <>
                {/* Budget Cards - Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {budgetData.map((item) => (
                    <Card 
                      key={item.id} 
                      className="overflow-hidden transition-all duration-200 hover:shadow-md"
                    >
                      <div className={`h-1 ${getProgressBarColor(item.percentage)}`}></div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-800">{item.category_name}</h3>
                            <p className="text-sm text-gray-500 mt-1">งบประมาณ {item.amount.toLocaleString()} บาท</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.percentage < 60 
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.percentage < 80
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-rose-100 text-rose-800'
                          }`}>
                            {item.percentage}%
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="relative pt-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-gray-100">
                                ใช้ไปแล้ว
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-teal-600">
                                {item.spent.toLocaleString()} บาท
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mt-2 text-xs flex rounded bg-gray-200">
                            <div
                              style={{ width: `${item.percentage}%` }}
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressBarColor(item.percentage)}`}
                            ></div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                          <button 
                            onClick={() => handleEditBudget(item)}
                            className="text-sky-600 text-sm hover:text-sky-700 flex items-center transition-colors"
                          >
                            <FaPencilAlt className="mr-1" size={12} /> แก้ไข
                          </button>
                          <button 
                            onClick={() => setConfirmDelete(item.id)}
                            className="text-rose-600 text-sm hover:text-rose-700 flex items-center transition-colors"
                          >
                            <FaTrashAlt className="mr-1" size={12} /> ลบ
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Budget Summary View */}
                <div className="bg-white rounded-lg shadow-sm mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    {/* Total Budget Card */}
                    <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100">
                      <div className="flex items-start">
                        <div className="p-3 rounded-full bg-[#e7f0ed] mr-4">
                          <FaMoneyBillWave className="text-[#2F584F] text-xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">งบประมาณทั้งหมด</p>
                          <p className="text-2xl font-bold text-gray-800">{summary.totalBudget.toLocaleString()} บาท</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Spent Budget Card */}
                    <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100">
                      <div className="flex items-start">
                        <div className="p-3 rounded-full bg-[#e7f0ed] mr-4">
                          <FaWallet className="text-[#2F584F] text-xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">ใช้จ่ายไปแล้ว</p>
                          <p className="text-2xl font-bold text-gray-800">{summary.totalSpent.toLocaleString()} บาท</p>
                          <p className="text-sm text-gray-500 mt-1">{summary.averagePercentage}% ของงบประมาณ</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Remaining Budget Card */}
                    <div className="p-6">
                      <div className="flex items-start">
                        <div className={`p-3 rounded-full ${summary.totalRemaining >= 0 ? 'bg-emerald-100' : 'bg-rose-100'} mr-4`}>
                          <FaChartLine className={`${summary.totalRemaining >= 0 ? 'text-emerald-600' : 'text-rose-600'} text-xl`} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">คงเหลือ</p>
                          <p className={`text-2xl font-bold ${summary.totalRemaining >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {Math.abs(summary.totalRemaining).toLocaleString()} บาท
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {summary.totalRemaining >= 0 ? 'ภายในงบประมาณ' : 'เกินงบประมาณ'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations and Insights */}
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <FaInfoCircle className="text-[#2F584F] mr-2" />
                      <h2 className="text-xl font-bold text-gray-800">ข้อมูลเชิงลึกและคำแนะนำ</h2>
                    </div>
                    
                    <div className="space-y-4">
                      {budgetData.some(item => item.percentage >= 90) && (
                        <div className="flex items-start p-4 bg-rose-50 rounded-md">
                          <FaExclamationTriangle className="text-rose-600 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h3 className="font-medium text-rose-800">หมวดหมู่ที่ใกล้เกินงบประมาณ</h3>
                            <p className="mt-1 text-sm text-rose-700">
                              หมวดหมู่ <span className="font-medium">
                                {budgetData.filter(item => item.percentage >= 90).map(item => item.category_name).join(', ')}
                              </span> มีการใช้จ่ายเกิน 90% ของงบประมาณแล้ว ควรพิจารณาการใช้จ่ายในส่วนนี้
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {budgetData.some(item => item.percentage <= 30) && (
                        <div className="flex items-start p-4 bg-sky-50 rounded-md">
                          <FaInfoCircle className="text-sky-600 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h3 className="font-medium text-sky-800">หมวดหมู่ที่ใช้งบประมาณน้อย</h3>
                            <p className="mt-1 text-sm text-sky-700">
                              คุณใช้งบประมาณ <span className="font-medium">
                                {budgetData.filter(item => item.percentage <= 30).map(item => item.category_name).join(', ')}
                              </span> เพียง {Math.round(budgetData.filter(item => item.percentage <= 30).reduce((sum, item) => sum + item.percentage, 0) / 
                              budgetData.filter(item => item.percentage <= 30).length)}% ซึ่งต่ำกว่าเป้าหมาย
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start p-4 bg-gray-50 rounded-md">
                        <FaCheckCircle className="text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium text-gray-800">ภาพรวมการใช้งบประมาณ</h3>
                          <p className="mt-1 text-sm text-gray-700">
                            โดยรวมคุณใช้งบประมาณไปแล้ว <span className="font-medium">{summary.averagePercentage}%</span> ของงบประมาณทั้งหมด
                            {summary.averagePercentage > 80 
                              ? ' ซึ่งค่อนข้างสูง ควรระมัดระวังการใช้จ่ายในช่วงที่เหลือของเดือน' 
                              : summary.averagePercentage < 50 
                                ? ' ซึ่งอยู่ในเกณฑ์ดี คุณมีเงินเหลือสำหรับการใช้จ่ายในส่วนที่จำเป็น' 
                                : ' ซึ่งอยู่ในเกณฑ์ปกติ'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMoneyBillWave className="text-gray-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">ยังไม่มีงบประมาณในเดือนนี้</h3>
              <p className="text-gray-500 mb-6 max-w-lg mx-auto">
                การตั้งงบประมาณจะช่วยให้คุณติดตามและควบคุมการใช้จ่ายได้ดีขึ้น วางแผนการเงินอย่างมีประสิทธิภาพและบรรลุเป้าหมายทางการเงิน
              </p>
              <Button
                onClick={handleAddBudget}
                className="bg-[#2F584F] hover:bg-[#3a6a60] text-white font-medium py-2 px-6 rounded-md shadow-sm"
              >
                <FaPlus className="mr-2 inline-block" /> เพิ่มงบประมาณแรกของคุณ
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Confirmation Dialog for Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <FaTrashAlt className="text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">ยืนยันการลบงบประมาณ</h3>
            </div>
            <p className="text-gray-500 mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบงบประมาณนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setConfirmDelete(null)}
                variant="outline"
                className="px-4 py-2 border-gray-300 text-gray-700"
              >
                ยกเลิก
              </Button>
              <Button
                onClick={() => handleDeleteBudget(confirmDelete)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white flex items-center"
              >
                <FaTrashAlt className="mr-2" /> ลบงบประมาณ
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal for adding new budget */}
      {showAddModal && (
        <BudgetFormModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchBudgetData}
          currentMonth={selectedMonth}
          currentYear={selectedYear}
        />
      )}
      
      {showEditModal && selectedBudget && (
        <EditBudgetModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchBudgetData}
          budget={selectedBudget}
        />
      )}
    </Template>
  );
}

export default Budgetmanage;