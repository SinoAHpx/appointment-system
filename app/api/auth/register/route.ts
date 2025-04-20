import { NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/actions"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "所有字段都是必填的" }, { status: 400 })
    }

    const user = createUser(name, email, password)
    
    if (!user) {
      return NextResponse.json({ success: false, message: "邮箱已被注册" }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "注册成功" })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ success: false, message: "注册失败" }, { status: 500 })
  }
}
