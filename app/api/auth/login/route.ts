import { NextRequest, NextResponse } from "next/server"
import { authenticateUser, createSession } from "@/lib/actions"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "邮箱和密码不能为空" }, { status: 400 })
    }

    // 验证用户
    const user = authenticateUser(email, password)
    
    if (!user) {
      return NextResponse.json({ success: false, message: "邮箱或密码错误" }, { status: 401 })
    }

    // 创建会话
    const session = createSession(user.id)
    
    // 设置cookie
    cookies().set("session_id", session.id, {
      httpOnly: true,
      expires: session.expires,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        name: user.name, 
        role: user.role 
      } 
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "登录失败" }, { status: 500 })
  }
}
