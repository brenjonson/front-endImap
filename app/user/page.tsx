"use client";
import React, { useState, useEffect } from 'react';
import ExpenseDashboard from '@/components/ExpenseDashboard';
import Template from '@/components/Template';
import Cardmanagefirstsetting from '@/components/Cardmanagefirstsetting';
import EmailSettingsGuide from "@/components/EmailSettingsGuide"

export default function FirstUserPage() {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Show modal when component mounts
        setShowModal(true);
    }, []);

    return (
        <Template>
            <ExpenseDashboard />
            
            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-[95vw] max-h-[90vh] overflow-auto bg-white rounded-lg shadow-xl">
                        
                        {/* Modal Content */}
                        <div className="p-6 flex flex-row flex-wrap gap-4 justify-center">
                            <Cardmanagefirstsetting />
                            <EmailSettingsGuide />
                        </div>
                    </div>
                </div>
            )}
        </Template>
    );
}