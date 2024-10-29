'use client'

import { UserButton, useUser } from "@clerk/nextjs"

export default function Nav() {
    const { isSignedIn, user } = useUser()
    if(!isSignedIn) return null
    
    return (
        <div className="flex justify-between items-center p-2  w-full">
            <div>
                <h1 className="flex text-lg font-medium">
                    Welcome 
                    <span className="mx-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-teal-500">
                        {user.firstName}
                    </span>
                </h1>
            </div>
            <div>
                <UserButton />
            </div>

        </div>
    )
}