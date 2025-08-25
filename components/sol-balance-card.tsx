"use client"
import { useEffect, useState, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"

function short(pk: string) {
  return pk.slice(0, 4) + "…" + pk.slice(-4)
}

export default function SolBalanceCard() {
  const { publicKey, connected } = useWallet()
  const [loading, setLoading] = useState(false)
  const [sol, setSol] = useState<number | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const fetchBalance = useCallback(async () => {
    if (!connected || !publicKey) return

    try {
      setLoading(true)
      setErr(null)
      console.log("[v0] Fetching SOL balance for:", publicKey.toBase58())

      const response = await fetch("/api/solana", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "getBalance",
          params: {
            publicKey: publicKey.toBase58(),
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.success && typeof data.solBalance === "number") {
        setSol(data.solBalance)
        console.log("[v0] SOL balance fetched successfully:", data.solBalance)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (e: any) {
      console.log("[v0] Balance fetch failed:", e.message)
      setErr(e?.message ?? String(e))
      setSol(null)
    } finally {
      setLoading(false)
    }
  }, [connected, publicKey])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return (
    <div className="rounded-xl border p-4 bg-green-50">
      <div className="text-sm text-gray-600">SOL Balance {publicKey ? `(${short(publicKey.toBase58())})` : ""}</div>
      <div className="text-2xl font-semibold">
        {connected ? (sol !== null ? sol.toFixed(4) + " SOL" : loading ? "Loading…" : "—") : "Connect wallet"}
      </div>
      <div className="mt-2 flex gap-2">
        <button
          onClick={fetchBalance}
          disabled={!connected || loading}
          className="rounded-md px-3 py-1 border hover:bg-gray-50 disabled:opacity-50"
          title="Refresh"
        >
          ↻
        </button>
      </div>
      {err && <div className="mt-2 text-xs text-red-600">Error: {err}</div>}
    </div>
  )
}
