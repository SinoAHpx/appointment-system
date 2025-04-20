import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getVehicles, createVehicle } from "@/lib/db"

export async function GET() {
  try {
    // 验证管理员权限
    await requireAdmin()

    const vehicles = await getVehicles()

    return NextResponse.json({
      success: true,
      vehicles,
    })
  } catch (error) {
    console.error("Get vehicles error:", error)
    return NextResponse.json({ success: false, message: "获取车辆失败" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // 验证管理员权限
    await requireAdmin()

    const data = await request.json()

    // 验证必填字段
    if (!data.plate || !data.type) {
      return NextResponse.json({ success: false, message: "车牌号和类型是必填的" }, { status: 400 })
    }

    // 创建车辆
    const vehicle = await createVehicle({
      plate: data.plate,
      type: data.type,
    })

    return NextResponse.json({
      success: true,
      vehicle,
    })
  } catch (error) {
    console.error("Create vehicle error:", error)
    return NextResponse.json({ success: false, message: "创建车辆失败" }, { status: 500 })
  }
}
