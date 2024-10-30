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
                <h1>Karibu <span className="font-medium drop-shadow-md bg-gradient-to-r bg-clip-text text-transparent from-purple-400 to-black via-purple-600">{user?.firstName}</span></h1>
                <span><UserButton/></span>
            </div>
            <div className="px-2 w-full mx-auto shadow rounded-md grid md:grid-cols-2">
                <div className="grid grid-cols-2  gap-1 p-1 py-2">
                    <div>
                        <h1 className="flex items-center font-bold pt-1 text-3xl text-papo"><DollarSign className="size-6"/><span className="">{balance.toFixed(2)}</span></h1>
                        <p className="pl-1 text-xs text-gray-700 -mt-1">Available balance</p>
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
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Strike Rate</CardTitle>
                            <CardDescription>Showing results for {count} trades</CardDescription>
                        </CardHeader>
                        <CardContent className="grid items-center justify-center">
                            <h1 className="text-xl font-semibold text-papo">{strikeRate.toFixed(2)}%</h1>
                        </CardContent>
                        <CardFooter>
                            <CardDescription className="">
                                Profit factor:${profitFactor.toFixed(2)}
                            </CardDescription>
                        </CardFooter>
                    </Card>
                </div>
                <div className="flex flex-col items-center p-2 pb-3">
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