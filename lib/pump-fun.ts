// Pump.fun API integration
export interface PumpFunTokenData {
  name: string
  symbol: string
  description: string
  image: string
  twitter?: string
  telegram?: string
  website: string // This will be the GitHub repo URL
}

export interface PumpFunCreateResponse {
  mint: string
  bondingCurve: string
  associatedBondingCurve: string
  metadata: string
  metadataUri: string
}

export interface TokenMetadata {
  name: string
  symbol: string
  description: string
  image: string
  external_url: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
}

// Upload metadata to IPFS (using a service like Pinata or web3.storage)
export async function uploadMetadata(metadata: TokenMetadata): Promise<string> {
  try {
    // For demo purposes, we'll simulate IPFS upload
    // In production, you'd use a service like Pinata, web3.storage, or your own IPFS node
    const response = await fetch("/api/upload-metadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    })

    if (!response.ok) {
      throw new Error("Failed to upload metadata")
    }

    const { uri } = await response.json()
    return uri
  } catch (error) {
    console.error("Error uploading metadata:", error)
    throw error
  }
}

// Create token on Pump.fun
export async function createPumpFunToken(
  tokenData: PumpFunTokenData,
  creatorPublicKey: string,
  buyAmount = 0,
): Promise<{ transaction: string; tokenData: PumpFunCreateResponse }> {
  try {
    console.log("[v0] Calling real Pump.fun API with data:", tokenData)

    const response = await fetch("/api/pump-fun/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...tokenData,
        creator: creatorPublicKey,
        buyAmount: buyAmount,
      }),
    })

    console.log("[v0] Pump.fun API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Pump.fun API error:", errorData)
      throw new Error(errorData.details || `Failed to create token on Pump.fun: ${response.status}`)
    }

    const result = await response.json()
    console.log("[v0] Real Pump.fun API success:", result)

    return {
      transaction: result.transaction || result.tokenData.signature,
      tokenData: result.tokenData,
    }
  } catch (error) {
    console.error("[v0] Error in createPumpFunToken:", error)
    throw error
  }
}

// Get token info from Pump.fun
export async function getPumpFunTokenInfo(mintAddress: string) {
  try {
    const response = await fetch(`/api/pump-fun/token/${mintAddress}`)

    if (!response.ok) {
      throw new Error("Failed to fetch token info")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching token info:", error)
    throw error
  }
}
