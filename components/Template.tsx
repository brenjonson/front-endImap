import LoggedDesktopNavbar from "./loggednavbar/LoggedDesktopNavbar"
import LoggedMobileNavbar from "./loggednavbar/LoggedMobileNavbar"

function Template({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen flex p-6">
    <div className='z-10 hidden sm:flex'>
        <LoggedDesktopNavbar />
    </div>

    <div className='sm:hidden'>
        <LoggedMobileNavbar />
    </div>

    <div className="flex-1 ml-0 sm:ml-24 flex flex-col ">
    {children}
    </div>
</div>
  )
}
export default Template