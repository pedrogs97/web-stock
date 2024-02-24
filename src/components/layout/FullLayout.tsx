import Header from './Header'
import LeftInfoBar from './LeftInfoBar'
import useAuth from '@/hooks/useAuth'
import { useRouter } from 'next/router';
import { useEffect } from 'react'

function FullLayout(props: any) {
    const { isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
        }

    }, [isAuthenticated, router])

    return (
        <div className='flex h-screen w-screen'>
            <div className='flex flex-col w-full'>
                <Header />
                <div className='flex h-full'>
                    <LeftInfoBar {...props}/>
                    <div className='flex w-3/4 h-full bg-blue-50'>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FullLayout