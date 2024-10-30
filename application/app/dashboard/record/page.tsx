import Form from "@/components/trade-form";
import { auth } from "@clerk/nextjs/server";
import { PencilLine } from "lucide-react";

export default async function Page() {
    const { userId } = await auth()
    return (
        <div className="p-4 grid items-center w-dvw">
            <div className="flex flex-col space-y-4">
                <h1 className="font-bold text-lg flex items-center">
                    Record Trade
                    <span className="mx-2"><PencilLine className="size-5"/></span>
                </h1>
                <Form />
            </div>
        </div>
    )
}