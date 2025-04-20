"use client"

import { useState } from "react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"

export default function AdminAppointmentList({ appointments, staff = [], vehicles = [], showComplete = false }) {
  const router = useRouter()
  const [loading, setLoading] = useState({})
  const [selectedStaff, setSelectedStaff] = useState({})
  const [selectedVehicle, setSelectedVehicle] = useState({})

  // 状态映射
  const statusMap = {
    pending: { label: "待处理", variant: "outline" },
    assigned: { label: "已分配", variant: "secondary" },
    completed: { label: "已完成", variant: "default" },
    cancelled: { label: "已取消", variant: "destructive" },
  }

  const handleAssign = async (appointmentId) => {
    if (!selectedStaff[appointmentId] || !selectedVehicle[appointmentId]) {
      alert("请选择人员和车辆")
      return
    }

    setLoading((prev) => ({ ...prev, [appointmentId]: true }))

    try {
      const response = await fetch(`/api/appointments/${appointmentId}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staffId: selectedStaff[appointmentId],
          vehicleId: selectedVehicle[appointmentId],
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.refresh()
      } else {
        alert(data.message || "分配失败")
      }
    } catch (error) {
      console.error("Assign error:", error)
      alert("分配过程中出现错误")
    } finally {
      setLoading((prev) => ({ ...prev, [appointmentId]: false }))
    }
  }

  const handleComplete = async (appointmentId) => {
    setLoading((prev) => ({ ...prev, [appointmentId]: true }))

    try {
      const response = await fetch(`/api/appointments/${appointmentId}/complete`, {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        router.refresh()
      } else {
        alert(data.message || "完成预约失败")
      }
    } catch (error) {
      console.error("Complete error:", error)
      alert("完成预约过程中出现错误")
    } finally {
      setLoading((prev) => ({ ...prev, [appointmentId]: false }))
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>预约时间</TableHead>
            <TableHead>联系人</TableHead>
            <TableHead>联系电话</TableHead>
            <TableHead>地址</TableHead>
            <TableHead>物品</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
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
                <TableCell>{appointment.address}</TableCell>
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
                <TableCell>
                  {appointment.status === "pending" ? (
                    <div className="flex flex-col gap-2">
                      <Select
                        onValueChange={(value) => setSelectedStaff({ ...selectedStaff, [appointment.id]: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择人员" />
                        </SelectTrigger>
                        <SelectContent>
                          {staff.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name} ({s.phone})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        onValueChange={(value) => setSelectedVehicle({ ...selectedVehicle, [appointment.id]: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择车辆" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.plate} ({v.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => handleAssign(appointment.id)}
                        disabled={
                          loading[appointment.id] || !selectedStaff[appointment.id] || !selectedVehicle[appointment.id]
                        }
                      >
                        {loading[appointment.id] ? "处理中..." : "分配"}
                      </Button>
                    </div>
                  ) : showComplete && appointment.status === "assigned" ? (
                    <Button
                      onClick={() => handleComplete(appointment.id)}
                      disabled={loading[appointment.id]}
                      variant="outline"
                    >
                      {loading[appointment.id] ? (
                        "处理中..."
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          标记完成
                        </>
                      )}
                    </Button>
                  ) : (
                    <div>
                      {appointment.status === "assigned" && (
                        <>
                          <div className="text-sm">已分配人员: {appointment.assignedStaff}</div>
                          <div className="text-sm">已分配车辆: {appointment.assignedVehicle}</div>
                        </>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
