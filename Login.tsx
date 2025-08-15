import React, { useState } from 'react'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('demo@company.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await axios.post('/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('role', res.data.role)
      window.location.href = '/chat'
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div className="h-screen grid place-items-center">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-2xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold text-center">SME Copilot</h1>
        <input className="w-full border rounded-xl p-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full border rounded-xl p-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="w-full rounded-xl bg-black text-white py-2">Sign in</button>
        <p className="text-xs text-gray-500">Tip: any email/password works here. Emails ending with <code>@admin.com</code> become admin.</p>
      </form>
    </div>
  )
}
