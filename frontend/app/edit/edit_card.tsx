import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface SuggestedEditProps {
  before: string
  after: string
  onAccept: () => void
  onDecline: () => void
}

const DiffView = ({ before, after }: { before: string; after: string }) => (
  <div className="text-sm leading-snug">
    <span className="line-through text-muted-foreground mr-2">{before}</span>
    <span className="font-medium">{after}</span>
  </div>
)

export default function SuggestedEditCard({ before, after, onAccept, onDecline }: SuggestedEditProps) {
  return (
    <Card className="w-64 bg-secondary/50 shadow-sm">
      <CardContent className="p-2 space-y-2">
        <DiffView before={before} after={after} />
        <div className="flex justify-end space-x-1">
          <Button variant="ghost" size="sm" onClick={onDecline} className="h-7 w-7 p-0">
            <X className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onAccept} className="h-7 w-7 p-0">
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}