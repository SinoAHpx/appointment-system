import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { assignAppointment } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 验证管理员权限
    const session = await getSession()
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "无权访问" }, { status: 403 })
    }

    const { id } = params
    const { staffId, vehicleId } = await request.json()

    if (!staffId || !vehicleId) {
      return NextResponse.json({ success: false, message: "人员和车辆ID是必填的" }, { status: 400 })
    }

    const result = await assignAppointment(id, staffId, vehicleId)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Assign appointment error:", error)
    return NextResponse.json({ success: false, message: "分配预约失败" }, { status: 500 })
  }
}
