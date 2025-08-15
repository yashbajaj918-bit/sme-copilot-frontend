import React, { useState } from 'react'
import axios from 'axios'

type Msg = { role: 'user' | 'assistant', content: string }

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Hi! I can answer business questions and analyze your data. Ask me anything.' }
  ])
  const [input, setInput] = useState('')

  async function send() {
    if (!input.trim()) return
    const newMsgs = [...messages, { role: 'user', content: input }]
    setMessages(newMsgs)
    setInput('')
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post('/api/chat', {
        messages: newMsgs.map(m => ({ role: m.role, content: m.content }))
      }, { headers: { Authorization: `Bearer ${token}` }})
      setMessages([...newMsgs, { role: 'assistant', content: res.data.answer }])
    } catch (err: any) {
      setMessages([...newMsgs, { role: 'assistant', content: 'Error contacting server.' }])
    }
  }

  function logout() {
    localStorage.clear()
    window.location.href = '/login'
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 border-b bg-white flex items-center justify-between">
        <div className="font-semibold">SME Copilot</div>
        <div className="space-x-2">
          <a className="px-3 py-1 rounded-xl border" href="/insights">Insights</a>
          <button onClick={logout} className="px-3 py-1 rounded-xl border">Logout</button>
        </div>
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 space-y-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
            <div className={`inline-block px-3 py-2 rounded-2xl shadow ${m.role==='user' ? 'bg-black text-white' : 'bg-white'}`}>
              {m.content}
            </div>
          </div>
        ))}
      </main>
      <footer className="p-4 border-t bg-white">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && send()}
                 placeholder="Ask about sales, cashflow, ops..." className="flex-1 border rounded-xl px-3 py-2"/>
          <button onClick={send} className="rounded-xl bg-black text-white px-4">Send</button>
        </div>
      </footer>
    </div>
  )
}
