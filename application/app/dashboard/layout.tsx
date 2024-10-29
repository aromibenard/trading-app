import SideBar from "@/components/sidebar";
import React from "react";

export default function DashBoardLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <section className="flex">
            <SideBar/>
            {children}
        </section>
    )
}