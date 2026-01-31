import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Trash2 } from "lucide-react";

export function IssueModerationList() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { data: issues } = useQuery<any[]>({
        queryKey: ["/api/issues"],
    });

    const verifyMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/issues/${id}/verify`, { method: "PATCH" });
            if (!res.ok) {
                if (res.status === 401) throw new Error("Please log in to verify issues");
                const text = await res.text();
                try {
                    const json = JSON.parse(text);
                    throw new Error(json.message || "Failed to verify");
                } catch {
                    throw new Error(text || "Failed to verify");
                }
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/issues"] });
            toast({ title: "Issue Verified", description: "The issue is now marked as verified." });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/issues/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/issues"] });
            toast({ title: "Issue Deleted", description: "The issue has been removed." });
        }
    });

    if (!issues?.length) return <div className="text-center py-12 text-muted-foreground">No reports found</div>;

    return (
        <div className="space-y-4">
            {issues.map((issue: any) => (
                <div key={issue._id} className="flex flex-col md:flex-row gap-4 border rounded-lg p-4 items-start">
                    <div className="w-full md:w-32 h-32 bg-muted rounded-md overflow-hidden shrink-0">
                        <img src={issue.imageUrl} className="w-full h-full object-cover" alt="Issue Evidence" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{issue.title}</h3>
                            {issue.isVerified ? (
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-600 text-white hover:bg-green-700">
                                    <CheckCircle size={12} className="mr-1" /> Verified
                                </div>
                            ) : (
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                    Pending
                                </div>
                            )}
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                                {issue.status}
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                        <div className="text-xs text-muted-foreground pt-2">
                            Reported by <strong>{issue.userId?.username || 'User'}</strong> at {issue.location} on {new Date(issue.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {!issue.isVerified && (
                            <Button size="sm" onClick={() => verifyMutation.mutate(issue._id)} disabled={verifyMutation.isPending}>
                                Verify
                            </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(issue._id)} disabled={deleteMutation.isPending}>
                            <Trash2 size={16} />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
