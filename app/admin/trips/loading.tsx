import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-72" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-56" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-full max-w-md" />
            <Skeleton className="h-9 w-44" />
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="rounded-lg border">
            <div className="grid grid-cols-8 gap-3 p-3">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            <div className="divide-y">
              {[...Array(6)].map((_, r) => (
                <div key={r} className="grid grid-cols-8 items-center gap-3 p-3">
                  {[...Array(8)].map((_, c) => (
                    <Skeleton key={c} className="h-4 w-full" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
