// src/services/api.js
import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 8000,
})

function logApiError(err) {
  console.error("[API ERROR]", err?.response?.data || err.message || err)
}

export async function fetchEvents(params = {}) {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    )

    const res = await API.get("/events/", { params: cleanParams })
    return res.data
  } catch (err) {
    logApiError(err)
    throw err
  }
}

export async function fetchEvent(id) {
  try {
    return (await API.get(`/events/${id}`)).data
  } catch (err) {
    logApiError(err)
    throw err
  }
}

export async function fetchStats() {
  try {
    return (await API.get("/stats/")).data
  } catch (err) {
    logApiError(err)
    return {}
  }
}

export async function fetchBundles() {
  try {
    return (await API.get("/bundles/")).data
  } catch (err) {
    logApiError(err)
    throw err
  }
}

export async function downloadBundle(id) {
  try {
    return (await API.get(`/bundles/${id}`)).data
  } catch (err) {
    logApiError(err)
    throw err
  }
}

export async function fetchConfig() {
  try {
    return (await API.get("/config/")).data
  } catch (err) {
    logApiError(err)
    throw err
  }
}

export async function updateConfig(cfg) {
  try {
    return (await API.post("/config/update", cfg)).data
  } catch (err) {
    logApiError(err)
    throw err
  }
}
