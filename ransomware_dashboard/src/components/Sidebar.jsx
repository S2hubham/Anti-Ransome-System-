// src/components/Sidebar.jsx
import React from "react"
import { NavLink } from "react-router-dom"
import {
  HiOutlineHome,
  HiOutlineBellAlert,
  HiOutlineFolder,
  HiOutlineCpuChip,
  HiOutlineCog6Tooth
} from "react-icons/hi2"

const links = [
  { to: "/dashboard", label: "Dashboard", icon: <HiOutlineHome size={18} /> },
  { to: "/alerts", label: "Alerts", icon: <HiOutlineBellAlert size={18} /> },
  { to: "/events", label: "Events", icon: <HiOutlineCpuChip size={18} /> },
  { to: "/bundles", label: "Forensics", icon: <HiOutlineFolder size={18} /> },
  { to: "/settings", label: "Settings", icon: <HiOutlineCog6Tooth size={18} /> }
]

export default function Sidebar() {
  return (
    <nav aria-label="Sidebar navigation" style={{ marginTop: 20 }}>
      <div className="brand">
        <div className="logo">RD</div>
        <div>
          <div style={{ fontWeight: 800 }}>Ransomware</div>
          <div className="muted text-xs">Defense Console</div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            aria-current={window.location.pathname === item.to ? "page" : undefined}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {item.icon}
              <span style={{ fontWeight: 700 }}>{item.label}</span>
            </div>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
