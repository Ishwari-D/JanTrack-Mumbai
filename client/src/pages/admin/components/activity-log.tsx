import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface ActivityLog {
    _id: string;
    adminId: string;
    adminName: string;
    action: string;
    entityType: string;
    entityId: string;
    details: any;
    timestamp: string;
}

export function ActivityLogList() {
    const { data: logs, isLoading, error } = useQuery<ActivityLog[]>({
        queryKey: ["/api/admin/activity-logs"],
    });

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">Error loading activity logs</div>;
    }

    if (!logs || logs.length === 0) {
        return <div className="text-center p-8 text-muted-foreground">No activity logs found</div>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Admin</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => (
                        <TableRow key={log._id}>
                            <TableCell className="whitespace-nowrap text-muted-foreground text-xs">
                                {format(new Date(log.timestamp), "MMM d, yyyy HH:mm:ss")}
                            </TableCell>
                            <TableCell className="font-medium">{log.adminName}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)
                                    }`}>
                                    {log.action.replace(/_/g, " ")}
                                </span>
                            </TableCell>
                            <TableCell>{log.entityType}</TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-xs truncate" title={JSON.stringify(log.details, null, 2)}>
                                {formatDetails(log.details)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function getActionColor(action: string) {
    if (action.includes("CREATE")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (action.includes("UPDATE")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (action.includes("DELETE")) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    if (action.includes("VERIFY")) return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
}

function formatDetails(details: any) {
    if (!details) return "-";
    // Setup some nice formatting for common fields
    const parts = [];
    if (details.name) parts.push(`Name: ${details.name}`);
    if (details.title) parts.push(`Title: ${details.title}`);
    if (details.username) parts.push(`User: ${details.username}`);
    if (details.status) parts.push(`Status: ${details.status}`);

    if (parts.length > 0) return parts.join(", ");

    return JSON.stringify(details);
}
