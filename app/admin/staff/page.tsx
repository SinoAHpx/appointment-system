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

export default function StaffManagementPage() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  })
  const [editingId, setEditingId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const response = await fetch("/api/staff")
      const data = await response.json()

      if (data.success) {
        setStaff(data.staff)
      }
    } catch (error) {
      console.error("Fetch staff error:", error)
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
      const url = editingId ? `/api/staff/${editingId}` : "/api/staff"
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
        fetchStaff()
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

  const handleEdit = (staffMember) => {
    setFormData({
      name: staffMember.name,
      phone: staffMember.phone,
    })
    setEditingId(staffMember.id)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("确定要删除这个人员吗？")) {
      return
    }

    try {
      const response = await fetch(`/api/staff/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        fetchStaff()
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
      name: "",
      phone: "",
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
            <h1 className="text-3xl font-bold tracking-tight">人员管理</h1>
            <p className="text-muted-foreground">管理系统中的工作人员</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  添加人员
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingId ? "编辑人员" : "添加人员"}</DialogTitle>
                  <DialogDescription>{editingId ? "修改人员信息" : "添加新的工作人员到系统"}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">联系电话</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
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
            <CardTitle>人员列表</CardTitle>
            <CardDescription>系统中所有的工作人员</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">加载中...</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>姓名</TableHead>
                      <TableHead>联系电话</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          暂无人员记录
                        </TableCell>
                      </TableRow>
                    ) : (
                      staff.map((staffMember) => (
                        <TableRow key={staffMember.id}>
                          <TableCell>{staffMember.name}</TableCell>
                          <TableCell>{staffMember.phone}</TableCell>
                          <TableCell>
                            <Badge variant={staffMember.available ? "outline" : "secondary"}>
                              {staffMember.available ? "空闲" : "忙碌"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(staffMember)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(staffMember.id)}>
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
