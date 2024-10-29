import { getAccountDetails } from "@/actions"

export default async function Page() {
    const account = await getAccountDetails()
    return (
        <div className="p-4">
            <p>{account?.balance.toString()}</p>
        </div>
    )
}