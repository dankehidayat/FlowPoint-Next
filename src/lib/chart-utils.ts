// src/lib/chart-utils.ts
export const formatTimeLabel = (time: string, timeRange: number): string => {
  if (timeRange > 24) {
    return time;
  }
  return time;
};

export const calculateEnvironmentDomains = (chartData: any[]) => {
  if (!chartData || chartData.length === 0) {
    return { tempDomain: [0, 40], humidityDomain: [0, 100] };
  }

  const temperatures = chartData
    .map((d) => d.temperature)
    .filter((t) => !isNaN(t));
  const humidities = chartData.map((d) => d.humidity).filter((h) => !isNaN(h));

  if (temperatures.length === 0 || humidities.length === 0) {
    return { tempDomain: [0, 40], humidityDomain: [0, 100] };
  }

  const tempMin = Math.min(...temperatures);
  const tempMax = Math.max(...temperatures);
  const humidityMin = Math.min(...humidities);
  const humidityMax = Math.max(...humidities);

  const tempDelta = Math.max(8, (tempMax - tempMin) * 0.5);
  const humidityDelta = Math.max(15, (humidityMax - humidityMin) * 0.4);

  return {
    tempDomain: [
      Math.max(0, Math.floor(tempMin - tempDelta)),
      Math.ceil(tempMax + tempDelta),
    ],
    humidityDomain: [
      Math.max(0, Math.floor(humidityMin - humidityDelta)),
      Math.min(100, Math.ceil(humidityMax + humidityDelta)),
    ],
  };
};
