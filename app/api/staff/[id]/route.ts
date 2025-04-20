import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getStaffById, updateStaff, deleteStaff } from "@/lib/db"

export async function GET(request, { params }) {
  try {
    // 验证管理员权限
    await requireAdmin()

    const { id } = params
    const staff = await getStaffById(id)

    if (!staff) {
      return NextResponse.json({ success: false, message: "找不到人员" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      staff,
    })
  } catch (error) {
    console.error("Get staff error:", error)
    return NextResponse.json({ success: false, message: "获取人员失败" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    // 验证管理员权限
    await requireAdmin()

    const { id } = params
    const data = await request.json()

    // 验证必填字段
    if (!data.name || !data.phone) {
      return NextResponse.json({ success: false, message: "姓名和电话是必填的" }, { status: 400 })
    }

    // 更新人员
    const staff = await updateStaff(id, {
      name: data.name,
      phone: data.phone,
    })

    if (!staff) {
      return NextResponse.json({ success: false, message: "找不到人员" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      staff,
    })
  } catch (error) {
    console.error("Update staff error:", error)
    return NextResponse.json({ success: false, message: "更新人员失败" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    // 验证管理员权限
    await requireAdmin()

    const { id } = params
    const result = await deleteStaff(id)

    if (!result) {
      return NextResponse.json({ success: false, message: "找不到人员" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("Delete staff error:", error)
    return NextResponse.json({ success: false, message: "删除人员失败" }, { status: 500 })
  }
}
