"use client"

import { PolarGrid, RadialBar, RadialBarChart, TooltipProps } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { colorMapping, CurrencyPair } from "@/lib/utils"

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const { browser, visitors } = payload[0].payload;
    return (
      <Card className="custom-tooltip p-2 rounded">
        <p className="label">{`${browser} : ${visitors} trades`}</p>
      </Card>
    )
  }
  return null
}

type ChartData = {
  currency: string;
  count: number;
};


export function CurrencyChart({ chartDatas }: { chartDatas: ChartData[]}) {
  
  const chartData = chartDatas.map(({ currency, count }) => {
    return {
      browser: currency, 
      visitors: count, 
      fill: colorMapping[currency as CurrencyPair] || '#6B20DF'
    }
  })

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig
  
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Currency Pairs Traded</CardTitle>
        <CardDescription>Account lifetime</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={100}>
            <ChartTooltip
              cursor={false}
              content={<CustomTooltip/>}
            />
            <PolarGrid gridType="circle" />
            <RadialBar dataKey="visitors" />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
