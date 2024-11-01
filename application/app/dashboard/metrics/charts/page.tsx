import { getAccountDetails, getTrend } from "@/actions";
import { EquityCurve } from "@/components/equity-curve";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
    const { userId } = await auth()
    const [dailySummaries] = await Promise.all([
        getAccountDetails(userId as string)
    ])
    
    return (
        <div className="p-4 min-h-screen">
            <Card className="h-full border-none">
                <CardHeader>
                    <CardTitle>Equity Curve</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <EquityCurve />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}