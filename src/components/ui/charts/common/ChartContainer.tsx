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
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-gray-500">{loadingMessage}</div>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-gray-500">{emptyMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}
