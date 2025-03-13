"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FaCog, FaUser, FaChevronUp, FaChevronDown, FaSignOutAlt, FaEnvelope } from 'react-icons/fa';
import { TbGraphFilled } from "react-icons/tb";
import { TbMoneybag } from "react-icons/tb";
import { RiFileList2Fill } from "react-icons/ri";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { IoMail } from "react-icons/io5";
import EmailSettingsModal from '../EmailSettingsModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { FiLogOut } from "react-icons/fi";

const LoggedMobileNavbar = () => {
    const [open, setOpen] = useState(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const settingsMenuRef = useRef<HTMLDivElement>(null);
    // Move the usePathname hook inside the component
    const pathname = usePathname();

    // Move the isActive function inside the component
    const isActive = (path: any) => {
        return pathname === path;
    };

    // Close settings menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
                setShowSettingsMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        // Implement logout functionality here
        console.log('Logging out...');
        // Redirect to login page or home page
        window.location.href = '/';
    };

    return (
        <div className='fixed bottom-0 left-0 right-0 z-50'>
            {/* Toggle button that stays visible at the bottom */}
            <div className='flex justify-center'>
                <button
                    onClick={() => setOpen(!open)}
                    className='bg-[#2F584F] text-white rounded-t-lg px-6 py-2 flex items-center justify-center shadow-lg'
                >
                    {open ? <FaChevronDown size={18} /> : <FaChevronUp size={18} />}
                    <span className='ml-2 text-sm font-medium'>เมนู</span>
                </button>
            </div>

            <div className={`bg-[#2F584F] p-0 rounded-t-lg shadow-lg transition-all duration-300 ${open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'} overflow-hidden`}>
                <div className='flex items-center justify-center mb-4'>
                    <p className='text-white text-2xl font-bold'>S</p>
                </div>

                <ul className='grid grid-cols-3 gap-4 px-3 pb-5'>
                    <Link href="/user/dashboard">
                        <li className={`text-white text-xs cursor-pointer p-2 hover:bg-[#8CA29D] rounded-md flex flex-col items-center justify-center ${isActive('/user/dashboard') ? 'bg-[#8CA29D] ' : ''}`}>
                            <TbGraphFilled className='text-white mb-1' size={24} />
                            <span>แดชบอร์ด</span>
                        </li>
                    </Link>
                    <Link href="/user/billandreceipt">
                        <li className={`text-white text-xs cursor-pointer p-2 hover:bg-[#8CA29D] rounded-md flex flex-col items-center justify-center ${isActive('/user/billandreceipt') ? 'bg-[#8CA29D] ' : ''}`}>
                            <RiFileList2Fill className='text-white mb-1' size={22} />
                            <span>บิลและใบเสร็จ</span>
                        </li>
                    </Link>
                    <Link href="/user/budgetmanagement">
                        <li className={`text-white text-xs cursor-pointer p-2 hover:bg-[#8CA29D] rounded-md flex flex-col items-center justify-center ${isActive('/user/budgetmanagement') ? 'bg-[#8CA29D] ' : ''}`}>
                            <FontAwesomeIcon icon={faSackDollar} className='text-white mb-1 text-xl mt-1' />
                            <span>งบประมาณ</span>
                        </li>
                    </Link>
                    <Link href="/user/mailmanagement">
                        <li className={`text-white text-xs cursor-pointer p-2 hover:bg-[#8CA29D] rounded-md flex flex-col items-center justify-center ${isActive('/user/mailmanagement') ? 'bg-[#8CA29D] ' : ''}`}>
                            <IoMail className='text-white mb-1' size={22} />
                            <span>จัดการอีเมล</span>
                        </li>
                    </Link>
                    <Link href="/user/settings">
                        <li className={`text-white text-xs cursor-pointer p-2 hover:bg-[#8CA29D] rounded-md flex flex-col items-center justify-center ${isActive('/user/settings') ? 'bg-[#8CA29D] ' : ''}`}>
                            <FaCog className='text-white mb-1' size={22} />
                            <span>ตั้งค่า</span>
                        </li>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className={`text-white text-xs cursor-pointer p-2 hover:bg-[#8CA29D] rounded-md flex flex-col items-center justify-center ${isActive('/user/logout') ? 'bg-[#8CA29D] ' : ''}`}
                    >
                        <FiLogOut className='text-white mb-1' size={22}  />
                        {open && "ออกจากระบบ"}
                    </button>
                </ul>
            </div>

            {/* Email Settings Modal */}
            <EmailSettingsModal
                isOpen={showEmailModal}
                onClose={() => setShowEmailModal(false)}
            />
        </div>
    );
};

export default LoggedMobileNavbar;