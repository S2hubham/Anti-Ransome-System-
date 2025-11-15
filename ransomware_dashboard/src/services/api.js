import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 5000,
})

export async function fetchEvents({ page = 1, page_size = 20, verdict, min_entropy, max_entropy, path_contains } = {}) {
  const params = { page, page_size }
  if (verdict) params.verdict = verdict
  if (min_entropy !== undefined) params.min_entropy = min_entropy
  if (max_entropy !== undefined) params.max_entropy = max_entropy
  if (path_contains) params.path_contains = path_contains

  const res = await API.get('/events/', { params })
  return res.data
}


export async function fetchEvent(id){
  const res = await API.get(`/events/${id}`)
  return res.data
}

export async function fetchStats(){
  const res = await API.get('/stats/')
  return res.data
}

export async function fetchBundles(){
  const res = await API.get('/bundles/')
  return res.data
}

export async function downloadBundle(id){
  const res = await API.get(`/bundles/${id}`)
  return res.data
}

export async function fetchConfig(){
  const res = await API.get('/config/')
  return res.data
}

export async function updateConfig(cfg){
  const res = await API.post('/config/update', cfg)
  return res.data
}
