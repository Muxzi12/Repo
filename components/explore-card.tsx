import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock } from "lucide-react"
import { shortenAddress } from "@/lib/utils"

interface ExploreCardProps {
  name: string
  symbol: string
  description?: string
  imageUrl?: string
  mint: string
  devWallet: string
  createdAt: string
  pumpUrl?: string Update validator node repository settings
}

function ExploreCard({ name, symbol, description, imageUrl, mint, devWallet, createdAt, pumpUrl }: ExploreCardProps) {
  const timeAgo = new Date(createdAt).toLocaleDateString()

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-border">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Token Image */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl || "/placeholder.svg"} alt={`${name} logo`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{symbol.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground truncate">{name}</h3>
              <span className="text-sm text-muted-foreground font-mono">${symbol}</span>
            </div>

            {description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>}

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">CA:</span>
                <span className="font-mono">{shortenAddress(mint)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">Dev:</span>
                <span className="font-mono">{shortenAddress(devWallet)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{timeAgo}</span>
              </div>
            </div>

            {/* Action Button */}
            <Button
              size="sm"
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              asChild
            >
              <a
                href={pumpUrl || `https://pump.fun/${mint}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                View on Pump.fun
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { ExploreCard }
export default ExploreCard
