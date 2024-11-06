import { fetchTradePages, getAllTrades, getTradesCount } from "@/actions"
import Pagination from "@/components/pagination"
import { auth } from "@clerk/nextjs/server"

export default async function Page(
    props: {searchParams? : Promise<{
            query?: string,
            page?: string,
        }>}
) {
    const searchParams = await props.searchParams;

    const { userId } = await auth()
    const query =  searchParams?.query  || ''
    const currentPage = Number(searchParams?.page) || 1
    const [trades, totalPages, tradeCount ] = await Promise.all([
        getAllTrades(currentPage), 
        fetchTradePages(query),
        getTradesCount(userId as string)
    ])

    return (
        <div className="p-6 grid gap-2">
            <p className="text-sm text-gray-500 my-1"> Showing {tradeCount} results</p>
            <div className="flex justify-between font-semibold">
                <h2>Currency Pair</h2>
                <h2>Order Type</h2>
                <h3>Amount</h3>
            </div>
            {trades.map((trade, id) =>
                <div key={id} className={`flex justify-between p-3 border-b border-l-4 ${trade.result === 'profit' ? 
                'border-l-main' : 'border-l-loss'}`}>
                    <div>{trade.currencyPair}</div>
                    <div>{trade.type}</div>
                    <div className={trade.result === 'profit' ? 
                    'text-main' : 'text-loss'}>{(trade.amount / 100).toFixed(2)}</div>
                </div>
            )}
            <Pagination totalPages={totalPages} />
        </div>
    )
}