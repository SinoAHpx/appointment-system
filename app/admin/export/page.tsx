"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDown } from "lucide-react"
import AdminHeader from "@/components/admin-header"

export default function ExportDataPage() {
  const [exportType, setExportType] = useState("")
  const [loading, setLoading] = useState(false)
  const [exportData, setExportData] = useState(null)

  const handleExport = async () => {
    if (!exportType) {
      alert("请选择要导出的数据类型")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/export?type=${exportType}`)
      const data = await response.json()

      if (data.success) {
        setExportData(data.data)

        // 创建下载
        const fileName = `${exportType}_${new Date().toISOString().split("T")[0]}.json`
        const json = JSON.stringify(data.data, null, 2)
        const blob = new Blob([json], { type: "application/json" })
        const href = URL.createObjectURL(blob)

        const link = document.createElement("a")
        link.href = href
        link.download = fileName
        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        URL.revokeObjectURL(href)
      } else {
        alert(data.message || "导出失败")
      }
    } catch (error) {
      console.error("Export error:", error)
      alert("导出过程中出现错误")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader user={{ name: "管理员", role: "admin" }} />

      <main className="flex-1 p-6 container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">数据导出</h1>
          <p className="text-muted-foreground">导出系统数据用于备份或分析</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>导出数据</CardTitle>
            <CardDescription>选择要导出的数据类型</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <Select onValueChange={setExportType} value={exportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择数据类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appointments">预约数据</SelectItem>
                    <SelectItem value="staff">人员数据</SelectItem>
                    <SelectItem value="vehicles">车辆数据</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleExport} disabled={loading || !exportType}>
                {loading ? (
                  "导出中..."
                ) : (
                  <>
                    <FileDown className="mr-2 h-4 w-4" />
                    导出数据
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {exportData && (
          <Card>
            <CardHeader>
              <CardTitle>导出预览</CardTitle>
              <CardDescription>已导出的数据预览</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                {JSON.stringify(exportData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
