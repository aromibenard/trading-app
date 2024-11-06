import { Skeleton } from "@/components/ui/skeleton";

export default function Page(){
    return (
        <div className="p-6 flex flex-col min-h-screen w-dvw space-y-6">
            <div>

            </div>
            <div className="grid grid-rows-8 h-full gap-3">
                <div className=" row-span-2 grid grid-cols-2 gap-3">
                    <Skeleton className=""></Skeleton>
                    <Skeleton className="">
                        
                    </Skeleton>
                </div>
                <Skeleton className="row-span-4">

                </Skeleton>
                <div className=" row-span-2 grid grid-cols-2 gap-3">
                    <Skeleton className="">

                    </Skeleton>
                    <Skeleton className="">

                    </Skeleton>
                </div>
            </div>
        </div>
    )
}