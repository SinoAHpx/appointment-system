import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getStaff, createStaff } from "@/lib/db"

export async function GET() {
  try {
    // 验证管理员权限
    await requireAdmin()

    const staff = await getStaff()

    return NextResponse.json({
      success: true,
      staff,
    })
  } catch (error) {
    console.error("Get staff error:", error)
    return NextResponse.json({ success: false, message: "获取人员失败" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // 验证管理员权限
    await requireAdmin()

    const data = await request.json()

    // 验证必填字段
    if (!data.name || !data.phone) {
      return NextResponse.json({ success: false, message: "姓名和电话是必填的" }, { status: 400 })
    }

    // 创建人员
    const staff = await createStaff({
      name: data.name,
      phone: data.phone,
    })

    return NextResponse.json({
      success: true,
      staff,
    })
  } catch (error) {
    console.error("Create staff error:", error)
    return NextResponse.json({ success: false, message: "创建人员失败" }, { status: 500 })
  }
}
