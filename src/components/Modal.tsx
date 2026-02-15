import type  { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

export function Modal({ children, isOpen, onClose, title }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-9999 bg-black/50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="bg-[#fff1f1] rounded-2xl shadow-lg w-full max-w-md p-6 relative leading-none"
            onClick={(e) => e.stopPropagation()}>

                <div className="flex justify-between items-center mb-4">
                    {title && <h2 className="text-xl font-bold">{title}</h2>}
                    <button onClick={onClose} className="text-gray-500 cursor-pointer hover:text-gray-700 focus:outline-none">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div
                    className="max-h-[70vh] overflow-y-auto"
                >
                    {children}
                </div>
            </div>
        </div>
    );
}