import { getAccountDetails, getTrades } from "@/actions"
import { AccountPie } from "@/components/account-pie"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { DollarSign, Dot } from "lucide-react"

export default async function Page() {
    const user = await currentUser()
    
    const [account, trades] = await Promise.all([
        getAccountDetails( user?.id as string ),
        getTrades(user?.id as string),
    ])

    if(!account && !trades) return

    const balance = account!.balance / 100
    const profit = account!.profit / 100
    const loss = account!.loss / 100
    const count = trades.count
    const numberOfProfitableTrades = trades.profitableTradesNumber
    const strikeRate = ( numberOfProfitableTrades / count ) * 100
    
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
        <div className="p-4 flex-col w-full flex gap-2">
            <div className="flex px-2 justify-between items-center">
                <h1>Karibu <span className="text-main font-medium drop-shadow-md">{user?.firstName}</span></h1>
                <span><UserButton/></span>
            </div>
            <div className="w-full mx-auto rounded-md grid md:grid-cols-2">
                <div className="grid grid-cols-2  gap-1 p-1 py-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="flex items-center font-bold pt-1 text-3xl text-papo"><DollarSign className="size-6"/><span className="">{balance.toFixed(2)}</span></CardTitle>
                            <div className="grid grid-rows-2 md:grid-cols-2 space-y-1 my-2">
                                <div className="flex flex-col">
                                    <span className="flex text-sm items-center"><Dot className="text-main"/>Profit</span>
                                    <div>
                                        <h2 className="ml-[18px] flex items-center text-sm font-semibold text-main"><DollarSign className="size-4"/>{profit.toFixed(2)}</h2>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="flex text-sm items-center"><Dot className="text-red-500"/><span>Loss</span></span>
                                    <div>
                                        <h2 className="ml-[18px] flex items-center text-sm font-semibold text-loss"><DollarSign className="size-4"/>{loss.toFixed(2)}</h2>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Strike Rate</CardTitle>
                            <CardDescription>based on {count} trades</CardDescription>
                        </CardHeader>
                        <CardContent className="grid items-center justify-center">
                            <h1 className="text-xl font-semibold text-papo">{strikeRate.toFixed(2)}%</h1>
                        </CardContent>
                        <CardFooter>
                            <CardDescription className="">
                                Profit factor: <span className = {` drop-shadow-sm
                                        ${ profitFactor < 1 ? 'text-rose-500' : 
                                            profitFactor === 1 ? 'text-orange-500' :
                                            profitFactor >= 1.5 && profitFactor <= 1.9  ? 'text-blue-500' :
                                            profitFactor >= 2 && profitFactor <= 2.9  ? 'text-purple-600' :
                                            profitFactor >= 3 && profitFactor <= 3.9  ? 'text-green-400' :
                                            'text-green-900'}`}>${profitFactor.toFixed(2)}</span>
                            </CardDescription>
                        </CardFooter>
                    </Card>
                </div>
                <div className="flex flex-col items-center p-2 pb-3 space-y-3">
                    <AccountPie 
                    balance={balance}
                    profit={profit}
                    loss={loss}
                    />
                </div>
            </div>
        </div>
    )
}