import { NextRequest, NextResponse } from "next/server"
import { removeSession } from "@/lib/actions"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const sessionId = cookies().get("session_id")?.value
    
    if (sessionId) {
      // 从会话数据库中删除会话
      removeSession(sessionId)
      
      // 删除cookie
      cookies().delete("session_id")
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, message: "登出失败" }, { status: 500 })
  }
}
