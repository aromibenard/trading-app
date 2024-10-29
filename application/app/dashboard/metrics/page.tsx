import { getAccountDetails } from "@/actions"
import { AccountPie } from "@/components/account-pie"
import { UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { DollarSign, Dot } from "lucide-react"

export default async function Page() {
    const user = await currentUser()
    const account = await getAccountDetails(user?.id as string) 
    if(!account) return
    return (
        <div className="p-4 flex-col w-full flex gap-2">
            <div className="flex px-2 justify-between items-center">
                <h1>Karibu <span className="font-medium drop-shadow-md bg-gradient-to-r bg-clip-text text-transparent from-purple-400 to-black via-purple-600">{user?.firstName}</span></h1>
                <span><UserButton/></span>
            </div>
            <div className="px-2 w-5/6 mx-auto shadow rounded-md grid md:grid-cols-2">
                <div className=" flex flex-col p-1">
                    <h1 className="flex items-center font-bold pt-1 text-3xl"><DollarSign className="size-6"/><span className="">{(account?.balance / 100).toFixed(2)}</span></h1>
                    <p className="pl-1 text-xs text-gray-700 -mt-1">Available balance</p>
                    <div className="grid grid-rows-2 space-y-1 my-2">
                        <div className="flex flex-col">
                            <span className="flex text-sm items-center"><Dot className="text-green-500"/>Profit</span>
                            <div>
                                <h2 className="ml-[18px] flex items-center text-sm font-semibold"><DollarSign className="size-4"/>{(account?.profit / 100).toFixed(2)}</h2>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="flex text-sm items-center"><Dot className="text-red-500"/><span>Loss</span></span>
                            <div>
                                <h2 className="ml-[18px] flex items-center text-sm font-semibold"><DollarSign className="size-4"/>{(account?.loss / 100).toFixed(2)}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <AccountPie/>
                </div>
            </div>
        </div>
    )
}