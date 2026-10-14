import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { LucideIcon } from '../components/LucideIcon';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  title?: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, options?: { title?: string; duration?: number }) => void;
  success: (message: string, title?: string, duration?: number) => void;
  error: (message: string, title?: string, duration?: number) => void;
  warning: (message: string, title?: string, duration?: number) => void;
  info: (message: string, title?: string, duration?: number) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', options?: { title?: string; duration?: number }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const duration = options?.duration ?? 3500;
      const newToast: ToastItem = {
        id,
        message,
        type,
        title: options?.title,
        duration,
      };

      setToasts((prev) => [...prev.slice(-4), newToast]); // Keep maximum 5 toasts

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  const success = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast(message, 'success', { title, duration });
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast(message, 'error', { title, duration });
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast(message, 'warning', { title, duration });
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast(message, 'info', { title, duration });
    },
    [showToast]
  );

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      toasts,
      showToast,
      success,
      error,
      warning,
      info,
      dismissToast,
    }),
    [toasts, showToast, success, error, warning, info, dismissToast]
  );

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          wrapper: 'bg-emerald-50/95 border-emerald-300/90 text-emerald-950 shadow-emerald-900/10',
          iconName: 'check_circle',
          iconColor: 'text-emerald-700 bg-emerald-100 ring-4 ring-emerald-50',
          progressBar: 'bg-emerald-600',
        };
      case 'error':
        return {
          wrapper: 'bg-rose-50/95 border-rose-300/90 text-rose-950 shadow-rose-900/10',
          iconName: 'error',
          iconColor: 'text-rose-700 bg-rose-100 ring-4 ring-rose-50',
          progressBar: 'bg-rose-600',
        };
      case 'warning':
        return {
          wrapper: 'bg-amber-50/95 border-amber-300/90 text-amber-950 shadow-amber-900/10',
          iconName: 'warning',
          iconColor: 'text-amber-700 bg-amber-100 ring-4 ring-amber-50',
          progressBar: 'bg-amber-600',
        };
      case 'info':
      default:
        return {
          wrapper: 'bg-sky-50/95 border-sky-300/90 text-sky-950 shadow-sky-900/10',
          iconName: 'info',
          iconColor: 'text-sky-700 bg-sky-100 ring-4 ring-sky-50',
          progressBar: 'bg-sky-600',
        };
    }
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Floating Toast Container */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => {
          const style = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto transform transition-all duration-300 ease-out translate-y-0 opacity-100 flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border shadow-lg backdrop-blur-md ${style.wrapper}`}
            >
              <div className={`p-1.5 rounded-full shrink-0 flex items-center justify-center ${style.iconColor}`}>
                <LucideIcon name={style.iconName} className="text-[18px]" />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                {toast.title && (
                  <h4 className="font-heading font-extrabold text-[13px] leading-snug tracking-tight mb-0.5">
                    {toast.title}
                  </h4>
                )}
                <p className="text-[12px] font-medium leading-relaxed break-words">{toast.message}</p>
              </div>

              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer shrink-0 -mr-1 -mt-1"
                aria-label="Close notification"
              >
                <LucideIcon name="close" className="text-[16px]" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
