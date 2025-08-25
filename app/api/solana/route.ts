import { type NextRequest, NextResponse } from "next/server"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"

const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com"

export async function POST(request: NextRequest) {
  try {
    const { method, params } = await request.json()

    console.log("[v0] Solana API request:", { method, params })

    const connection = new Connection(RPC_URL, "confirmed")

    switch (method) {
      case "getBalance": {
        const { publicKey } = params
        if (!publicKey) {
          return NextResponse.json({ error: "Missing publicKey parameter" }, { status: 400 })
        }

        try {
          const pubKey = new PublicKey(publicKey)
          const balance = await connection.getBalance(pubKey)
          const solBalance = balance / LAMPORTS_PER_SOL

          console.log("[v0] Balance fetched:", { publicKey, balance, solBalance })

          return NextResponse.json({
            success: true,
            balance: balance,
            solBalance: solBalance,
          })
        } catch (error) {
          console.error("[v0] Error fetching balance:", error)
          return NextResponse.json(
            { error: "Failed to fetch balance", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 },
          )
        }
      }

      default:
        return NextResponse.json({ error: `Unsupported method: ${method}` }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Solana API error:", error)
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
  }
}
