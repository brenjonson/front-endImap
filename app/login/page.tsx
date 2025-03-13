'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DesktopNavbar from '@/components/navbar/DesktopNavbar';
import MobileNavbar from '@/components/navbar/MobileNavbar';
import RegisterModal from '@/components/RegisterModal';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

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
    
    try {
      // Here you would call your API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
      
      // Redirect to user dashboard after successful login
      router.push('/user/dashboard');
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">เข้าสู่ระบบ</h1>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">อีเมล</label>
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
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F584F]"
              placeholder="รหัสผ่านของคุณ"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#2F584F] text-white py-2 px-4 rounded-md hover:bg-[#8CA29D] transition-colors"
            disabled={loading}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            ยังไม่มีบัญชี? <button onClick={() => setIsRegisterModalOpen(true)} className="text-[#2F584F] hover:underline">ลงทะเบียน</button>
          </p>
        </div>
        
        {/* Registration Modal */}
        <RegisterModal 
          isOpen={isRegisterModalOpen} 
          onClose={() => setIsRegisterModalOpen(false)} 
        />
      </div>
    </div>
  );
}