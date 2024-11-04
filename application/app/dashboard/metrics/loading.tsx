import { Skeleton } from "@/components/ui/skeleton";

export default function Loader() {
    return (
        <div className="flex flex-col md:flex-row space-y-4 md:space-x-6 min-h-screen w-full p-6">
            <div className="w-full rounded-md h-1/3">
                <Skeleton className=" w-full h-full"/>
            </div>
            <div className="w-full rounded-md h-1/3">
                <Skeleton className=" w-full h-full"/>
            </div>
            <div className="w-full rounded-md h-1/3">
                <Skeleton className=" w-full h-full"/>
            </div>
        </div>
    )
}