import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { Keypair } from "@solana/web3.js"
import bs58 from "bs58"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting real Pump.fun token creation...")
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      console.log("[v0] Authentication failed:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, symbol, description, image, website, creator, buyAmount } = await request.json()
    console.log("[v0] Token data received:", { name, symbol, description, creator, buyAmount })

    // Validate required fields
    if (!name || !symbol || !description || !creator) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const mintKeypair = Keypair.generate()
    console.log("[v0] Generated mint keypair:", mintKeypair.publicKey.toString())

    const formData = new FormData()

    // Handle image upload - if it's a blob URL, fetch the actual file
    let imageFile: File | Blob
    if (image && image.startsWith("blob:")) {
      const response = await fetch(image)
      imageFile = await response.blob()
    } else if (image) {
      // If it's a base64 or other format, convert to blob
      const response = await fetch(image)
      imageFile = await response.blob()
    } else {
      // Use a default image if none provided
      imageFile = new Blob([""], { type: "image/png" })
    }

    formData.append("file", imageFile, "token-image.png")
    formData.append("name", name)
    formData.append("symbol", symbol)
    formData.append("description", description)
    formData.append("twitter", "")
    formData.append("telegram", "")
    formData.append("website", website || "https://gitr.fun")
    formData.append("showName", "true")

    console.log("[v0] Uploading metadata to IPFS...")

    const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
      method: "POST",
      body: formData,
    })

    if (!metadataResponse.ok) {
      console.error("[v0] IPFS upload failed:", await metadataResponse.text())
      throw new Error("Failed to upload metadata to IPFS")
    }

    const metadataResult = await metadataResponse.json()
    console.log("[v0] IPFS upload successful:", metadataResult)

    const tokenMetadata = {
      name: name,
      symbol: symbol,
      uri: metadataResult.metadataUri,
    }

    const createTokenPayload = {
      action: "create",
      tokenMetadata: tokenMetadata,
      mint: mintKeypair.publicKey.toString(), // Use public key for mint address
      denominatedInSol: "true",
      amount: buyAmount || 0, // Allow 0 for free launches
      slippage: 10,
      priorityFee: 0.0005,
      pool: "pump",
    }

    console.log("[v0] Creating token on PumpPortal...")
    console.log("[v0] Using mint address:", mintKeypair.publicKey.toString())
    console.log("[v0] Private key for signing:", bs58.encode(mintKeypair.secretKey))

    const pumpResponse = await fetch("https://pumpportal.fun/api/trade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Private-Key": bs58.encode(mintKeypair.secretKey),
      },
      body: JSON.stringify(createTokenPayload),
    })

    if (!pumpResponse.ok) {
      const errorText = await pumpResponse.text()
      console.error("[v0] PumpPortal API error:", errorText)
      throw new Error(`PumpPortal API failed: ${pumpResponse.status} ${errorText}`)
    }

    const pumpResult = await pumpResponse.json()
    console.log("[v0] PumpPortal success:", pumpResult)

    const tokenData = {
      mint: mintKeypair.publicKey.toString(),
      bondingCurve: pumpResult.bondingCurve || "N/A",
      associatedBondingCurve: pumpResult.associatedBondingCurve || "N/A",
      metadata: pumpResult.metadata || "N/A",
      metadataUri: metadataResult.metadataUri,
      signature: pumpResult.signature,
    }

    return NextResponse.json({
      transaction: pumpResult.signature,
      tokenData: tokenData,
      success: true,
      message: "Token created successfully on Pump.fun!",
    })
  } catch (error) {
    console.error("[v0] Error in real Pump.fun token creation:", error)
    return NextResponse.json(
      {
        error: "Failed to create token on Pump.fun",
        details: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 },
    )
  }
}
