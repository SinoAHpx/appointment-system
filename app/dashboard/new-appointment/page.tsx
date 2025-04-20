"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash } from "lucide-react"

export default function NewAppointmentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    contactName: "",
    contactPhone: "",
    address: "",
    appointmentDate: null,
    items: [{ type: "文件袋", quantity: 1 }],
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (date) => {
    setFormData((prev) => ({ ...prev, appointmentDate: date }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
    setFormData((prev) => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { type: "", quantity: 1 }],
    }))
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = [...formData.items]
      newItems.splice(index, 1)
      setFormData((prev) => ({ ...prev, items: newItems }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.appointmentDate) {
      setError("请选择预约日期")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactName: formData.contactName,
          contactPhone: formData.contactPhone,
          address: formData.address,
          appointmentTime: formData.appointmentDate.toISOString(),
          items: formData.items,
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push("/dashboard")
      } else {
        setError(data.message || "创建预约失败")
      }
    } catch (err) {
      setError("创建预约过程中出现错误")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>创建新预约</CardTitle>
          <CardDescription>填写以下信息创建文件销毁预约</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">联系人姓名</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">联系电话</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">地址</Label>
                <Textarea id="address" name="address" value={formData.address} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label>预约日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.appointmentDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.appointmentDate ? (
                        format(formData.appointmentDate, "yyyy年MM月dd日")
                      ) : (
                        <span>选择日期</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.appointmentDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>销毁物品</Label>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`item-type-${index}`} className="text-xs">
                        物品类型
                      </Label>
                      <Input
                        id={`item-type-${index}`}
                        value={item.type}
                        onChange={(e) => handleItemChange(index, "type", e.target.value)}
                        required
                      />
                    </div>
                    <div className="w-24">
                      <Label htmlFor={`item-quantity-${index}`} className="text-xs">
                        数量
                      </Label>
                      <Input
                        id={`item-quantity-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value))}
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length <= 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  添加物品
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "提交中..." : "创建预约"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
