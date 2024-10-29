'use server'

import { z } from "zod"
import { db } from "./db"
import { auth, currentUser } from "@clerk/nextjs/server"

const schema = z.object({
    currencyPair: z.string(),
    type: z.string(),
    result: z.string(),
    amount: z.coerce.number(),
    lotSize: z.coerce.number()
})

export const getAccountDetails = async () => {
    const { userId } = await auth()

    if (!userId) {
        return { message: "User not authenticated" }
    }

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

export async function recordTrade( formData: FormData ) { 
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
    const amountInCents = BigInt(Math.round(amount * 100))
    
    const { userId } = await auth()
    console.log(`User id: ${userId}`)

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
        console.log(`User name: ${userDeets.firstName}`)

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
                balance: BigInt(0),
                profit: BigInt(0),
                loss: BigInt(0),
            }
        })
    }

    // records the trade
    await db.trade.create({
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
    })

    const today = new Date()
    let dailySummary = await db.dailySummary.findFirst({
        where: {
            userId: userId,
            date: {
                gte: new Date(today.setHours(0,0,0,0)),
                lt: new Date(today.setHours(23, 59, 59, 999))
            }
        }
    })

    const isProfit = result == 'profit'
    const amountChange = isProfit ? amountInCents
    : -amountInCents

    await db.account.update({
        where: { id: account?.id },
        data: {
            userId: userId,
            balance: { increment: amountChange },
            profit: { increment: isProfit ? amountInCents : BigInt(0) },
            loss: {increment: isProfit ? BigInt(0) : amountInCents }
        }
    })

        if (!dailySummary) {
            dailySummary = await db.dailySummary.create({
                data: {
                    userId: userId,
                    date: new Date(),
                    tradeCount: 1,
                    balance: account?.balance + amountChange,
                    profit: isProfit ? amountInCents : BigInt(0) ,
                    loss: isProfit ? BigInt(0) : amountInCents,
                    accountId: account?.id
                }
            })
        }

        await db.dailySummary.update({ 
            where: { id: dailySummary.id},
            data: {
                userId: userId,
                tradeCount: dailySummary?.tradeCount + 1,
                balance: account?.balance + amountChange,
                profit: dailySummary.profit + ( isProfit ? amountInCents : BigInt(0)),
                loss: dailySummary.loss + ( isProfit ? BigInt(0) : amountInCents ),
                accountId: account?.id
            }
        })
}
