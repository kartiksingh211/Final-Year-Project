import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { SignIn, useAuth, useUser } from '@clerk/clerk-react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchWorkspaces,
  setCurrentWorkspace
} from '../features/workspaceSlice'
import { loadTheme } from '../features/themeSlice'
import { Loader2Icon } from 'lucide-react'

const Layout = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { user, isLoaded } = useUser()

  const { getToken } = useAuth()

  const { loading, workspaces, currentWorkspace } =
    useSelector((state) => state.workspace)

  const dispatch = useDispatch()

  /* load theme */
  useEffect(() => {

    dispatch(loadTheme())

  }, [])


  /* fetch workspaces */
  useEffect(() => {

    if (isLoaded && user) {

      dispatch(fetchWorkspaces({ getToken }))

    }

  }, [isLoaded, user])


  /* AUTO SELECT FIRST WORKSPACE */
  useEffect(() => {

    if (
      workspaces.length > 0 &&
      !currentWorkspace
    ) {

      dispatch(
        setCurrentWorkspace(workspaces[0].id)
      )

    }

  }, [workspaces])


  if (!isLoaded) {

    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="animate-spin" />
      </div>
    )

  }


  if (!user) {

    return (
      <div className="flex items-center justify-center h-screen">
        <SignIn />
      </div>
    )

  }


  if (loading) {

    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="animate-spin" />
      </div>
    )

  }


  return (

    <div className="flex h-screen">

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col">

        <Navbar
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="flex-1 overflow-auto p-6">

          <Outlet />

        </div>

      </div>

    </div>

  )

}

export default Layout