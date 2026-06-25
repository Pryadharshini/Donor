import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ current, total, onChange }) {
  const pages = Math.ceil(total);
  if (pages <= 1) return null;
  
  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button onClick={() => onChange(current - 1)} disabled={current === 1}
        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:border-red-300 hover:text-red-600 dark:hover:border-red-600 dark:hover:text-red-400 transition-colors">
        <FiChevronLeft size={18} />
      </button>
      {Array.from({ length: pages }).map((_, i) => (
        <button key={i} onClick={() => onChange(i + 1)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${current === i + 1 ? 'bg-red-600 text-white shadow-md' : 'border border-gray-200 dark:border-gray-700 hover:border-red-300 hover:text-red-600 dark:hover:border-red-600 dark:hover:text-red-400 text-gray-600 dark:text-gray-400'}`}>
          {i + 1}
        </button>
      ))}
      <button onClick={() => onChange(current + 1)} disabled={current === pages}
        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:border-red-300 hover:text-red-600 dark:hover:border-red-600 dark:hover:text-red-400 transition-colors">
        <FiChevronRight size={18} />
      </button>
    </div>
  );
}
