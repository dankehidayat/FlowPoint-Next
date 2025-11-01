// lib/loess-smoother.ts

/**
 * LOESS (Locally Estimated Scatterplot Smoothing) implementation
 * Provides non-parametric regression for time series data
 */
export interface DataPoint {
  x: number; // timestamp in milliseconds
  y: number; // value
}

export interface SmoothDataPoint extends DataPoint {
  isActual: boolean;
  originalValue?: number;
}

export class LOESSSmoother {
  private bandwidth: number;

  constructor(bandwidth: number = 0.25) {
    this.bandwidth = bandwidth;
  }

  /**
   * Smooth data using LOESS algorithm
   */
  smooth(data: DataPoint[]): SmoothDataPoint[] {
    if (data.length < 3) {
      return data.map((point) => ({
        ...point,
        isActual: true,
        originalValue: point.y,
      }));
    }

    const smoothed: SmoothDataPoint[] = [];
    const n = data.length;

    for (let i = 0; i < n; i++) {
      const currentPoint = data[i];

      // For small datasets or edge points, use actual values
      if (n < 5 || i === 0 || i === n - 1) {
        smoothed.push({
          ...currentPoint,
          isActual: true,
          originalValue: currentPoint.y,
        });
        continue;
      }

      const smoothedValue = this.localRegression(data, i);
      smoothed.push({
        x: currentPoint.x,
        y: smoothedValue,
        isActual: false,
        originalValue: currentPoint.y,
      });
    }

    return smoothed;
  }

  /**
   * Perform local regression at a specific point
   */
  private localRegression(data: DataPoint[], index: number): number {
    const weights = this.calculateWeights(data, index);
    return this.weightedLinearRegression(data, weights, data[index].x);
  }

  /**
   * Calculate tricube weights for neighbors
   */
  private calculateWeights(data: DataPoint[], centerIndex: number): number[] {
    const n = data.length;
    const weights: number[] = new Array(n).fill(0);

    // Determine bandwidth in terms of data points
    const bandwidthPoints = Math.max(3, Math.floor(this.bandwidth * n));
    const halfBandwidth = Math.floor(bandwidthPoints / 2);

    const start = Math.max(0, centerIndex - halfBandwidth);
    const end = Math.min(n - 1, centerIndex + halfBandwidth);

    // Calculate maximum distance within bandwidth
    const maxDistance = Math.max(
      Math.abs(data[centerIndex].x - data[start].x),
      Math.abs(data[centerIndex].x - data[end].x)
    );

    if (maxDistance === 0) return weights;

    // Calculate tricube weights
    for (let i = start; i <= end; i++) {
      const distance = Math.abs(data[i].x - data[centerIndex].x);
      const normalizedDistance = distance / maxDistance;

      if (normalizedDistance < 1) {
        weights[i] = Math.pow(1 - Math.pow(normalizedDistance, 3), 3);
      }
    }

    return weights;
  }

  /**
   * Weighted linear regression for local fitting
   */
  private weightedLinearRegression(
    data: DataPoint[],
    weights: number[],
    x: number
  ): number {
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0,
      totalWeight = 0;

    for (let i = 0; i < data.length; i++) {
      if (weights[i] > 0) {
        const weight = weights[i];
        const xVal = data[i].x;
        const yVal = data[i].y;

        sumX += xVal * weight;
        sumY += yVal * weight;
        sumXY += xVal * yVal * weight;
        sumX2 += xVal * xVal * weight;
        totalWeight += weight;
      }
    }

    if (totalWeight === 0) return data.find((_, i) => weights[i] > 0)?.y || 0;

    const meanX = sumX / totalWeight;
    const meanY = sumY / totalWeight;

    const numerator = sumXY - totalWeight * meanX * meanY;
    const denominator = sumX2 - totalWeight * meanX * meanX;

    if (Math.abs(denominator) < 1e-10) {
      return meanY; // No slope, return mean
    }

    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;

    return slope * x + intercept;
  }
}
