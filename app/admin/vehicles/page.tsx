"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash } from "lucide-react"
import AdminHeader from "@/components/admin-header"

export default function VehicleManagementPage() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    plate: "",
    type: "",
  })
  const [editingId, setEditingId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles")
      const data = await response.json()

      if (data.success) {
        setVehicles(data.vehicles)
      }
    } catch (error) {
      console.error("Fetch vehicles error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const url = editingId ? `/api/vehicles/${editingId}` : "/api/vehicles"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        fetchVehicles()
        resetForm()
        setIsDialogOpen(false)
      } else {
        alert(data.message || "操作失败")
      }
    } catch (error) {
      console.error("Submit error:", error)
      alert("提交过程中出现错误")
    }
  }

  const handleEdit = (vehicle) => {
    setFormData({
      plate: vehicle.plate,
      type: vehicle.type,
    })
    setEditingId(vehicle.id)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("确定要删除这个车辆吗？")) {
      return
    }

    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        fetchVehicles()
      } else {
        alert(data.message || "删除失败")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("删除过程中出现错误")
    }
  }

  const resetForm = () => {
    setFormData({
      plate: "",
      type: "",
    })
    setEditingId(null)
  }

  const handleDialogOpen = (open) => {
    if (!open) {
      resetForm()
    }
    setIsDialogOpen(open)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader user={{ name: "管理员", role: "admin" }} />

      <main className="flex-1 p-6 container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">车辆管理</h1>
            <p className="text-muted-foreground">管理系统中的车辆</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  添加车辆
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingId ? "编辑车辆" : "添加车辆"}</DialogTitle>
                  <DialogDescription>{editingId ? "修改车辆信息" : "添加新的车辆到系统"}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="plate">车牌号</Label>
                    <Input id="plate" name="plate" value={formData.plate} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">车辆类型</Label>
                    <Input id="type" name="type" value={formData.type} onChange={handleChange} required />
                  </div>
                  <DialogFooter>
                    <Button type="submit">{editingId ? "保存" : "添加"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>车辆列表</CardTitle>
            <CardDescription>系统中所有的车辆</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">加载中...</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>车牌号</TableHead>
                      <TableHead>车辆类型</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          暂无车辆记录
                        </TableCell>
                      </TableRow>
                    ) : (
                      vehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell>{vehicle.plate}</TableCell>
                          <TableCell>{vehicle.type}</TableCell>
                          <TableCell>
                            <Badge variant={vehicle.available ? "outline" : "secondary"}>
                              {vehicle.available ? "空闲" : "使用中"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(vehicle)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(vehicle.id)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
