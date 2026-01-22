import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CandidateCardSkeleton() {
    return (
        <Card className="overflow-hidden border-border/50">
            {/* Header/Banner Skeleton */}
            <div className="relative h-32 bg-muted/40 animate-pulse">
                <div className="absolute top-4 right-4">
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>
            </div>

            {/* Image & Party Symbol */}
            <div className="px-6 -mt-12 relative z-10">
                <div className="relative">
                    <Skeleton className="w-24 h-24 rounded-xl border-4 border-background" />
                    <div className="absolute bottom-0 right-0 bg-background rounded-full p-1 border shadow-sm">
                        <Skeleton className="w-6 h-6 rounded-full" />
                    </div>
                </div>
            </div>

            <CardHeader className="pt-4 pb-2">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 py-2 border-y border-dashed border-border/50">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                </div>
            </CardContent>

            <CardFooter className="pt-2 flex flex-col gap-2">
                <Skeleton className="h-10 w-full rounded-full" />
                <Skeleton className="h-10 w-full rounded-full" />
            </CardFooter>
        </Card>
    )
}
