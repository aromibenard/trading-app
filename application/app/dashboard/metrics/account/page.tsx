import { getAccountDetails } from "@/actions"
import { auth } from "@clerk/nextjs/server"

export default async function Page() {
    const { userId } = await auth()
    if (!userId) {
        return { message: "User not authenticated" }
    }

    return (
        <div className="flex flex-col p-4">
            <div className=" grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border">
                    1
                </div>
                <div className="border">2</div>
                <div className="border">3</div>
                <div className="border">4</div>
            </div>
        </div>
    )
}