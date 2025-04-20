import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/lib/auth"
import { getAppointments } from "@/lib/db"
import { CalendarPlus, FileText } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import AppointmentList from "@/components/appointment-list"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const appointments = await getAppointments(session.user.id)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={session.user} />

      <main className="flex-1 p-6 container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">用户仪表盘</h1>
            <p className="text-muted-foreground">欢迎回来, {session.user.name}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/dashboard/new-appointment">
              <Button>
                <CalendarPlus className="mr-2 h-4 w-4" />
                新建预约
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总预约数</CardTitle>
              <CalendarPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-muted-foreground">您的所有预约记录</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">待处理预约</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.filter((a) => a.status === "pending").length}</div>
              <p className="text-xs text-muted-foreground">等待分配人员和车辆</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已完成预约</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.filter((a) => a.status === "completed").length}</div>
              <p className="text-xs text-muted-foreground">已完成的预约记录</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>我的预约</CardTitle>
              <CardDescription>查看和管理您的所有预约记录</CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentList appointments={appointments} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
