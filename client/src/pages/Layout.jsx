import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { SignIn, useAuth, useUser } from '@clerk/clerk-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWorkspaces } from '../features/workspaceSlice'
import { loadTheme } from '../features/themeSlice'
import { Loader2Icon } from 'lucide-react'

const Layout = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const { user, isLoaded } = useUser()
    const { getToken } = useAuth()

    const { loading } = useSelector((state) => state.workspace)

    const dispatch = useDispatch()

    // Load theme
    useEffect(() => {
        dispatch(loadTheme())
    }, [])

    // Fetch workspaces (not blocking UI anymore)
    useEffect(() => {
        if (isLoaded && user) {
            dispatch(fetchWorkspaces({ getToken }))
        }
    }, [isLoaded, user])

    // Show loading while Clerk loads
    if (!isLoaded) {
        return (
            <div className='flex items-center justify-center h-screen bg-white dark:bg-zinc-950'>
                <Loader2Icon className="size-7 text-blue-500 animate-spin" />
            </div>
        )
    }

    // If not logged in → show sign in page
    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen bg-white dark:bg-zinc-950">
                <SignIn />
            </div>
        )
    }

    // Show loader while workspace API loads
    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen bg-white dark:bg-zinc-950'>
                <Loader2Icon className="size-7 text-blue-500 animate-spin" />
            </div>
        )
    }

    // MAIN APP UI (no blocking CreateOrganization loop)
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