import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { CreateOrganization, SignIn, useAuth, useUser } from '@clerk/clerk-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWorkspaces } from '../features/workspaceSlice'
import { loadTheme } from '../features/themeSlice'
import { Loader2Icon } from 'lucide-react'

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const { user, isLoaded } = useUser()
    const { getToken } = useAuth()

    const { workspaces, loading } = useSelector((state) => state.workspace)

    const dispatch = useDispatch()

    // Load theme first time
    useEffect(() => {
        dispatch(loadTheme())
    }, [])

    // Fetch workspaces after login
    useEffect(() => {
        if (isLoaded && user) {
            dispatch(fetchWorkspaces({ getToken }))
        }
    }, [isLoaded, user])

    // If user not logged in → show login page
    if (!isLoaded) {
        return (
            <div className='flex items-center justify-center h-screen bg-white dark:bg-zinc-950'>
                <Loader2Icon className="size-7 text-blue-500 animate-spin" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen bg-white dark:bg-zinc-950">
                <SignIn />
            </div>
        )
    }

    // Loading state
    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen bg-white dark:bg-zinc-950'>
                <Loader2Icon className="size-7 text-blue-500 animate-spin" />
            </div>
        )
    }

    // If no workspace exists → show create organization page
    if (user && workspaces.length === 0) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-white dark:bg-zinc-950">
                <CreateOrganization afterCreateOrganizationUrl="/" />
            </div>
        )
    }

    // Main dashboard layout
    return (
        <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100">
            <Sidebar 
                isSidebarOpen={isSidebarOpen} 
                setIsSidebarOpen={setIsSidebarOpen} 
            />

            <div className="flex-1 flex flex-col h-screen">
                <Navbar 
                    isSidebarOpen={isSidebarOpen} 
                    setIsSidebarOpen={setIsSidebarOpen} 
                />

                <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-scroll">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout