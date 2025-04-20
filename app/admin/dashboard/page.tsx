import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth"
import { getAppointments, getStaff, getVehicles } from "@/lib/db"
import { CalendarPlus, FileText, Truck, Users } from "lucide-react"
import AdminHeader from "@/components/admin-header"
import AdminAppointmentList from "@/components/admin-appointment-list"

export default async function AdminDashboardPage() {
  const session = await requireAdmin()

  const appointments = await getAppointments()
  const staff = await getStaff()
  const vehicles = await getVehicles()

  const pendingAppointments = appointments.filter((a) => a.status === "pending")
  const assignedAppointments = appointments.filter((a) => a.status === "assigned")
  const completedAppointments = appointments.filter((a) => a.status === "completed")

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader user={session.user} />

      <main className="flex-1 p-6 container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">管理员仪表盘</h1>
            <p className="text-muted-foreground">欢迎回来, {session.user.name}</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            <Link href="/admin/staff">
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                管理人员
              </Button>
            </Link>
            <Link href="/admin/vehicles">
              <Button variant="outline">
                <Truck className="mr-2 h-4 w-4" />
                管理车辆
              </Button>
            </Link>
            <Link href="/admin/export">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                导出数据
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总预约数</CardTitle>
              <CalendarPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-muted-foreground">所有预约记录</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">待处理预约</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">等待分配人员和车辆</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">可用人员</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {staff.filter((s) => s.available).length} / {staff.length}
              </div>
              <p className="text-xs text-muted-foreground">当前可用/总人员</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">可用车辆</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vehicles.filter((v) => v.available).length} / {vehicles.length}
              </div>
              <p className="text-xs text-muted-foreground">当前可用/总车辆</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>待处理预约</CardTitle>
              <CardDescription>需要分配人员和车辆的预约</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminAppointmentList
                appointments={pendingAppointments}
                staff={staff.filter((s) => s.available)}
                vehicles={vehicles.filter((v) => v.available)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>进行中的预约</CardTitle>
              <CardDescription>已分配人员和车辆的预约</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminAppointmentList appointments={assignedAppointments} showComplete={true} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
