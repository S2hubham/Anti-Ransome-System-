// src/components/Navbar.jsx
import React from "react"
import { Link, useLocation } from "react-router-dom"
import { HiOutlineHome } from "react-icons/hi"

const NavItem = ({ to, children }) => {
  const loc = useLocation()
  const active = loc.pathname === to
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded ${active ? "nav-link active" : "nav-link"}`}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  )
}

export default function Navbar() {
  return (
    <header className="card-sm" role="banner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <HiOutlineHome size={22} />
        <div>
          <div style={{ fontWeight: 800 }}>Ransomware Defence</div>
          <div className="muted text-xs">Operational console</div>
        </div>
      </div>

      <nav aria-label="Primary" style={{ display: "flex", gap: "0.5rem" }}>
        <NavItem to="/dashboard">Dashboard</NavItem>
        <NavItem to="/alerts">Alerts</NavItem>
        <NavItem to="/events">Events</NavItem>
        <NavItem to="/bundles">Forensics</NavItem>
        <NavItem to="/settings">Settings</NavItem>
      </nav>
    </header>
  )
}
