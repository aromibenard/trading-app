import { getAccountDetails, getTrades } from "@/actions"
import Nav from "@/components/nav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@clerk/nextjs/server"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

export default async function Dashboard() {
    const { userId } = await auth()
    const [ trades, account] = await Promise.all([
        getTrades(userId as string),
        getAccountDetails(userId as string)
    ])

    if(!trades && !account) {
        return <p>no data</p>
    }

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
        <div className="p-6 flex flex-col min-h-screen w-dvw space-y-6">
            <Suspense fallback={<Loading/>}>
                <Nav/>
            </Suspense>
            <div className="grid grid-rows-8 h-full gap-3">
                <div className=" row-span-2 grid grid-cols-2 gap-3">
                    <Card className="bg-slate-50">
                        <CardHeader>
                            <CardTitle className="text-sky-700">Profit Factor</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardTitle className={`text-xl font-extrabold drop-shadow-sm
                                ${ profitFactor < 1 ? 'text-rose-500' : 
                                    profitFactor === 1 ? 'text-orange-500' :
                                    profitFactor >= 1.5 && profitFactor <= 1.9  ? 'text-blue-500' :
                                    profitFactor >= 2 && profitFactor <= 2.9  ? 'text-purple-600' :
                                    profitFactor >= 3 && profitFactor <= 3.9  ? 'text-green-400' :
                                    'text-green-900'}
                                `}>{profitFactor.toFixed(2)}</CardTitle>
                        </CardContent>
                    </Card>
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="text-sky-700">Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="font-extrabold text-xl text-green-400">{(account!.balance / 100).toFixed(2)} USD</CardTitle>
                        </CardContent>
                    </Card>
                </div>
                <Card className="bg-green-500 row-span-4">
                    <CardHeader>
                        <CardTitle className="text-blue-800">Dive into the Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Image
                        src={'/ill.svg'}
                        alt="analytics image"
                        height={300}
                        width={200}
                        className="object-cover"
                        />
                    </CardContent>
                    <CardFooter>
                    <Link href={'dashboard/metrics'} className="bg-rose-500 text-white p-2 px-4 rounded shadow hover:opacity-90 transition">Jump in</Link>
                    </CardFooter>
                </Card>
                <div className=" row-span-2 grid grid-cols-2 gap-3">
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="text-blue-700">Strike Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="font-extrabold text-xl text-purple-700">{strikeRate.toFixed(2)}%</CardTitle>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-100">
                        <CardHeader>
                            <CardTitle className="text-blue-700">Trades</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="font-extrabold text-xl text-green-500">{count}</CardTitle>
                            <CardDescription>
                            {trades.profitableTradesNumber} wins   {trades.losingTradesNumber} losses
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

const Loading = () => {
    return (
        <div>
           <p>loading..</p> 
        </div>
    )
}