import type { User, Session } from "./auth";

// 共享用户和会话数据
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
];

export const sessions: Session[] = [];

// 直接的身份验证函数 - 这些不处理cookies，只处理数据
export function authenticateUser(email: string, password: string) {
  const user = users.find((u) => u.email === email && u.password === password);
  
  if (!user) {
    return null;
  }
  
  return user;
}

export function createSession(userId: string) {
  const sessionId = Math.random().toString(36).substring(2, 15);
  const session: Session = {
    id: sessionId,
    userId,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后过期
  };
  
  sessions.push(session);
  return session;
}

export function findUserById(userId: string) {
  return users.find((u) => u.id === userId);
}

export function findSessionById(sessionId: string) {
  return sessions.find((s) => s.id === sessionId);
}

export function removeSession(sessionId: string) {
  const index = sessions.findIndex(s => s.id === sessionId);
  if (index !== -1) {
    sessions.splice(index, 1);
    return true;
  }
  return false;
}

export function createUser(name: string, email: string, password: string) {
  // 检查邮箱是否已存在
  if (users.some((u) => u.email === email)) {
    return null;
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
  return newUser;
} 