"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileText, LogOut, Truck, User, Users } from "lucide-react"

export default function AdminHeader({ user }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b">
      <Link href="/admin/dashboard" className="flex items-center justify-center">
        <span className="text-xl font-bold">预约登记系统 (管理员)</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link href="/admin/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
          仪表盘
        </Link>
        <Link href="/admin/staff" className="text-sm font-medium hover:underline underline-offset-4">
          人员管理
        </Link>
        <Link href="/admin/vehicles" className="text-sm font-medium hover:underline underline-offset-4">
          车辆管理
        </Link>
        <Link href="/admin/export" className="text-sm font-medium hover:underline underline-offset-4">
          数据导出
        </Link>
      </nav>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-4">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user.name} (管理员)</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/admin/staff">
              <Users className="mr-2 h-4 w-4" />
              人员管理
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/vehicles">
              <Truck className="mr-2 h-4 w-4" />
              车辆管理
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/export">
              <FileText className="mr-2 h-4 w-4" />
              数据导出
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
