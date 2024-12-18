"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  Jan: { label: "January", color: "#FF6384" },
  Feb: { label: "February", color: "#36A2EB" },
  Mar: { label: "March", color: "#FFCE56" },
  Apr: { label: "April", color: "#4BC0C0" },
  May: { label: "May", color: "#9966FF" },
  Jun: { label: "June", color: "#FF9F40" },
  Jul: { label: "July", color: "#FF6384" },
  Aug: { label: "August", color: "#36A2EB" },
} satisfies ChartConfig

export default function MediaPieChart({ field }: any) {
  const { card_json } = field?.media_card_data || {};
  const totalRevenue = card_json?.reduce((sum: number, item: any) => sum + item.revenue, 0) || 0

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>${totalRevenue.toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={card_json}
              dataKey="revenue"
              nameKey="month"
              innerRadius={60}
              strokeWidth={5}
              fill={"#8884d8"}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalRevenue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Revenue
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
