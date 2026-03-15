"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()

  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const login = async () => {
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/boss/login",{
        method:"POST",
        headers: {
          "Content-Type": "application/json"
        },
        body:JSON.stringify({username,password})
      })

      if(res.ok){
        router.push("/boss/templates")
        return
      }

      const payload = await res.json().catch(() => null)
      setError(payload?.error || "Login failed")
    } catch {
      setError("Unable to login right now")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Boss Login</h1>
        <p className="mt-1 text-sm text-gray-500">Use your admin credentials to manage templates.</p>

        <div className="mt-5 space-y-3">
          <input
            value={username}
            placeholder="Username"
            onChange={(e)=>setUsername(e.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none ring-0 focus:border-primary"
          />

          <input
            value={password}
            type="password"
            placeholder="Password"
            onChange={(e)=>setPassword(e.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none ring-0 focus:border-primary"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void login()
              }
            }}
          />

          <button
            onClick={login}
            disabled={isLoading || !username.trim() || !password.trim()}
            className="mt-1 h-10 w-full cursor-pointer rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  )
}