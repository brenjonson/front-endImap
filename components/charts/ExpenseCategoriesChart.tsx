// แสดงการกระจายค่าใช้จ่ายตามหมวดหมู่
"use client";
import React, { useEffect, useState } from 'react';
import { ChartWrapper } from './ChartWrapper';
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

import { getCategoryCategories } from '@/lib/api';

// Custom pie chart component using divs
interface PieChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
      backgroundColor: string[]
    }>
  };
}

const CustomPieChart = ({ data }: PieChartProps) => {
  // คำนวณผลรวมทั้งหมดเพื่อใช้คำนวณเปอร์เซ็นต์
  const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);

  // ถ้าไม่มีข้อมูล หรือผลรวมเป็น 0 ให้แสดงข้อความแจ้งเตือน
  if (data.labels.length === 0 || total === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center p-4">
        <div className="text-gray-400">ยังไม่มีข้อมูลค่าใช้จ่ายในขณะนี้</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row h-fit">
      <div className="w-full sm:w-1/2 flex flex-col justify-center items-center pb-4 sm:pb-0">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40">
          {data.datasets[0].data.map((value, index) => {
            const percentage = (value / total) * 100;
            let cumulativePercentage = 0;

            for (let i = 0; i < index; i++) {
              cumulativePercentage += (data.datasets[0].data[i] / total) * 100;
            }

            return (
              <div
                key={index}
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: `conic-gradient(transparent ${cumulativePercentage}%, ${data.datasets[0].backgroundColor[index]} ${cumulativePercentage}%, ${data.datasets[0].backgroundColor[index]} ${cumulativePercentage + percentage}%, transparent ${cumulativePercentage + percentage}%)`,
                  borderRadius: '50%'
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="w-full sm:w-1/2 flex flex-col justify-center">
        {data.labels.map((label, index) => {
          const percentage = Math.round((data.datasets[0].data[index] / total) * 100);
          return (
            <div key={index} className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <div
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm"
                style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
              />
              <span className="text-xs sm:text-sm truncate">{label}</span>
              <span className="text-xs sm:text-sm text-muted-foreground ml-auto">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// สร้าง interface สำหรับข้อมูลหมวดหมู่ค่าใช้จ่าย
interface CategoryExpense {
  category_id: number;
  category_name: string;
  total: number;
}

// สร้าง interface สำหรับ component props
interface ExpenseCategoriesChartProps {
  startDate?: string;
  endDate?: string;
}

const COLORS = [
  '#2F584F',  // Primary brand color
  '#3E7268',  // Lighter shade
  '#1F3B34',  // Darker shade
  '#4D8C7F',  // Another light variant
  '#567D73',  // Mid tone
  '#698B83',  // Soft tone
  '#7A998F',  // Muted tone
  '#8BA79D'   // Lightest shade
];

const formatCurrency = (value) => `${value.toLocaleString()} บาท`;

const ExpenseCategoriesChart = ({ startDate, endDate }: ExpenseCategoriesChartProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpense[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ฟังก์ชันสำหรับดึงข้อมูลจาก API
    const fetchCategoryExpenses = async () => {
      try {
        setLoading(true);
        const data = await getCategoryCategories();
        setCategoryExpenses(data);
      } catch (err) {
        console.error("Error fetching category expenses:", err);
        setError(err.response?.data?.detail || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    // เรียกฟังก์ชันดึงข้อมูลเมื่อ component mount หรือเมื่อ params เปลี่ยน
    fetchCategoryExpenses();
  }, [startDate, endDate]);

  // ถ้ากำลังโหลดข้อมูล
  if (loading) {
    return (
      <ChartWrapper
        title="หมวดหมู่ค่าใช้จ่าย"
        description="การกระจายค่าใช้จ่ายตามหมวดหมู่"
        className="h-[400px]"
      >
        <div className="flex h-full items-center justify-center">
          <div className="text-gray-400">กำลังโหลดข้อมูล...</div>
        </div>
      </ChartWrapper>
    );
  }

  // ถ้ามีข้อผิดพลาด
  if (error) {
    return (
      <ChartWrapper
        title="หมวดหมู่ค่าใช้จ่าย"
        description="การกระจายค่าใช้จ่ายตามหมวดหมู่"
        className="h-[400px]"
      >
        <div className="flex h-full items-center justify-center">
          <div className="text-red-500">เกิดข้อผิดพลาด: {error}</div>
        </div>
      </ChartWrapper>
    );
  }

  // ถ้าไม่มีข้อมูล
  if (categoryExpenses.length === 0) {
    return (
      <ChartWrapper
        title="หมวดหมู่ค่าใช้จ่าย"
        description="การกระจายค่าใช้จ่ายตามหมวดหมู่"
        className="h-[400px]"
      >
        <div className="flex h-full items-center justify-center">
          <div className="text-gray-400">ยังไม่มีข้อมูลค่าใช้จ่ายในขณะนี้</div>
        </div>
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper
      title="หมวดหมู่ค่าใช้จ่าย"
      description="การกระจายค่าใช้จ่ายตามหมวดหมู่"
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={categoryExpenses}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#2F584F"
            dataKey="total"
            nameKey="category_name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {categoryExpenses.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), 'ค่าใช้จ่าย']}
          />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default ExpenseCategoriesChart;
export { CustomPieChart };