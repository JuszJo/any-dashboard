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

import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");

      const json = await response.json();

      return json;
    },
  })

  // if(error && !isLoading) {
  //   return <div>Error</div>
  // }

  if(error && !isLoading) {
    console.log(error);
  }

  if(data) {
    console.log(data);
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  <Link to={"test"}>TEST</Link>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
