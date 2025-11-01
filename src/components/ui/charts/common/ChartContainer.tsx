// src/components/ui/charts/common/ChartContainer.tsx
interface ChartContainerProps {
  title: string;
  children?: React.ReactNode;
  timeRange: number;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
}

export default function ChartContainer({
  title,
  children,
  timeRange,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data available",
  loadingMessage = "Loading chart data...",
}: ChartContainerProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">
            {loadingMessage}
          </div>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">{emptyMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}
