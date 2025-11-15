import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiOutlineHome } from 'react-icons/hi'

const NavItem = ({to, children})=>{
  const loc = useLocation()
  const active = loc.pathname === to
  return (
    <Link to={to} className={`px-3 py-2 rounded ${active ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50'}`}>
      {children}
    </Link>
  )
}

export default function Navbar(){
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <HiOutlineHome className="text-2xl" />
          <div className="text-lg font-bold">Ransomware Defence</div>
        </div>
        <nav className="flex items-center gap-2">
          <NavItem to="/dashboard">Dashboard</NavItem>
          <NavItem to="/alerts">Alerts</NavItem>
          <NavItem to="/events">Events</NavItem>
          <NavItem to="/bundles">Forensics</NavItem>
          <NavItem to="/settings">Settings</NavItem>
        </nav>
      </div>
    </header>
  )
}
