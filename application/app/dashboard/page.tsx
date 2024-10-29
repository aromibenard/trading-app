import Nav from "@/components/nav"
import { Suspense } from "react"

export default function Dashboard() {

    return (
        <div className="p-6 flex flex-col min-h-screen w-dvw">
            <Suspense fallback={<Loading/>}>
                <Nav/>
            </Suspense>
        </div>
    )
}

const Loading = () => {
    return (
        <div>
           <p>loading..</p> 
        </div>
    )
}