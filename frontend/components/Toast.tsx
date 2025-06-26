import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, FileText, Info } from "lucide-react";


type ToastProps = {
    isVisible: boolean;
    type: 'success' | 'error' | 'info';
    message: string;
    onDismiss: () => void;
}

export const Toast = ({ isVisible, type, message, onDismiss }: ToastProps) => {

    const bgColor =
        type === 'success'
            ? "bg-green-600"
            : type === 'error'
                ? "bg-red-600"
                : "bg-blue-600";
    const Icon =
        type === 'success' ? CheckCircle : type === 'error' ? FileText : Info;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2`}
                >
                    <Icon size={20} className="text-white" />
                    <span>{message}</span>
                    <button
                        onClick={onDismiss}
                        className="ml-4 text-white font-bold"
                    >
                        ×
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
};