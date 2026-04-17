const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || 'http://127.0.0.1:8080'
const WS_BASE_URL = (import.meta.env.VITE_WS_BASE_URL as string | undefined)?.trim() || 'ws://127.0.0.1:8080'

type ApiResponse<T> = {
  code: number
  msg?: string
  error?: string
  data: T
}

type LoginData = {
  user_id: number
  token: string
}

export type LoginPayload = {
  user_name: string
  password: string
}

export type RegisterPayload = {
  user_name: string
  password: string
  nickname: string
  avatar?: string
  user_id?: number
}

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const body = (await response.json()) as ApiResponse<T> | { error?: string }
  if (!response.ok) {
    throw new Error((body as { error?: string }).error || `请求失败: ${response.status}`)
  }
  return (body as ApiResponse<T>).data
}

export async function login(payload: LoginPayload): Promise<LoginData> {
  return postJson<LoginData>('/api/login', payload)
}

export async function register(payload: RegisterPayload): Promise<boolean> {
  const data = await postJson<boolean>('/api/register', payload)
  return Boolean(data)
}

export function getWsUrl(token: string): string {
  const wsBase = WS_BASE_URL.endsWith('/') ? WS_BASE_URL.slice(0, -1) : WS_BASE_URL
  return `${wsBase}/ws?token=${encodeURIComponent(token)}`
}
