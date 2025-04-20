import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AppointmentList({ appointments }) {
  // 状态映射
  const statusMap = {
    pending: { label: "待处理", variant: "outline" },
    assigned: { label: "已分配", variant: "secondary" },
    completed: { label: "已完成", variant: "default" },
    cancelled: { label: "已取消", variant: "destructive" },
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>预约时间</TableHead>
            <TableHead>联系人</TableHead>
            <TableHead>联系电话</TableHead>
            <TableHead>物品</TableHead>
            <TableHead>状态</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                暂无预约记录
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  {format(new Date(appointment.appointmentTime), "yyyy年MM月dd日 HH:mm", { locale: zhCN })}
                </TableCell>
                <TableCell>{appointment.contactName}</TableCell>
                <TableCell>{appointment.contactPhone}</TableCell>
                <TableCell>
                  {appointment.items.map((item, index) => (
                    <div key={index}>
                      {item.type} x {item.quantity}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <Badge variant={statusMap[appointment.status]?.variant || "outline"}>
                    {statusMap[appointment.status]?.label || appointment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
