"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FaCog, FaUser} from 'react-icons/fa';
import { TbGraphFilled } from "react-icons/tb";
import { TbMoneybag } from "react-icons/tb";
import { FaChevronLeft } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa';
import { RiFileList2Fill } from "react-icons/ri";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoMail } from "react-icons/io5";
import EmailSettingsModal from '../EmailSettingsModal';
import { FiLogOut } from "react-icons/fi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSackDollar } from '@fortawesome/free-solid-svg-icons';

// Remove the hook call at module level
// const pathname = usePathname();

// Remove the function at module level
// const isActive = (path:any) => {
//    return pathname === path;
//  };

const LoggedDesktopNavbar = () => {
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
        <div className=''>
            <div className={`bg-[#2F584F] p-5 my-4 pt-8 ${open ? 'w-64' : 'w-20'} duration-300 fixed inset-y-0 rounded-lg flex flex-col justify-between`}>
                <span className='absolute top-210 right-[-10px] w-8 h-8 bg-[#8CA29D] text-white flex items-center justify-center rounded-full cursor-pointer'
                    onClick={() => setOpen(!open)}>
                    {open ? <FaChevronLeft size={18} /> : <FaChevronRight size={18} />}
                </span>

                <div className='flex items-center justify-center'>
                    <p className='text-white text-3xl font-bold'>S{open && "AVVY"}</p>
                </div>

                <ul className='pt-6'>
                    <Link href="/user/dashboard">
                        <li className={`text-white text-sm cursor-pointer p-2 hover:bg-[#8CA29D] rounded-md flex mb-4 ${!open ? 'justify-center' : ''} items-center ${open ? 'mb-4' : ''} ${isActive('/user/dashboard') ? 'bg-[#8CA29D] ' : ''}`}>
                            <TbGraphFilled className={`text-white transition-colors ${open ? 'mr-2' : ''}`} size={24} />
                            {open && "แดชบอร์ด"}
                        </li>
                    </Link>

                    <Link href="/user/billandreceipt">
                        <li className={`text-white text-sm cursor-pointer p-2 hover:bg-[#8CA29D] rounded-md flex mb-4 ${!open ? 'justify-center' : ''} items-center ${open ? 'mb-4' : ''} ${isActive('/user/billandreceipt') ? 'bg-[#8CA29D] ' : ''}`}>
                            <RiFileList2Fill className={`text-white transition-colors ${open ? 'mr-2' : ''}`} size={22} />
                            {open && "รายการบิลและใบเสร็จ"}
                        </li>
                    </Link>
                    <Link href="/user/budgetmanagement">
                        <li className={`text-white text-sm cursor-pointer p-2 hover:bg-[#8CA29D] rounded-md flex mb-4 ${!open ? 'justify-center' : ''} items-center ${open ? 'mb-4' : ''} ${isActive('/user/budgetmanagement') ? 'bg-[#8CA29D] ' : ''}`}>
                        <FontAwesomeIcon icon={faSackDollar}  className={`text-white transition-colors text-xl ${open ? 'mr-2' : ''}`} />
                            {open && "การจัดการงบประมาณ"}
                        </li>
                    </Link>
                    <Link href="/user/mailmanagement">
                        <li className={`text-white text-sm cursor-pointer p-2 hover:bg-[#8CA29D] rounded-md flex mb-4 ${!open ? 'justify-center' : ''} items-center ${open ? 'mb-4' : ''} ${isActive('/user/mailmanagement') ? 'bg-[#8CA29D] ' : ''}`}>
                            <IoMail className={`text-white transition-colors ${open ? 'mr-2' : ''}`} size={22} />
                            {open && "จัดการอีเมล"}
                        </li>
                    </Link>

                </ul>

                <div className="mt-auto pb-6">
                    <ul className="flex flex-col gap-4">
                        <div className="relative" ref={settingsMenuRef}>
                            <Link href="/user/settings">
                                <li className={`text-white text-sm cursor-pointer p-2 hover:bg-[#8CA29D] rounded-md flex mb-4 ${!open ? 'justify-center' : ''} items-center ${open ? 'mb-4' : ''} ${isActive('/user/settings') ? 'bg-[#8CA29D] ' : ''}`}>
                                    <FaCog className={`text-white transition-colors ${open ? 'mr-2' : ''}`} size={22} />
                                    {open && "ตั้งค่า"}
                                </li>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className={`text-white text-sm cursor-pointer p-2 hover:bg-[#8CA29D] rounded-md flex ${!open ? 'justify-center' : ''} items-center w-full ${isActive('/user/logout') ? 'bg-[#8CA29D] ' : ''}`}
                            >
                                <FiLogOut className={`text-white transition-colors ${open ? 'mr-2' : ''}`} size={22} />
                                {open && "ออกจากระบบ"}
                            </button>

                        </div>
                    </ul>
                </div>
            </div>

            {/* Email Settings Modal */}
            <EmailSettingsModal
                isOpen={showEmailModal}
                onClose={() => setShowEmailModal(false)}
            />
        </div>
    );
};
export default LoggedDesktopNavbar;