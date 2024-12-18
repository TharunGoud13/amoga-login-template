import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Label } from 'recharts'

const DataCard = ({field}: any) => {
  const { card_json } = field?.media_card_data || {}

  // Calculate total revenue
  const totalRevenue = card_json?.reduce((sum: number, item: any) => sum + item.revenue, 0) || 0

  // Color palette for the pie chart
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#8884D8', '#82CA9D', '#FF6384', '#36A2EB'
  ]

  return (
    <div className="w-full flex flex-col justify-center items-center ">
        <h1 className='text-xl'>Total Revenue</h1>
        <p className='text-xl font-bold'>${totalRevenue}</p>
      <PieChart width={400} height={300}>
        <Tooltip 
          formatter={(value, name) => [
            `$${Number(value).toLocaleString()}`, 
            name
          ]}
        />
        <Pie
          data={card_json}
          dataKey="revenue"
          nameKey="month"
          innerRadius={60}
          outerRadius={90}
        //   fill="#8884d8"
        //   paddingAngle={5}
        >
          {card_json?.map((entry: any, index: number) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
            />
          ))}
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
                      className="fill-foreground text-2xl font-bold"
                    >
                      ${totalRevenue.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground text-sm"
                    >
                      Total Revenue
                    </tspan>
                  </text>
                )
              }
              return null;
            }}
          />
        </Pie>
      </PieChart>
    </div>
  )
}

export default DataCard