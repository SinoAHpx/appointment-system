import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getVehicleById, updateVehicle, deleteVehicle } from "@/lib/db"

export async function GET(request, { params }) {
  try {
    // 验证管理员权限
    await requireAdmin()

    const { id } = params
    const vehicle = await getVehicleById(id)

    if (!vehicle) {
      return NextResponse.json({ success: false, message: "找不到车辆" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      vehicle,
    })
  } catch (error) {
    console.error("Get vehicle error:", error)
    return NextResponse.json({ success: false, message: "获取车辆失败" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    // 验证管理员权限
    await requireAdmin()

    const { id } = params
    const data = await request.json()

    // 验证必填字段
    if (!data.plate || !data.type) {
      return NextResponse.json({ success: false, message: "车牌号和类型是必填的" }, { status: 400 })
    }

    // 更新车辆
    const vehicle = await updateVehicle(id, {
      plate: data.plate,
      type: data.type,
    })

    if (!vehicle) {
      return NextResponse.json({ success: false, message: "找不到车辆" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      vehicle,
    })
  } catch (error) {
    console.error("Update vehicle error:", error)
    return NextResponse.json({ success: false, message: "更新车辆失败" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    // 验证管理员权限
    await requireAdmin()

    const { id } = params
    const result = await deleteVehicle(id)

    if (!result) {
      return NextResponse.json({ success: false, message: "找不到车辆" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("Delete vehicle error:", error)
    return NextResponse.json({ success: false, message: "删除车辆失败" }, { status: 500 })
  }
}
