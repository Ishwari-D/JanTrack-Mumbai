import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export function ReportsList() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { data: reports } = useQuery<any[]>({
        queryKey: ["/api/reports"],
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: string }) => {
            const res = await fetch(`/api/reports/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (!res.ok) throw new Error("Failed to update status");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
            toast({ title: "Status Updated", description: "Report status has been updated." });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
        }
    });

    if (!reports?.length) return <div className="text-center py-12 text-muted-foreground">No candidate reports found</div>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Reason</TableHead>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reports.map((report: any) => (
                    <TableRow key={report._id}>
                        <TableCell>
                            <div className="font-medium">{report.reason}</div>
                            <div className="text-sm text-muted-foreground">{report.description}</div>
                        </TableCell>
                        <TableCell>{report.candidateName}</TableCell>
                        <TableCell>{report.reporterName}</TableCell>
                        <TableCell>
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent 
                                ${report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                    report.status === 'dismissed' ? 'bg-gray-100 text-gray-700' : 'bg-amber-100 text-amber-700'}`}>
                                {report.status}
                            </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                            {report.status === 'pending' && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => statusMutation.mutate({ id: report._id, status: 'dismissed' })}
                                        disabled={statusMutation.isPending}
                                    >
                                        Dismiss
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => statusMutation.mutate({ id: report._id, status: 'resolved' })}
                                        disabled={statusMutation.isPending}
                                    >
                                        Resolve
                                    </Button>
                                </>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
