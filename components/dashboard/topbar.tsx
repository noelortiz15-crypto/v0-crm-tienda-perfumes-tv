"use client"

import { Menu, User } from "lucide-react"

interface TopBarProps {
  onMenuClick: () => void
  userEmail: string
}

export function TopBar({ onMenuClick, userEmail }: TopBarProps) {
  return (
    <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
      <button onClick={onMenuClick} className="md:hidden text-slate-300 hover:text-white">
        <Menu size={24} />
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-300">
          <User size={20} />
          <span className="text-sm">{userEmail}</span>
        </div>
      </div>
    </div>
  )
}
