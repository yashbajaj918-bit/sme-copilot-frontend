import React, { useState } from 'react'
import axios from 'axios'

export default function Insights() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function upload() {
    if (!file) return
    setError(null)
    const token = localStorage.getItem('token')
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await axios.post('/api/upload', form, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
      setResult(res.data)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Upload failed')
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 border-b bg-white flex items-center justify-between">
        <div className="font-semibold">Insights</div>
        <a className="px-3 py-1 rounded-xl border" href="/chat">Chat</a>
      </header>
      <main className="p-4 max-w-4xl mx-auto space-y-4">
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Upload CSV</h2>
          <input type="file" accept=".csv" onChange={e=>setFile(e.target.files?.[0] || null)} className="mt-2"/>
          <button onClick={upload} className="ml-2 px-3 py-1 rounded-xl bg-black text-white">Analyze</button>
          {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
        </div>
        {result && (
          <div className="bg-white p-4 rounded-2xl shadow space-y-2">
            <div className="font-semibold">Summary</div>
            <pre className="text-sm whitespace-pre-wrap">{result.summary}</pre>
            {result.forecast_preview && (
              <div className="text-sm">Forecast preview: {JSON.stringify(result.forecast_preview)}</div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
