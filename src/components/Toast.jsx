import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const icons = { success: FiCheckCircle, error: FiXCircle, info: FiInfo, warning: FiInfo };
const colors = {
  success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300',
  error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300',
  info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300',
  warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300',
};

export default function Toast() {
  const { toasts, removeToast } = useApp();
  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-3">
      {toasts.map(toast => {
        const Icon = icons[toast.type] || FiInfo;
        return (
          <div key={toast.id} className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-lg max-w-sm animate-slide-up ${colors[toast.type] || colors.info}`}>
            <Icon size={18} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 opacity-60 hover:opacity-100">
              <FiX size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
