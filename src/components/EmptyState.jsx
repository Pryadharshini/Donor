import { FaTint } from 'react-icons/fa';

export default function EmptyState({ icon: Icon = FaTint, title = 'No results found', subtitle = 'Try adjusting your search filters.', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-5">
        <Icon size={36} className="text-red-300 dark:text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">{subtitle}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
