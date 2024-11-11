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

    if(!trades) return 

    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : Infinity
    
    return (
        <div className="min-h-screen ">
            <Card className="h-full border-none rounded-none">
                <CardHeader>

                </CardHeader>
                <CardContent>
                    <div className="grid grid-rows-3 md:grid-rows-2 gap-2 ">
                        <EquityCurve />
                        <div className="grid grid-rows-2 md:grid-cols-2 gap-2">
                            <ProfitFactorChart 
                                profitFactor={profitFactor}
                                count={trades.count}
                            />
                            <CurrencyChart 
                            chartDatas={trades.chartData}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

