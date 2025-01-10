"use client";
import { metrics } from "@opentelemetry/api";
import { createContext, ReactNode, useContext, useState } from "react";

interface MetricsContextType {
  metrics: Record<string, any> | null;
  setMetrics: (data: Record<string, any> | null) => void;
}

const MetricDataContext = createContext<MetricsContextType | undefined>(
  undefined
);

export const MetricDataProvider = ({ children }: { children: ReactNode }) => {
  const [metrics, setMetrics] = useState<Record<string, any> | null>(null);

  return (
    <MetricDataContext.Provider value={{ metrics, setMetrics }}>
      {children}
    </MetricDataContext.Provider>
  );
};

export const useMetrics = () => {
  const context = useContext(MetricDataContext);
  if (!context) {
    throw new Error("useMetrics must be used within a MetricDataProvider");
  }
  return context;
};
