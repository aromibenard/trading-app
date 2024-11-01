"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { format, subMonths } from "date-fns"

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
import { useEffect, useState } from "react"
import { getDailySummaries, getTrend } from "@/actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface ChartDataPoint {
    balance: number,
    date: string,
    profit: number,
    loss: number
}

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const getLastFourMonths = () => {
    return Array.from({ length: 4 }, (_, index) =>
        format(subMonths(new Date(), index), "LLLL")
    )
}


export function EquityCurve() {
    const [activeMonth, setActiveMonth] = useState(format(new Date(), "MMMM"))
    const [chartData, setChartData] = useState<ChartDataPoint[]>([])
    const [trend, setTrend] = useState('')
    const [trendNoun, setTrendNoun] = useState('')

    useEffect(() => {
        const getData = async () => {
            const [data, trend] = await Promise.all([
                getDailySummaries(activeMonth),
                getTrend(activeMonth)
            ])
            setChartData(data)
            setTrend(trend.percentageChange)
            setTrendNoun(trend.trend)
        }
        getData()
    },[activeMonth])

    const months = getLastFourMonths()

    return (
        <Card>
        <CardHeader>
            <div>
                <CardTitle>Account Chart</CardTitle>
                <CardDescription>
                Account metrics for the month of {activeMonth}
                </CardDescription>
            </div>
            <Select value={activeMonth} onValueChange={setActiveMonth}>
                <SelectTrigger
                    className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
                    aria-label="Select a value"
                >
                    <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent align="end" className="rounded-xl">
                    {months.map((month) => {
                    return (
                        <SelectItem
                        key={month}
                        value={month}
                        className="rounded-lg [&_span]:flex"
                        >
                        <div className="flex items-center gap-2 text-xs">
                            <span
                            className="flex h-3 w-3 shrink-0 rounded-sm"
                            style={{
                                backgroundColor: `var(--color-${month})`,
                            }}
                            />
                            {month}
                        </div>
                        </SelectItem>
                    )
                    })}
                </SelectContent>
            </Select>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig}>
            <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                left: 12,
                right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                dataKey="loss"
                type="natural"
                fill="#DF6B20"
                fillOpacity={0.4}
                stroke="#DF6B20"
                stackId="a"
                />
                <Area
                dataKey="profit"
                type="natural"
                fill="#20DF6B"
                fillOpacity={0.4}
                stroke="#20DF6B"
                stackId="a"
                />
                <Area
                dataKey="balance"
                type="natural"
                fill="#6B20DF"
                fillOpacity={0.4}
                stroke="#6B20DF"
                stackId="a"
                />
            </AreaChart>
            </ChartContainer>
        </CardContent>
        <CardFooter>
        <div className="flex items-center gap-2 font-medium leading-none">
            Trending {trendNoun} by {trend}% this month { trendNoun === 'up'
            ? <TrendingUp className={`${trendNoun === 'up' ? 'text-main h-4 w-4' : 'text-loss h-4 w-4'}`} /> 
            : <TrendingDown className={`${trendNoun === 'up' ? 'text-main h-4 w-4' : 'text-loss h-4 w-4'}`}/>}
        </div>
        </CardFooter>
        </Card>
    )
}
