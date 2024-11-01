import { getTrades } from "@/actions"
import { auth } from "@clerk/nextjs/server"

export default async function Page() {
    const { userId } = await auth()
    const trades = await getTrades(userId as string)

    return (
        <div className="p-6 grid gap-2">
            <h1 className="text-md text-gray-500">Showing {trades.tradesData.length} results</h1>
            <div className="flex justify-between font-semibold">
                <h2>Currency Pair</h2>
                <h2>Order Type</h2>
                <h2>Result</h2>
                <h3>Amount</h3>
            </div>
            {trades.tradesData.map((trade, id) =>
                <div key={id} className="flex justify-between p-2 border-b">
                    <div>{trade.currencyPair}</div>
                    <div>{trade.type}</div>
                    <div className={trade.result === 'profit' ? 'text-main' : 'text-loss'}>{trade.result}</div>
                    <div className={trade.result === 'profit' ? 'text-main' : 'text-loss'}>{(trade.amount / 100).toFixed(2)}</div>
                </div>
            )}
        </div>
    )
}