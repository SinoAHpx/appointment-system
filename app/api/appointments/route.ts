import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createAppointment, getAppointments } from "@/lib/db"
import type { ItemType } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ success: false, message: "未授权" }, { status: 401 })
    }

    const data = await request.json()

    // 验证必填字段
    if (!data.contactName || !data.contactPhone || !data.address || !data.appointmentTime || !data.items) {
      return NextResponse.json({ success: false, message: "所有字段都是必填的" }, { status: 400 })
    }

    // 创建预约
    const appointment = await createAppointment({
      userId: session.user.id,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      address: data.address,
      appointmentTime: data.appointmentTime,
      items: data.items as ItemType[],
    })

    return NextResponse.json({
      success: true,
      appointment,
    })
  } catch (error) {
    console.error("Create appointment error:", error)
    return NextResponse.json({ success: false, message: "创建预约失败" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ success: false, message: "未授权" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    // 根据用户角色获取预约
    const appointments =
      session.user.role === "admin"
        ? await getAppointments(null, status || null)
        : await getAppointments(session.user.id, status || null)

    return NextResponse.json({
      success: true,
      appointments,
    })
  } catch (error) {
    console.error("Get appointments error:", error)
    return NextResponse.json({ success: false, message: "获取预约失败" }, { status: 500 })
  }
}
