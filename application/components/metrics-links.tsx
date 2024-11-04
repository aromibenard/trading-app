'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from 'clsx'

const links = [
    {
        name: 'Charts',
        href: '/dashboard/metrics/charts',
    },
    {
        name: 'Trades',
        href: '/dashboard/metrics/trades',
    }
]

export default function MetricsLinks() {
    const pathname = usePathname()
    return(
        <div className="flex gap-2">
            {links.map((link) =>{
                return(
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx(
                                'flex space-x-2 px-2 hover:text-main transition ', 
                                { 'rounded-sm  text-main': pathname == link.href },
                            )}
                        >
                            <p className="">{link.name}</p>
                        </Link>
                )
            })}
        </div>
    )
}