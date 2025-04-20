import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { exportData } from "@/lib/db"

export async function GET(request) {
  try {
    // 验证管理员权限
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (!type) {
      return NextResponse.json({ success: false, message: "请指定导出数据类型" }, { status: 400 })
    }

    const data = await exportData(type)

    if (!data) {
      return NextResponse.json({ success: false, message: "无效的数据类型" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Export data error:", error)
    return NextResponse.json({ success: false, message: "导出数据失败" }, { status: 500 })
  }
}
