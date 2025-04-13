import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import type { NextRequest } from "next/server"
import type { PropsWithChildren } from "react"
import { cookies } from "next/headers"
import { User } from "@/models/User.model"
import { redirect } from "next/navigation"
export default async function Layout(props: PropsWithChildren<{ url: string }>) {
  const cookieStore = await cookies()
  const enroll = cookieStore.get('enroll')?.value
  const user = await User.findOne({ enrollment:enroll })
  if (!user) {
    redirect('/login')
  }
  const userJSON = JSON.parse(JSON.stringify( user.toJSON()))
 
  return (
    <SidebarProvider>
      <AppSidebar user={userJSON} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
        </header>
        {props.children}
      </SidebarInset>
    </SidebarProvider>
  )
}
