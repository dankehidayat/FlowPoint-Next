import { SensorData } from "@/types";

interface SummaryDashboardProps {
  data: SensorData;
}

export default function SummaryDashboard({ data }: SummaryDashboardProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp < 18)
      return {
        text: "Cold",
        emoji: "❄️",
        color: "text-blue-500",
        bgColor: "bg-blue-500",
      };
    if (temp < 26)
      return {
        text: "Comfortable",
        emoji: "😊",
        color: "text-green-500",
        bgColor: "bg-green-500",
      };
    return {
      text: "Hot",
      emoji: "🔥",
      color: "text-red-500",
      bgColor: "bg-red-500",
    };
  };

  const getHumidityStatus = (humidity: number) => {
    if (humidity < 30)
      return {
        text: "Dry",
        color: "text-orange-500",
        bgColor: "bg-orange-500",
      };
    if (humidity < 70)
      return {
        text: "Normal",
        color: "text-green-500",
        bgColor: "bg-green-500",
      };
    return { text: "Humid", color: "text-blue-500", bgColor: "bg-blue-500" };
  };

  const tempStatus = getTemperatureStatus(data.temperature);
  const humidityStatus = getHumidityStatus(data.humidity);

  return (
    <div className="bg-card rounded-xl border p-6 mb-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {getGreeting()}!
            <span className={`ml-2 ${tempStatus.color}`}>
              It&apos;s {tempStatus.text.toLowerCase()} in the room right now{" "}
              {tempStatus.emoji}
            </span>
          </h2>
          <p className="text-muted-foreground">
            Real-time monitoring dashboard
          </p>
        </div>
        <div className="text-sm text-muted-foreground mt-2 lg:mt-0">
          Last updated: {data.timestamp.toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Energy */}
        <div className="bg-blue-500 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-blue-100 text-sm">Energy Consumed</div>
            <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">
            {data.energy.toFixed(2)} Wh
          </div>
          <div className="text-blue-100 text-sm">
            {(data.energy / 1000).toFixed(4)} kWh
          </div>
        </div>

        {/* Temperature - Dynamic background color */}
        <div className={`${tempStatus.bgColor} text-white rounded-lg p-6`}>
          <div className="flex items-center justify-between mb-2">
            <div
              className={`${tempStatus.bgColor.replace(
                "bg-",
                "text-"
              )}100 text-sm`}
            >
              Temperature
            </div>
            <div
              className={`w-8 h-8 ${tempStatus.bgColor.replace(
                "500",
                "400"
              )} rounded-lg flex items-center justify-center`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">
            {data.temperature.toFixed(1)}°C
          </div>
          <div
            className={`text-sm ${tempStatus.bgColor.replace(
              "bg-",
              "text-"
            )}100`}
          >
            {tempStatus.text} {tempStatus.emoji}
          </div>
        </div>

        {/* Humidity - Dynamic background color */}
        <div className={`${humidityStatus.bgColor} text-white rounded-lg p-6`}>
          <div className="flex items-center justify-between mb-2">
            <div
              className={`${humidityStatus.bgColor.replace(
                "bg-",
                "text-"
              )}100 text-sm`}
            >
              Humidity
            </div>
            <div
              className={`w-8 h-8 ${humidityStatus.bgColor.replace(
                "500",
                "400"
              )} rounded-lg flex items-center justify-center`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">
            {data.humidity.toFixed(1)}%
          </div>
          <div
            className={`text-sm ${humidityStatus.bgColor.replace(
              "bg-",
              "text-"
            )}100`}
          >
            {humidityStatus.text}
          </div>
        </div>
      </div>
    </div>
  );
}
