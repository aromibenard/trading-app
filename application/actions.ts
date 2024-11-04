'use server'

import { z } from "zod"
import { db } from "./db"
import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { endOfMonth, format } from "date-fns"

const schema = z.object({
    currencyPair: z.string(),
    type: z.string(),
    result: z.string(),
    amount: z.coerce.number(),
    lotSize: z.coerce.number()
})

const year = new Date().getFullYear()


// db transactions 🤑
export async function getTrend( month:string ) {
    const firstDayOfMonth = new Date(`${year}-${month}-01 00:00:00`)
    const lastDayOfMonth = endOfMonth(firstDayOfMonth)

    const [latestBalance, firstAvailableBalance ] = await Promise.all([
        db.dailySummary.findFirst({
            where: {
                date: {
                    gte: firstDayOfMonth,
                }
            },
            select: {
                balance:true
            },
            orderBy: {
                date: 'desc'
            }
        }),
        db.dailySummary.findFirst({
            where: {
                date: {
                    lte: firstDayOfMonth,
                },
            },
            select: {
                balance: true,
            },
            orderBy: {
                date: 'desc',
            },
        })
    ])

    const initialBalance = firstAvailableBalance?.balance || 0
    const currentBalance = latestBalance?.balance || initialBalance

    let percentageChange = 0

    if (initialBalance !== 0) {
        percentageChange = Math.abs(
            ((currentBalance - initialBalance ) / initialBalance ) * 100
        )
    }
    console.log(`init: ${initialBalance} curr: ${currentBalance}`)

    return {
    percentageChange: percentageChange.toFixed(2),
    trend: currentBalance > initialBalance ?
    'up' : 'down',
    initialBalance,
    currentBalance
    }
}

export async function getTrades(userId:string) {
    try {
        const [tradesData, profitableTrades, tradeByCurrency, losingTrades ] = await Promise.all([
            db.trade.findMany({
                where: {
                    userId: userId,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            
            db.trade.findMany({
                where: {
                    userId: userId,
                    result: 'profit',
                }
            }),

            db.trade.findMany({
                where : {
                    userId: userId
                },
                select: {
                    currencyPair: true
                }
            }),

            db.trade.findMany({
                where: {
                    userId: userId,
                    result: 'loss',
                }
            })
        ])
        
        // map : counts occurences of each pair
        const currencyCount = tradeByCurrency.reduce<Record<string, number>>((acc, trade) => {
            // Extract the currencyPair from the current trade object
            const  currencyPair = String(trade.currencyPair)
        
            // Check if the accumulator (acc) already has a key for this currencyPair
            if (acc[currencyPair]) {
                // If it exists, increment the count for that currencyPair
                acc[currencyPair]++
            } else {
                // If it doesn't exist, create a new key for the currencyPair and set it to 1
                acc[currencyPair] = 1
            }
            // Return the updated accumulator for the next iteration
            return acc;
        }, {})

        const chartData = Object.keys(currencyCount).map(currency => ({
            currency: currency,
            count: currencyCount[currency]
        }))


        const count = tradesData.length
        const profitableTradesNumber = profitableTrades.length
        const losingTradesNumber = losingTrades.length
        return { count, tradesData , profitableTradesNumber , chartData, losingTradesNumber}
    } catch (error) {
        throw error
    }
}

export const getAccountDetails = async (userId:string) => {
    try {
        const userAndAccount = await db.user.findUnique({
            where: {
                id: userId
            },
            include: {
                account: true
            }
        })

        if (!userAndAccount) {
            throw new Error("User not found");
        }
        const accountDeets = userAndAccount.account

        return accountDeets

    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function recordTrade( formData: FormData) { 
    const validatedFormData = schema.safeParse({
        currencyPair: formData.get('currencyPair'),
        type: formData.get('orderType'),
        result: formData.get('result'),
        amount: formData.get('amount'),
        lotSize: formData.get('lotSize')
    })
    
    if (!validatedFormData.success) {
        return {
            errors: validatedFormData.error.flatten().fieldErrors,
            message: 'Please enter valid details'
        }
    }
    
    const { currencyPair, type, result, lotSize, amount } = validatedFormData.data
    const amountInCents = Math.round(amount * 100)
    
    const { userId } = await auth()

    if (!userId) {
        return { message: "User not authenticated" }
    }

    const user = await db.user.findUnique({
        where: { id: userId },
        include: { account: true }
    })

    if (!user) {
        const userDeets = await currentUser()

        if (!userDeets) return {
            message : "failed to retrieve user details"
        }

        await db.user.create({
            data: {
                id: userId,
                name: userDeets?.firstName ?? "no name",
                email: userDeets?.primaryEmailAddress?.emailAddress ?? " no email"
            }
        })
    }
    
    let account = user?.account

    if(!account) {
        account = await db.account.create({
            data: {
                userId: userId,
                balance: 0,
                profit: 0,
                loss: 0,
            }
        })
    }

    const isProfit = result == 'profit'
    const amountChange = isProfit ? amountInCents
    : -amountInCents

    await Promise.all([
        // records the trade
        db.trade.create({
            data: {
                type: type,
                currencyPair: currencyPair,
                result: result,
                amount: amountInCents,
                lotSize: lotSize,
                user: {
                    connect: { id: userId }
                }
            }
        }),
        //updates account
        db.account.update({
            where: { id: account?.id },
            data: {
                userId: userId,
                balance: { increment: amountChange },
                profit: { increment: isProfit ? amountInCents : 0 },
                loss: {increment: isProfit ? 0 : amountInCents }
            }
        })
    ])
    
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    let dailySummary = await db.dailySummary.findFirst({
        where: {
            userId: userId,
            date: {
                gte: startOfDay,
                lt: endOfDay
            }
        }
    })

    if (!dailySummary) {
        dailySummary = await db.dailySummary.create({
            data: {
                userId: userId,
                date: new Date(),
                tradeCount: 1,
                balance: account?.balance + amountChange,
                profit: isProfit ? amountInCents : 0 ,
                loss: isProfit ? 0 : amountInCents,
                accountId: account?.id
            }
        })
    } else {
        await db.dailySummary.update({ 
            where: { id: dailySummary.id},
            data: {
                userId: userId,
                tradeCount: dailySummary?.tradeCount + 1,
                balance: account?.balance + amountChange,
                profit: dailySummary.profit + ( isProfit ? amountInCents : 0),
                loss: dailySummary.loss + ( isProfit ? 0 : amountInCents ),
                accountId: account?.id
            }
        })
    }

    revalidatePath('/dashboard/metrics')
    redirect('/dashboard/metrics')
}

export async function getDailySummaries( month: string ) {
    const firstDayOfMonth = new Date(`${year}-${month}-01 00:00:00`)
    const lastDayOfMonth = endOfMonth(firstDayOfMonth)

    const dailySummaries = await db.dailySummary.findMany({
        where: {
            date: {
                gte: firstDayOfMonth, 
                lte: lastDayOfMonth
            }
        },
        select: {
            date: true,
            balance: true, 
            loss: true, 
            profit: true
        },
        orderBy: {
            date: 'asc'
        }
    })

    const chartData = dailySummaries.map(summary => ({
        date: format(summary.date, 'dd'),
        profit: summary.profit / 100,
        loss: summary.loss / 100,
        balance: summary.balance / 100
    }))

    return chartData
}

export async function getCurrencies() {

}