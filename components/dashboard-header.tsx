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
import { CalendarPlus, LogOut, User } from "lucide-react"

export default function DashboardHeader({ user }) {
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
      <Link href="/dashboard" className="flex items-center justify-center">
        <span className="text-xl font-bold">预约登记系统</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
          仪表盘
        </Link>
        <Link href="/dashboard/new-appointment" className="text-sm font-medium hover:underline underline-offset-4">
          新建预约
        </Link>
      </nav>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-4">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/new-appointment">
              <CalendarPlus className="mr-2 h-4 w-4" />
              新建预约
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
