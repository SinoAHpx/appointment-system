import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { findSessionById, findUserById } from "./actions"

// 用户类型定义
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

// 会话类型定义
export type Session = {
  id: string;
  userId: string;
  expires: Date;
}

// 模拟用户数据库
export const users: User[] = [
  {
    id: "1",
    name: "管理员",
    email: "admin@example.com",
    password: "admin123", // 实际应用中应该使用哈希密码
    role: "admin",
  },
  {
    id: "2",
    name: "用户",
    email: "user@example.com",
    password: "user123",
    role: "user",
  },
]

// 模拟会话数据库
export let sessions: Session[] = []

// 会话管理相关方法
export async function getSession() {
  "use server";
  
  try {
    const sessionId = cookies().get("session_id")?.value;

    if (!sessionId) {
      return null;
    }

    const session = findSessionById(sessionId);

    if (!session || new Date(session.expires) < new Date()) {
      // 会话过期
      return null;
    }

    const user = findUserById(session.userId);

    if (!user) {
      return null;
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function requireAuth() {
  "use server";
  
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return session
}

export async function requireAdmin() {
  "use server";
  
  const session = await getSession()

  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  return session
}
