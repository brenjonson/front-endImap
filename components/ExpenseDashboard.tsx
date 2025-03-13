"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CiCalendar } from "react-icons/ci";
import { IoReceiptOutline } from "react-icons/io5";
import { FaMoneyBillWaveAlt } from "react-icons/fa";


import RecentExpensesList from '@/components/charts/RecentExpensesList';
import ExpenseTrendsChart from '@/components/charts/ExpenseTrendsChart';
import ExpenseCategoriesChart from '@/components/charts/ExpenseCategoriesChart';
import BudgetComparisonChart from '@/components/charts/BudgetComparisonChart';
import Template from '@/components/Template';
import CategorySpendingChart from './charts/CategorySpendingChart';

import {
  getMonthlyExpenses,
  getCategoryExpenses,
  getAnalyticsSummary,
  getCategories,
  getReceipts
} from '@/lib/api';

// Define interfaces
interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
}

interface TimeFrameData {
  labels: string[];
  values: number[];
}

interface CategoryData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
  }>;
}

interface BudgetItem {
  category: string;
  budget: number;
  spent: number;
  percentage: number;
}

export default function Dashboard() {
  // คำสั่ง console.log เพื่อตรวจสอบการทำงาน
  console.log("Dashboard component initialized");

  // States for data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  // States for the actual data
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData>({
    labels: ["ยังไม่มีข้อมูล"],
    datasets: [{
      data: [100],
      backgroundColor: ['#cccccc']
    }]
  });
  const [budgetData, setBudgetData] = useState<BudgetItem[]>([]);

  // Time frame data (daily, weekly, monthly, yearly)
  const [timeFrameData, setTimeFrameData] = useState<TimeFrameData>({
    labels: [],
    values: []
  });

  // Dashboard summary data
  const [summaryData, setSummaryData] = useState({
    todayExpense: 0,
    totalReceipts: 0,
    averageDaily: 0
  });

  // For category-specific data
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
  const [categoryExpenseData, setCategoryExpenseData] = useState<{
    [key: string]: TimeFrameData
  }>({});

  // Debug state
  const [debugInfo, setDebugInfo] = useState<{
    hasCategories: boolean;
    categoryCount: number;
    hasCategoryExpenses: boolean;
    categoryExpenseCount: number;
  }>({
    hasCategories: false,
    categoryCount: 0,
    hasCategoryExpenses: false,
    categoryExpenseCount: 0
  });

  // Fetch data when component mounts or timeFrame changes
  useEffect(() => {
    console.log("Fetching data with timeFrame:", timeFrame);
    fetchData();
  }, [timeFrame]);

  // Function to fetch all necessary data
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Starting to fetch data...");

      // 1. Get all categories
      console.log("Fetching categories...");
      const categoriesData = await getCategories();
      console.log("Categories data:", categoriesData);

      // Store debug info
      setDebugInfo(prev => ({
        ...prev,
        hasCategories: Array.isArray(categoriesData) && categoriesData.length > 0,
        categoryCount: Array.isArray(categoriesData) ? categoriesData.length : 0
      }));

      setCategories([
        { id: 0, name: 'ทุกหมวดหมู่' }, // Add "all" option
        ...categoriesData
      ]);

      // 2. Get monthly expenses for time frame data
      console.log("Fetching monthly expenses...");
      let monthsToFetch = 12;
      if (timeFrame === 'daily') monthsToFetch = 1;
      else if (timeFrame === 'weekly') monthsToFetch = 3;
      else if (timeFrame === 'yearly') monthsToFetch = 60; // 5 years

      const expensesData = await getMonthlyExpenses(undefined, monthsToFetch);
      console.log("Monthly expenses data:", expensesData);

      // 3. Get category expenses data
      console.log("Fetching category expenses...");
      const categoryExpenses = await getCategoryExpenses();
      console.log("Category expenses data:", categoryExpenses);

      // Store debug info
      setDebugInfo(prev => ({
        ...prev,
        hasCategoryExpenses: Array.isArray(categoryExpenses) && categoryExpenses.length > 0,
        categoryExpenseCount: Array.isArray(categoryExpenses) ? categoryExpenses.length : 0
      }));

      // 4. Get analytics summary
      console.log("Fetching analytics summary...");
      const summary = await getAnalyticsSummary();
      console.log("Summary data:", summary);

      

      // 5. Get recent receipts for the expenses list
      console.log("Fetching recent receipts...");
      const receiptsData = await getReceipts({ limit: 10 });
      console.log("Receipts data:", receiptsData);

      // Process the data
      console.log("Processing time frame data...");


      
      // Process time frame data
      let labels: string[] = [];
      let values: number[] = [];

      switch (timeFrame) {
        case 'daily':
          // For daily, we'll use the last 7 days
          // In real implementation, you'd have daily data from API
          // Here we're simulating it based on monthly data
          labels = Array(7).fill(null).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - 6 + i);
            return date.toLocaleDateString('th-TH', { weekday: 'short' });
          });

          // Distribute monthly total across days with some randomness
          const monthlyTotal = expensesData[0]?.total || 0;
          const dailyAvg = monthlyTotal / 30;
          values = labels.map(() => Math.round(dailyAvg * (0.7 + Math.random() * 0.6)));
          break;

        case 'weekly':
          // For weekly, we'll use the last 4 weeks
          // Similar to daily, simulating based on monthly data
          labels = Array(4).fill(null).map((_, i) => `สัปดาห์ ${i + 1}`);

          // Distribute monthly total across weeks with some randomness
          const monthTotal = expensesData[0]?.total || 0;
          const weeklyAvg = monthTotal / 4;
          values = labels.map(() => Math.round(weeklyAvg * (0.8 + Math.random() * 0.4)));
          break;

        case 'monthly':
          // Use actual monthly data from API
          labels = expensesData.map(item => item.month_name);
          values = expensesData.map(item => item.total);
          break;

        case 'yearly':
          // Group monthly data by year
          const yearlyData: { [key: string]: number } = {};
          expensesData.forEach(item => {
            const year = item.year.toString();
            if (!yearlyData[year]) yearlyData[year] = 0;
            yearlyData[year] += item.total;
          });

          // Convert to arrays for chart
          const years = Object.keys(yearlyData).sort();
          labels = years;
          values = years.map(year => yearlyData[year]);
          break;
      }

      setTimeFrameData({ labels, values });

      console.log("Processing category data...");

      // Process category data for pie chart
      if (Array.isArray(categoryExpenses) && categoryExpenses.length > 0) {
        // Normalize category expenses data structure
        const processedCategoryExpenses = categoryExpenses.map(cat => {
          return {
            category_name: cat.category_name || "ไม่ระบุหมวดหมู่",
            total: typeof cat.total === 'number' ? cat.total : 0
          };
        }).filter(cat => cat.category_name && cat.total > 0);

        console.log("Processed category expenses:", processedCategoryExpenses);

        if (processedCategoryExpenses.length > 0) {
          // Create fixed colors for consistent display
          const colors = ['#2F584F', '#8CA29D', '#d1dad8', '#5D7D76', '#A5C6BE', '#404f4c'];

          // Extract totals from category data
          const catLabels = processedCategoryExpenses.map(cat => cat.category_name);
          const catValues = processedCategoryExpenses.map(cat => cat.total);

          // Calculate total for percentage calculation
          const totalValue = catValues.reduce((acc, val) => acc + val, 0);

          // Calculate percentages
          const percentages = catValues.map(value =>
            totalValue > 0 ? Math.round((value / totalValue) * 100) : 0
          );

          console.log("Category percentages:", percentages);

          // Prepare category data for the chart
          setCategoryData({
            labels: catLabels,
            datasets: [{
              data: percentages,
              backgroundColor: colors.slice(0, catLabels.length)
            }]
          });

          // Process budget data - in a real app, you'd have actual budget data
          // Here we're simulating it by assuming budget is 130% of actual spending
          const budgetItems: BudgetItem[] = processedCategoryExpenses.map(cat => {
            const spent = cat.total;
            const budget = Math.round(spent * 1.3); // 30% more than actual spending
            return {
              category: cat.category_name,
              budget,
              spent,
              percentage: Math.round((spent / budget) * 100)
            };
          });

          setBudgetData(budgetItems);
        } else {
          // No valid category data found
          console.log("No valid category data found");
          setCategoryData({
            labels: ["ไม่มีข้อมูล"],
            datasets: [{
              data: [100],
              backgroundColor: ['#cccccc']
            }]
          });

          setBudgetData([{
            category: "ไม่มีข้อมูล",
            budget: 0,
            spent: 0,
            percentage: 0
          }]);
        }
      } else {
        // No category expenses data found
        console.log("No category expenses data found");
        setCategoryData({
          labels: ["ไม่มีข้อมูล"],
          datasets: [{
            data: [100],
            backgroundColor: ['#cccccc']
          }]
        });

        setBudgetData([{
          category: "ไม่มีข้อมูล",
          budget: 0,
          spent: 0,
          percentage: 0
        }]);
      }

      console.log("Processing recent expenses...");

      // Process recent expenses from receipts
      const expenses: Expense[] = receiptsData.map(receipt => {
        // Find category name by id
        const category = categoriesData.find(cat => cat.id === receipt.category_id);

        return {
          id: receipt.id.toString(),
          description: receipt.vendor_name || receipt.email_subject || "ไม่ระบุรายละเอียด",
          amount: receipt.amount,
          date: new Date(receipt.receipt_date),
          category: category?.name || "ไม่ระบุหมวดหมู่"
        };
      });

      setRecentExpenses(expenses);

      console.log("Processing summary data...");

      // คำนวณค่าเฉลี่ยรายวันและกำหนดค่า summaryData
      const totalExpense = summary?.total_expense || 0;
      const receiptCount = summary?.receipt_count || 0;

      // คำนวณค่าเฉลี่ยรายวัน
      const averageDaily = receiptCount > 0 ? Math.round(totalExpense / receiptCount) : 0;

      // กำหนดค่า summaryData
      setSummaryData({
        todayExpense: totalExpense,  // ใช้ total_expense จาก API response แทนรายจ่ายวันนี้
        totalReceipts: receiptCount,
        averageDaily: averageDaily
      });

      console.log("Processing category-specific data...");

      // Process category-specific expense data
      // In a real app, you'd have API endpoints that return data per category
      // Here we're simulating it based on overall data
      const categoryExpenseData: { [key: string]: TimeFrameData } = {};

      // Add "all categories" data
      categoryExpenseData['all'] = { labels, values };

      // For each category, create simulated data based on its percentage of the total
      if (Array.isArray(categoryExpenses) && categoryExpenses.length > 0) {
        const totalExpense = categoryExpenses.reduce((sum, cat) => sum + (cat.total || 0), 0);

        categoriesData.forEach(category => {
          // Find this category in categoryExpenses
          const catData = categoryExpenses.find(cat => cat.category_name === category.name);
          const catTotal = catData ? catData.total : 0;

          // Calculate this category's percentage of total expenses
          const percentage = totalExpense > 0 ? catTotal / totalExpense : 0;

          // Apply percentage to overall values with slight randomness
          const categoryValues = values.map(value => {
            return Math.round(value * percentage * (0.9 + Math.random() * 0.2));
          });

          categoryExpenseData[category.id.toString()] = {
            labels,
            values: categoryValues
          };
        });
      }

      setCategoryExpenseData(categoryExpenseData);

      console.log("Data fetching complete!");
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      setLoading(false);

      // กำหนดค่าเริ่มต้นในกรณีที่เกิดข้อผิดพลาด
      setCategoryData({
        labels: ["ไม่มีข้อมูล"],
        datasets: [{
          data: [100],
          backgroundColor: ['#cccccc']
        }]
      });

      setBudgetData([{
        category: "ไม่มีข้อมูล",
        budget: 0,
        spent: 0,
        percentage: 0
      }]);
    }
  };

  // Function to get current category data based on selection
  const getCurrentCategoryData = () => {
    return categoryExpenseData[selectedCategory] || timeFrameData;
  };

  // Function to get category name by id
  const getCategoryNameById = (id: string) => {
    if (id === 'all' || id === '0') return 'ทุกหมวดหมู่';
    const category = categories.find(cat => cat.id.toString() === id);
    return category?.name || 'ไม่ระบุหมวดหมู่';
  };

  // Function to get category percentage
  const getCategoryPercentage = (categoryName: string): number => {
    const catIndex = categoryData.labels.findIndex(label => label === categoryName);
    if (catIndex >= 0 && categoryData.datasets[0].data[catIndex] !== undefined) {
      return categoryData.datasets[0].data[catIndex];
    }
    return 0;
  };

  return (
    <Template>
      <div className='border w-full h-full rounded-lg'>
        <div className='flex flex-col sm:flex-row justify-between items-center p-5'>
          <h1 className='text-3xl font-bold'>แดชบอร์ด</h1>
          <div className='mt-4 sm:mt-0'>
            <button
              onClick={fetchData}
              className='bg-[#2F584F] hover:bg-[#8CA29D] text-white py-2 px-4 rounded flex items-center'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              รีเฟรชข้อมูล
            </button>
          </div>
        </div>

        {/* Loading or error states */}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F584F]"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className='p-5'>
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-3 sm:p-4 flex items-center space-x-4">
                  <div className="rounded-full bg-green-100 p-2">
                    <CiCalendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                  <div>
                    {/* แก้ไขจาก "รายจ่ายวันนี้" เป็น "รายจ่ายทั้งหมด" */}
                    <p className="text-sm font-medium text-green-600">รายจ่ายทั้งหมด</p>
                    <h3 className="text-md sm:text-lg font-bold">฿{summaryData.todayExpense.toLocaleString()}</h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardContent className="p-3 sm:p-4 flex items-center space-x-4">
                  <div className="rounded-full bg-yellow-100 p-2">
                    <IoReceiptOutline className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-yellow-600">บิลทั้งหมด</p>
                    <h3 className="text-sm sm:text-lg font-bold">{summaryData.totalReceipts} รายการ</h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                <CardContent className="p-3 sm:p-4 flex items-center space-x-4">
                  <div className="rounded-full bg-indigo-100 p-2">
                    <FaMoneyBillWaveAlt className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-indigo-600">รายจ่ายเฉลี่ย</p>
                    <h3 className="text-sm sm:text-lg font-bold">฿{summaryData.averageDaily.toLocaleString()}/รายการ</h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for different views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList>
                <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
                <TabsTrigger value="by-category">แยกตามหมวดหมู่</TabsTrigger>
              </TabsList>

              {/* Overview tab - similar to the original layout */}
              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 h-auto">
                      <ExpenseTrendsChart
                        timeFrame={timeFrame}
                        setTimeFrame={setTimeFrame}
                        data={timeFrameData}
                      />
                    </div>

                    <div className="h-auto">
                      <ExpenseCategoriesChart data={categoryData} />
                    </div>

                    <div className="h-auto">
                      <BudgetComparisonChart budgetData={budgetData} />
                    </div>
                  </div>

                  <div className="h-auto">
                    <RecentExpensesList expenses={recentExpenses} />
                  </div>
                </div>
              </TabsContent>

              {/* By-category tab */}
              <TabsContent value="by-category">
                <div className="mb-4 flex flex-col md:flex-row items-center gap-4">
                  <div className="w-full md:w-auto">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full md:w-auto px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F584F]"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id.toString()}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-lg font-medium text-gray-700">
                    {getCategoryNameById(selectedCategory)}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 h-auto">
                      <ExpenseTrendsChart
                        timeFrame={timeFrame}
                        setTimeFrame={setTimeFrame}
                        data={getCurrentCategoryData()}
                      />
                    </div>

                    {selectedCategory === 'all' || selectedCategory === '0' ? (
                      <>
                        <div className="h-auto">
                          <ExpenseCategoriesChart data={categoryData} />
                        </div>

                        <div className="h-auto">
                          <BudgetComparisonChart budgetData={budgetData} />
                        </div>
                      </>
                    ) : (
                      <div className="md:col-span-2 h-auto">
                        <Card>
                          <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">รายละเอียดหมวดหมู่: {getCategoryNameById(selectedCategory)}</h2>

                            {budgetData.filter(b => b.category === getCategoryNameById(selectedCategory)).map((item, index) => (
                              <div key={index} className="mb-6">
                                <div className="flex justify-between mb-2">
                                  <span className="font-medium">งบประมาณ:</span>
                                  <span>฿{item.budget.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                  <span className="font-medium">ใช้ไปแล้ว:</span>
                                  <span>฿{item.spent.toLocaleString()} ({item.percentage}%)</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                  <span className="font-medium">คงเหลือ:</span>
                                  <span>฿{(item.budget - item.spent).toLocaleString()}</span>
                                </div>

                                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                                  <div
                                    className="bg-[#2F584F] h-2 rounded-full"
                                    style={{ width: `${item.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}

                            <div className="mt-6">
                              <h3 className="font-medium mb-2">รายการค่าใช้จ่ายล่าสุดในหมวดหมู่นี้</h3>
                              {recentExpenses
                                .filter(expense => expense.category === getCategoryNameById(selectedCategory))
                                .slice(0, 3)
                                .map((expense, index) => (
                                  <div key={index} className="flex justify-between py-2 border-b">
                                    <div>
                                      <div className="font-medium">{expense.description}</div>
                                      <div className="text-sm text-gray-500">
                                        {expense.date.toLocaleDateString('th-TH')}
                                      </div>
                                    </div>
                                    <div className="font-medium">
                                      ฿{expense.amount.toLocaleString()}
                                    </div>
                                  </div>
                                ))}

                              {recentExpenses.filter(expense => expense.category === getCategoryNameById(selectedCategory)).length === 0 && (
                                <div className="text-gray-500 text-center py-4">
                                  ไม่พบรายการในหมวดหมู่นี้
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>




                  <div className="h-auto">
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-xl font-bold mb-4">สัดส่วนค่าใช้จ่าย</h2>

                        {categories
                          .filter(cat => cat.id !== 0) // Exclude "all" category
                          .map((category, index) => {
                            // Get this category's data
                            const catBudget = budgetData.find(b => b.category === category.name);
                            const spent = catBudget?.spent || 0;
                            const percentage = getCategoryPercentage(category.name);

                            return (
                              <div
                                key={index}
                                className={`p-3 rounded-md mb-3 cursor-pointer ${selectedCategory === category.id.toString()
                                  ? 'bg-[#2F584F]/10 border border-[#2F584F]/30'
                                  : 'hover:bg-gray-100'
                                  }`}
                                onClick={() => setSelectedCategory(category.id.toString())}
                              >
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">{category.name}</span>
                                  <span>{percentage}%</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-1">
                                  ฿{spent.toLocaleString()}
                                </div>
                                <div className="w-full bg-gray-200 h-1.5 rounded-full">
                                  <div
                                    className="bg-[#2F584F] h-1.5 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                      </CardContent>
                    </Card>

                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </Template>
  );
}