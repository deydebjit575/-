import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let bgColor = 'bg-slate-900 text-white';
        let Icon = Info;
        let borderColor = 'border-slate-700';

        if (toast.type === 'success') {
          bgColor = 'bg-teal-900 text-teal-100';
          borderColor = 'border-teal-700';
          Icon = CheckCircle2;
        } else if (toast.type === 'warning') {
          bgColor = 'bg-amber-900 text-amber-100';
          borderColor = 'border-amber-700';
          Icon = AlertTriangle;
        } else if (toast.type === 'error') {
          bgColor = 'bg-rose-900 text-rose-100';
          borderColor = 'border-rose-700';
          Icon = AlertCircle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start space-x-3 p-4 rounded-xl shadow-elevated border ${borderColor} ${bgColor} animate-in slide-in-from-right-5 fade-in duration-200`}
          >
            <Icon className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-bold leading-tight">{toast.title}</h5>
              {toast.message && (
                <p className="text-xs opacity-90 mt-1 leading-snug break-words">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded hover:bg-white/10 shrink-0 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
