import { getTrades } from "@/actions";
import Form from "@/components/trade-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { PencilLine } from "lucide-react";
import { Suspense } from "react";

export default async function Page() {
    const { userId } = await auth()
    const trades = await getTrades(userId as string)
    return (
        <Card className=" w-dvw rounded-none py-4">
            <CardHeader>
                <CardTitle className="flex justify-around text-lg">
                    Record Trade
                    <span className="mx-2"><PencilLine className="size-5 text-main"/></span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form />
            </CardContent>
            <CardFooter>
                    <CardDescription>
                        Total recorded trades: {trades.tradesData.length}
                    </CardDescription>
            </CardFooter>
        </Card>
    )
}