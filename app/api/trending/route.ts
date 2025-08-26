import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "hot"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    console.log("[v0] Trending API called:", { category, limit })

    // Mock data for testing
    const mockProjects = [
      {
        id: "mock-1",
        token_name: "DeFi Token",
        token_symbol: "DEFI",
        token_description: "Revolutionary DeFi protocol built with Solidity",
        token_image_url: "/defi-protocol-logo.png",
        repo_name: "defi-protocol",
        repo_url: "https://github.com/example/defi-protocol",
        repo_stars: 1250,
        repo_forks: 340,
        repo_language: "Solidity",
        usd_market_cap: 50000,
        transaction_count: 1500,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        repo_verified: true,
        users: {
          github_username: "defi-dev",
          github_avatar_url: "/developer-avatar.png",
        },
      },
      {
        id: "mock-2",
        token_name: "AI Bot Token",
        token_symbol: "AIBOT",
        token_description: "Machine learning powered trading bot for crypto markets",
        token_image_url: "/ai-bot-logo.png",
        repo_name: "ai-trader",
        repo_url: "https://github.com/example/ai-trader",
        repo_stars: 890,
        repo_forks: 156,
        repo_language: "Python",
        usd_market_cap: 25000,
        transaction_count: 750,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        repo_verified: true,
        users: {
          github_username: "ai-trader",
          github_avatar_url: "/ai-developer-avatar.png",
        },
      },
      {
        id: "mock-3",
        token_name: "Game Token",
        token_symbol: "GAME",
        token_description: "Next-gen gaming engine with blockchain integration",
        token_image_url: "/gaming-token-logo.png",
        repo_name: "web3-game",
        repo_url: "https://github.com/example/web3-game",
        repo_stars: 2100,
        repo_forks: 420,
        repo_language: "TypeScript",
        usd_market_cap: 75000,
        transaction_count: 2200,
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        repo_verified: true,
        users: {
          github_username: "game-dev",
          github_avatar_url: "/game-developer-avatar.png",
        },
      },
    ]

    const responseData = {
      category,
      projects: mockProjects.slice(0, limit).map((project, index) => ({
        ...project,
        trending_score: 100 - index * 10,
        trending_rank: index + 1,
      })),
      total: mockProjects.length,
    }

    console.log("[v0] Returning trending data:", responseData.projects.length, "projects")

    const response = NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    })

    return response
  } catch (error) {
    console.error("[v0] Trending API error:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch trending projects",
        category: "hot",
        projects: [],
        total: 0,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    )
  }
}
