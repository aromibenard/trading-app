'use client'

import { ChartPie, LayoutDashboard, NotebookPenIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from 'clsx'


const links = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard
    },
    {
        name: 'Record',
        href: '/dashboard/record',
        icon: NotebookPenIcon
    },
    {
        name: 'Metrics',
        href: '/dashboard/metrics',
        icon: ChartPie
    }
]

export default function Links() {
    const pathname = usePathname()
    return(
        <div className="flex flex-col space-y-10">
            {links.map((link) =>{
                const LinkIcon = link.icon
                return(
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            'flex space-x-2 hover:text-main transition pl-1', 
                            { ' border-l-4 py-1 border-main text-main': pathname == link.href },
                        )}
                    >
                        <LinkIcon className="" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                )
            })}
        </div>
    )
}