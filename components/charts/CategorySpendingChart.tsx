import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCategoryExpenses } from '@/lib/api';

const CategorySpendingChart = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('pie');

  // สีสำหรับกราฟแต่ละหมวดหมู่
  const COLORS = ['#2F584F', '#8CA29D', '#5D7D76', '#A5C6BE', '#1E3932', '#4F6A64'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getCategoryExpenses();
        
        // แปลงข้อมูลให้เหมาะกับการแสดงผลในรูปแบบกราฟ
        const formattedData = data.map((item, index) => ({
          name: item.category_name || 'ไม่ระบุหมวดหมู่',
          value: item.total,
          percentage: item.percentage,
          color: COLORS[index % COLORS.length]
        }));
        
        setChartData(formattedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching category expenses:', err);
        setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // ฟังก์ชันสำหรับจัดรูปแบบจำนวนเงิน
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Custom Tooltip สำหรับ PieChart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatMoney(payload[0].value)}</p>
          <p className="text-xs text-gray-500">{payload[0].payload.percentage}% ของค่าใช้จ่ายทั้งหมด</p>
        </div>
      );
    }
    return null;
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-semibold">ค่าใช้จ่ายตามหมวดหมู่</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F584F]"></div>
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-semibold">ค่าใช้จ่ายตามหมวดหมู่</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-red-500 text-center">
            <p>{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-[#2F584F] text-white rounded-md hover:bg-[#214237]"
              onClick={() => window.location.reload()}
            >
              ลองใหม่
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render empty state
  if (chartData.length === 0) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-semibold">ค่าใช้จ่ายตามหมวดหมู่</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-gray-500 text-center">
            <p>ไม่มีข้อมูลค่าใช้จ่ายในขณะนี้</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-semibold">ค่าใช้จ่ายตามหมวดหมู่</CardTitle>
          <Tabs value={chartType} onValueChange={setChartType} className="w-48">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pie">วงกลม</TabsTrigger>
              <TabsTrigger value="bar">แท่ง</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 md:h-80">
          <TabsContent value="pie" className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  formatter={(value, entry) => (
                    <span className="text-xs md:text-sm">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="bar" className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis 
                  tickFormatter={(value) => new Intl.NumberFormat('th-TH').format(value)}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value) => [formatMoney(value), 'จำนวนเงิน']}
                  labelFormatter={(label) => `หมวดหมู่: ${label}`}
                />
                <Bar dataKey="value" name="จำนวนเงิน">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </div>
        
        {/* Summary Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="text-left pb-2">หมวดหมู่</th>
                <th className="text-right pb-2">จำนวนเงิน</th>
                <th className="text-right pb-2">%</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-2 flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                    {item.name}
                  </td>
                  <td className="py-2 text-right">{formatMoney(item.value)}</td>
                  <td className="py-2 text-right">{item.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategorySpendingChart;