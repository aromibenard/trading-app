'use client'

import { ChartPie, NotebookPenIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from 'clsx'


const links = [
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
        <div className="flex flex-col space-y-6">
            {links.map((link) =>{
                const LinkIcon = link.icon
                return(
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx(
                                'flex space-x-2 hover:scale-110 transition', 
                                { 'text-teal-500': pathname == link.href },
                            )}
                        >
                            <LinkIcon />
                            <p className="hidden md:block">{link.name}</p>
                        </Link>

                )
            })}
        
        </div>
    )
    
}