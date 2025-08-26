import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Github, Rocket, TrendingUp, Users } from "lucide-react"
import dynamic from "next/dynamic"
const RecentLaunches = dynamic(() => import("@/components/recent-launches"), { ssr: true })

export default async function HomePage() {
  let user = null

  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
  } catch (error) {
    console.log("[v0] Homepage: Database connection failed, using default values")
    // Continue with default values
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header user={user} />

      {/* Launch area, centered */}
      <section className="p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-white/50 dark:bg-zinc-900/40 backdrop-blur-sm shadow-sm p-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Launch Tokens Linked to Your GitHub Repos
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-center">
            Connect your GitHub repositories to Pump.fun and create meme tokens that showcase your development work.
            Build credibility through code, launch tokens through innovation.
          </p>
          <div className="flex gap-4 justify-center">
            {user ? (
              <Link href="/launch">
                <Button size="lg" className="text-lg px-8">
                  <Rocket className="mr-2 h-5 w-5" />
                  Launch Your Token
                </Button>
              </Link>
            ) : (
              <Link href="/auth/sign-up">
                <Button size="lg" className="text-lg px-8">
                  <Github className="mr-2 h-5 w-5" />
                  Connect GitHub & Start
                </Button>
              </Link>
            )}
            <Link href="/gitscreener">
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <TrendingUp className="mr-2 h-5 w-5" />
                Gitscreener
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Launches (centered container + visible grid row) */}
      <section className="pb-10">
        <RecentLaunches centered />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Gitr?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Github className="h-12 w-12 text-primary mb-4" />
              <CardTitle>GitHub Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect your repositories and showcase your development skills. Verified repos build trust and
                credibility for your token launches.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Rocket className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Easy Token Launch</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Launch tokens on Pump.fun with just a few clicks. Your GitHub repo becomes the first link, driving
                traffic back to your code.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Developer Community</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Join a community of developers launching tokens tied to real projects. Discover innovative repos and
                support fellow builders.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 Gitr. Connecting developers to DeFi through code.</p>
        </div>
      </footer>
    </div>
  )
}
