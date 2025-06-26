import { Toast } from "@/components/Toast";
import { createContext, useCallback, useContext, useState } from "react";

type ToastType = 'success' | 'error' | 'info';

type ToastState = {
    isVisible: boolean;
    message: string;
    type: ToastType;
}

type ToastContextType = {
    toast: ToastState;
    showToast: (message: string, type?: ToastType) => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }

    return context;
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<ToastState>({ isVisible: false, message: "", type: 'info', });
    const [timeoutId, setTimeoutId] = useState<number | null>(null);


    const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        setToast({ isVisible: true, message, type });
        const id = window.setTimeout(() => {
            setToast((prev) => ({ ...prev, isVisible: false }));
        }, duration);

        setTimeoutId(id);
    }, [toast, timeoutId]);

    const hideToast = useCallback(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }

        setToast((prev) => ({ ...prev, isVisible: false }));
    }, [timeoutId]);

    return (
        <ToastContext.Provider value={{ toast, showToast, hideToast }}>
            {children}
            <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onDismiss={hideToast} />
        </ToastContext.Provider>
    );
};