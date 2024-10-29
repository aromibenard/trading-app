
import MetricsBar from "@/components/metrics-nav";
import React from "react";

export default function MetricsLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <section className="flex flex-col w-dvw">
            <MetricsBar/>
            {children}
        </section>
    )
}