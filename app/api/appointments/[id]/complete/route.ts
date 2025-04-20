import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { completeAppointment } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 验证管理员权限
    const session = await getSession()
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "无权访问" }, { status: 403 })
    }

    const { id } = params

    const result = await completeAppointment(id)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Complete appointment error:", error)
    return NextResponse.json({ success: false, message: "完成预约失败" }, { status: 500 })
  }
}
