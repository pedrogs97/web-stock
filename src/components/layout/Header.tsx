import useAuth from '@/hooks/useAuth'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

function Header() {
    const { user, logout } = useAuth()
    const [isOpenMenu, setIsOpenMenu] = useState(false)
    const pathname = usePathname()
    function getInitials(fullName: string) {
        const splitedName = fullName?.split(' ')
        if (splitedName.length > 1) {
            return `${splitedName[0].charAt(0)}${splitedName[1].charAt(0)}`
        }

        return `${splitedName[0].charAt(0)}${splitedName[0].charAt(1)}`
    }

    function toggleMenu() {
        setIsOpenMenu((prev) => !prev)
    }

    return (
        <nav className="border-b-2 border-b-gray-100">
            <div className="px-7">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex-shrink-0">
                        <Image width={32} height={32}  src="/next.svg" alt="Your Company" />
                    </div>
                    <Link href="/" className={`${pathname == '/' ? 'text-blue-600 border-blue-600 border-b-2': 'text-gray-500'}  hover:border-b-2 hover:border-blue-600 hover:text-blue-600 px-3 py-2 text-sm font-medium`} aria-current="page">
                        <div className='flex flex-col items-center'>
                            <span className="material-symbols-outlined">
                            stacked_line_chart
                            </span>Dashboard
                        </div>
                    </Link>
                    <Link href="/products" className={`${pathname === '/products' ? 'text-blue-600 border-blue-600 border-b-2': 'text-gray-500'}  hover:border-b-2 hover:border-blue-600 hover:text-blue-600 px-3 py-2 text-sm font-medium`}>
                        <div className='flex flex-col items-center'>
                            <span className="material-symbols-outlined">
                                add_home
                            </span>Novo item
                        </div>
                    </Link>
                    <Link href="/reports" className={`${pathname === '/reports' ? 'text-blue-600 border-blue-600 border-b-2': 'text-gray-500'}  hover:border-b-2 hover:border-blue-600 hover:text-blue-600 px-3 py-2 text-sm font-medium`}>
                        <div className='flex flex-col items-center'>
                            <span className="material-symbols-outlined">
                            insert_chart
                            </span>Relatórios
                        </div>
                    </Link>
                    <div className="ml-4 flex items-center justify-between md:ml-6">
                        <button type="button" className="relative rounded-md bg-green-300 p-2 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            {user && getInitials(user?.fullName)}                                
                        </button>
                        <div className="relative ml-3">
                            <button type="button" onClick={toggleMenu} className="relative flex max-w-xs items-center rounded-full bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                {user?.fullName}
                                <span className="material-symbols-outlined">
                                arrow_drop_down
                                </span>
                            </button>
                            {
                                isOpenMenu && (
                                    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                                        <button type="button" onClick={logout} className="block px-4 py-2 text-sm text-gray-700" role="menuitem" id="user-menu-item-2">Sair</button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header