import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { users, sessions } from "./auth";
import type { User, Session } from "./auth";

export async function loginAction(email: string, password: string) {
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { success: false, message: "邮箱或密码错误" };
  }

  // 创建会话
  const sessionId = Math.random().toString(36).substring(2, 15);
  const session: Session = {
    id: sessionId,
    userId: user.id,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后过期
  };

  sessions.push(session);

  // 设置cookie
  cookies().set("session_id", sessionId, {
    httpOnly: true,
    expires: session.expires,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return { success: true, user: { id: user.id, name: user.name, role: user.role } };
}

export async function registerAction(name: string, email: string, password: string) {
  // 检查邮箱是否已存在
  if (users.some((u) => u.email === email)) {
    return { success: false, message: "邮箱已被注册" };
  }

  // 创建新用户
  const newUser: User = {
    id: (users.length + 1).toString(),
    name,
    email,
    password, // 实际应用中应该哈希密码
    role: "user",
  };

  users.push(newUser);

  return { success: true, message: "注册成功" };
}

export async function logoutAction() {
  const sessionId = cookies().get("session_id")?.value;

  if (sessionId) {
    // 从会话数据库中删除会话
    const index = sessions.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      sessions.splice(index, 1);
    }

    // 删除cookie
    cookies().delete("session_id");
  }

  return { success: true };
} 