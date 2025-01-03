"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Label,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Config, Result } from "@/lib/types";
import { transformDataForMultiLineChart } from "@/lib/rechart-format";

function toTitleCase(str: string | undefined | null): string {
  if (!str || typeof str !== "string") {
    return ""; // Return an empty string if input is invalid
  }
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
];

export function DynamicChart({
  chartData,
  chartConfig,
  chartApiConfig,
  componentName,
}: {
  chartData: Result[];
  chartConfig?: Config;
  chartApiConfig?: Config;
  componentName?: string;
}) {
  const activeConfig = chartConfig || chartApiConfig;

  const renderChart = () => {
    if (!chartData || !activeConfig) return <div>No chart data available</div>;

    const parsedChartData = chartData
      .filter(
        (item) => item && Object.values(item).some((value) => value !== null)
      )
      .map((item) => {
        const parsedItem: { [key: string]: any } = {};
        for (const [key, value] of Object.entries(item)) {
          parsedItem[key] = isNaN(Number(value)) ? value : Number(value);
        }
        return parsedItem;
      });

    if (parsedChartData.length === 0)
      return <div>No valid data to display</div>;

    switch (true) {
      case componentName === "Data Card Bar Chart" ||
        componentName === "Data Card Bar Chart Horizontal":
        return (
          <BarChart data={parsedChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={activeConfig.xKey}>
              <Label
                value={toTitleCase(activeConfig.xKey)}
                offset={0}
                position="insideBottom"
              />
            </XAxis>
            <YAxis>
              <Label
                value={toTitleCase(activeConfig.yKeys[0])}
                angle={-90}
                position="insideLeft"
              />
            </YAxis>
            <ChartTooltip content={<ChartTooltipContent />} />
            {activeConfig.legend && <Legend />}
            {activeConfig.yKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
              />
            ))}
          </BarChart>
        );

      case componentName === "Data Card Line Chart":
        const { data, xAxisField, lineFields } = transformDataForMultiLineChart(
          parsedChartData,
          activeConfig
        );
        const useTransformedData =
          activeConfig.multipleLines &&
          activeConfig.measurementColumn &&
          activeConfig.yKeys.includes(activeConfig.measurementColumn);

        return (
          <LineChart data={useTransformedData ? data : parsedChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={
                useTransformedData ? activeConfig.xKey : activeConfig.xKey
              }
            >
              <Label
                value={toTitleCase(
                  useTransformedData ? xAxisField : activeConfig.xKey
                )}
                offset={0}
                position="insideBottom"
              />
            </XAxis>
            <YAxis>
              <Label
                value={toTitleCase(activeConfig.yKeys[0])}
                angle={-90}
                position="insideLeft"
              />
            </YAxis>
            <ChartTooltip content={<ChartTooltipContent />} />
            {activeConfig.legend && <Legend />}
            {useTransformedData
              ? lineFields.map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                  />
                ))
              : activeConfig.yKeys.map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                  />
                ))}
          </LineChart>
        );

      case componentName === "Data Card Donut Chart":
        return (
          <PieChart>
            <Pie
              data={parsedChartData}
              dataKey={activeConfig.yKeys[0]}
              nameKey={activeConfig.xKey}
              cx="50%"
              cy="50%"
              innerRadius={60}
              strokeWidth={5}
            >
              {parsedChartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            {activeConfig.legend && <Legend />}
          </PieChart>
        );

      default:
        return <div>Unsupported chart type: {componentName}</div>;
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h2 className="text-lg font-bold mb-2">
        {activeConfig?.title || "Chart"}
      </h2>
      {activeConfig && chartData.length > 0 && (
        <ChartContainer
          config={activeConfig.yKeys.reduce((acc, key, index) => {
            acc[key] = {
              label: key,
              color: colors[index % colors.length],
            };
            return acc;
          }, {} as Record<string, { label: string; color: string }>)}
          className="h-[320px] w-full"
        >
          {renderChart() || <div>No chart available</div>}
        </ChartContainer>
      )}
      <div className="w-full">
        <p className="mt-4 text-sm">
          {activeConfig?.description || "No description available."}
        </p>
        <p className="mt-4 text-sm">
          {activeConfig?.takeaway || "No takeaways available."}
        </p>
      </div>
    </div>
  );
}
