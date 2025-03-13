'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DesktopNavbar from '@/components/navbar/DesktopNavbar';
import MobileNavbar from '@/components/navbar/MobileNavbar';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      setLoading(false);
      return;
    }
    
    try {
      // Here you would call your API endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      }
      
      // Redirect to login page after successful registration
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <DesktopNavbar />
      <MobileNavbar />
      
      {/* Background animation similar to main page */}
      <div className="absolute inset-0 flex justify-center items-center -z-10">
        <div className="relative w-[40vmin] h-[40vmin] bg-[#2F584F]/50 rounded-[100%] blur-[50px] sm:blur-[200px] animate-[one_90s_infinite]"></div>
      </div>
      <div className="absolute inset-0 flex justify-center items-center -z-10">
        <div className="relative w-[40vmin] h-[40vmin] bg-[#8CA29D]/50 rounded-[100%] blur-[50px] sm:blur-[200px] animate-[two_90s_infinite]"></div>
      </div>
      <div className="absolute inset-0 flex justify-center items-center -z-10">
        <div className="relative w-[40vmin] h-[40vmin] bg-[#d1dad8]/50 rounded-[100%] blur-[50px] sm:blur-[200px] animate-[three_90s_infinite]"></div>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200 mt-20 z-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">ลงทะเบียน</h1>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">ชื่อผู้ใช้</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-[#2F584F]"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">อีเมล</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-[#2F584F]"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-[#2F584F]"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">ยืนยันรหัสผ่าน</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-[#2F584F]"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2F584F] hover:bg-[#8CA29D] text-white p-3 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'กำลังดำเนินการ...' : 'ลงทะเบียน'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-gray-600">
          มีบัญชีอยู่แล้ว? <Link href="/login" className="text-[#8CA29D] hover:text-[#2F584F] hover:underline">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
}