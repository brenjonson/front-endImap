"use client";
import { useState } from 'react';
import Template from "@/components/Template";
import { FaEdit, FaTrash, FaTag, FaTimes } from 'react-icons/fa';

function mailmanagement() {
    // State for modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State to track if we're editing or adding new email
    const [isEditing, setIsEditing] = useState(false);
    
    // State to track which email is being edited
    const [editingEmailId, setEditingEmailId] = useState<number | null>(null);
    
    // State for form inputs
    const [newEmail, setNewEmail] = useState({
        title: '',
        sender: '',
        keywords: '',
        category: 'ช็อปปิ้ง'
    });
    
    // Sample email data
    const [emailData, setEmailData] = useState([
        {
            id: 1,
            title: "ใบเสร็จ Lazada",
            sender: "no-reply@lazada.co.th",
            keywords: ["ขอบคุณสำหรับคำสั่งซื้อ", "ใบเสร็จ"],
            category: "ช็อปปิ้ง",
            date: "15 มิ.ย. 2023"
        },
        {
            id: 2,
            title: "ค่าไฟฟ้า MEA",
            sender: "e-service@mea.or.th",
            keywords: ["ใบแจ้งหนี้", "ค่าไฟฟ้า", "ชำระเงิน"],
            category: "สาธารณูปโภค",
            date: "10 มิ.ย. 2023"
        },
        {
            id: 3,
            title: "ใบเสร็จ Shopee",
            sender: "no-reply@shopee.co.th",
            keywords: ["ยืนยันการชำระเงิน", "ใบเสร็จ"],
            category: "ช็อปปิ้ง",
            date: "5 มิ.ย. 2023"
        },
        {
            id: 4,
            title: "ค่าน้ำประปา",
            sender: "e-service@mwa.co.th",
            keywords: ["ใบแจ้งหนี้", "ค่าน้ำประปา"],
            category: "สาธารณูปโภค",
            date: "3 มิ.ย. 2023"
        }
    ]);

    // Handle input changes
    const handleInputChange = (e:any) => {
        const { name, value } = e.target;
        setNewEmail(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle edit button click
    const handleEditClick = (id: number) => {
        const emailToEdit = emailData.find(email => email.id === id);
        if (emailToEdit) {
            setNewEmail({
                title: emailToEdit.title,
                sender: emailToEdit.sender,
                keywords: emailToEdit.keywords.join(', '),
                category: emailToEdit.category
            });
            setEditingEmailId(id);
            setIsEditing(true);
            setIsModalOpen(true);
        }
    };

    // Handle form submission
    const handleSubmit = (e:any) => {
        e.preventDefault();
        
        if (isEditing && editingEmailId !== null) {
            // Update existing email
            setEmailData(emailData.map(email => {
                if (email.id === editingEmailId) {
                    return {
                        ...email,
                        title: newEmail.title,
                        sender: newEmail.sender,
                        keywords: newEmail.keywords.split(',').map(keyword => keyword.trim()),
                        category: newEmail.category
                    };
                }
                return email;
            }));
        } else {
            // Create new email object
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate()} ${['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'][currentDate.getMonth()]} ${currentDate.getFullYear() + 543}`;
            
            const newEmailEntry = {
                id: emailData.length + 1,
                title: newEmail.title,
                sender: newEmail.sender,
                keywords: newEmail.keywords.split(',').map(keyword => keyword.trim()),
                category: newEmail.category,
                date: formattedDate
            };
            
            // Add to email data
            setEmailData([...emailData, newEmailEntry]);
        }
        
        // Reset form and close modal
        setNewEmail({
            title: '',
            sender: '',
            keywords: '',
            category: 'ช็อปปิ้ง'
        });
        setIsEditing(false);
        setEditingEmailId(null);
        setIsModalOpen(false);
    };

    // Handle delete
    const handleDelete = (id:any) => {
        setEmailData(emailData.filter(email => email.id !== id));
    };

    return (
        <Template>
            <div className='border size-full rounded-lg'>
                <div className='flex flex-row justify-between items-center p-6 '>
                    <h1 className='text-3xl font-bold'>การจัดการอีเมล</h1>
                    <button 
                        className='bg-[#2F584F] hover:bg-[#8CA29D] text-white font-bold py-1 px-4 rounded flex items-center'
                        onClick={() => {
                            setIsEditing(false);
                            setNewEmail({
                                title: '',
                                sender: '',
                                keywords: '',
                                category: 'ช็อปปิ้ง'
                            });
                            setIsModalOpen(true);
                        }}
                    >
                        <span className='text-2xl mr-2'>+</span> กำหนดอีเมลใหม่
                    </button>
                </div>
                <div className='p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {emailData.map((email) => (
                        <div key={email.id} className='border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow'>
                            <div className='flex justify-between items-start mb-2'>
                                <h2 className='text-lg font-semibold text-[#2F584F]'>{email.title}</h2>
                                <span className='text-xs text-gray-500'>{email.date}</span>
                            </div>
                            
                            <div className='mb-3'>
                                <p className='text-sm text-gray-600'>ผู้ส่ง: {email.sender}</p>
                            </div>
                            
                            <div className='mb-3'>
                                <p className='text-sm font-medium'>คำสำคัญ:</p>
                                <div className='flex flex-wrap gap-1 mt-1'>
                                    {email.keywords.map((keyword, index) => (
                                        <span key={index} className='text-xs bg-gray-100 px-2 py-1 rounded'>{keyword}</span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className='flex justify-between items-center mt-4'>
                                <div className='flex items-center'>
                                    <FaTag className='text-[#2F584F] mr-1' size={14} />
                                    <span className='text-sm'>{email.category}</span>
                                </div>
                                
                                <div className='flex space-x-2'>
                                    <button 
                                        className='p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100'
                                        onClick={() => handleEditClick(email.id)}
                                    >
                                        <FaEdit size={14} />
                                    </button>
                                    <button 
                                        className='p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100'
                                        onClick={() => handleDelete(email.id)}
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for adding/editing email */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[#2F584F]">
                                {isEditing ? 'แก้ไขอีเมล' : 'กำหนดอีเมลใหม่'}
                            </h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">หัวข้อ</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={newEmail.title}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2F584F] focus:border-transparent"
                                    required
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">อีเมลผู้ส่ง</label>
                                <input
                                    type="email"
                                    name="sender"
                                    value={newEmail.sender}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2F584F] focus:border-transparent"
                                    required
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">คำสำคัญ (คั่นด้วยเครื่องหมายคอมม่า)</label>
                                <input
                                    type="text"
                                    name="keywords"
                                    value={newEmail.keywords}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2F584F] focus:border-transparent"
                                    placeholder="เช่น: ใบเสร็จ, ยืนยันการชำระเงิน"
                                    required
                                />
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-1">หมวดหมู่</label>
                                <select
                                    name="category"
                                    value={newEmail.category}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2F584F] focus:border-transparent"
                                >
                                    <option value="ช็อปปิ้ง">ช็อปปิ้ง</option>
                                    <option value="สาธารณูปโภค">สาธารณูปโภค</option>
                                    <option value="การเงิน">การเงิน</option>
                                    <option value="อื่นๆ">อื่นๆ</option>
                                </select>
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#2F584F] hover:bg-[#8CA29D] text-white rounded"
                                >
                                    บันทึก
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Template>
    )
}
export default mailmanagement