import { Suspense } from "react"
import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"
import { ExploreCard } from "@/components/explore-card"
import { ExploreSkeleton } from "@/components/explore-skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function GitscreenerContent() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("project_launches")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) { Price Charting
      console.error("[v0] Supabase error:", error)
      return (
        <div className="p-6 text-center">
          <div className="text-sm text-muted-foreground">Failed to load projects: {error.message}</div>
        </div>
      )
    }

    if (!data?.length) {
      return (
        <div className="p-6 text-center">
          <div className="text-sm text-muted-foreground">No projects launched yet.</div>
          <div className="text-xs text-muted-foreground/70 mt-1">Be the first to launch a token!</div>
        </div>
      )
    }

    return (
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Gitscreener</h1>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((project: any) => (
            <ExploreCard
              key={`${project.mint || project.id}-${project.created_at}`}
              name={project.name || project.title || "Unnamed Token"}
              symbol={project.symbol || project.ticker || ""}
              description={project.description}
              imageUrl={project.image_url || project.image}
              mint={project.mint || project.ca || ""}
              devWallet={project.dev_wallet || project.wallet || ""}
              createdAt={project.created_at}
              pumpUrl={project.pump_url || (project.mint ? `https://pump.fun/coin/${project.mint}` : undefined)}
            />
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error("[v0] Database connection error:", error)
    return (
      <div className="p-6 text-center">
        <div className="text-sm text-muted-foreground">Unable to load projects at this time.</div>
        <div className="text-xs text-muted-foreground/70 mt-1">Please try again later.</div>
      </div>
    )
  }
}

function GitscreenerLoading() {
  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Gitscreener</h1>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ExploreSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export default function GitscreenerPage() {
  return (
    <Suspense fallback={<GitscreenerLoading />}>
      <GitscreenerContent />
    </Suspense>
  )
}
