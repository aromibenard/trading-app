import { getTrades } from "@/actions";
import { CurrencyChart } from "@/components/currency-chart";
import { EquityCurve } from "@/components/equity-curve";
import { ProfitFactorChart } from "@/components/profit-factor";
import { Card, CardContent, CardHeader} from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
    const { userId } = await auth()
    const [trades] = await Promise.all([
        getTrades(userId as string)
    ])

    let totalProfit = 0
    let totalLoss = 0

    trades.tradesData.forEach((trade) => {
        if (trade.result == 'profit') {
            totalProfit += trade.amount
        } else if (trade.result == 'loss') {
            totalLoss += trade.amount
        }
    })

    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : Infinity
    
    return (
        <div className="min-h-screen ">
            <Card className="h-full border-none rounded-none">
                <CardHeader>

                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row space-y-4 md:space-x-6">
                        
                        <EquityCurve />
                        <ProfitFactorChart 
                            profitFactor={profitFactor}
                            count={trades.count}
                        />
                        <CurrencyChart 
                        chartDatas={trades.chartData}
                        />

                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

