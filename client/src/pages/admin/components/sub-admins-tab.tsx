import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ScanFace, Plus } from "lucide-react";
import { FaceEnrollDialog } from "./face-enroll-dialog";

export function SubAdminsTab() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [enrollUser, setEnrollUser] = useState<string | null>(null);
    const [formData, setFormData] = useState({ username: "", password: "", email: "" });

    const { data: subAdmins, isLoading } = useQuery<any[]>({
        queryKey: ["/api/admin/sub-admins"],
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch("/api/admin/create-sub-admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to create sub-admin");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/sub-admins"] });
            toast({ title: "Success", description: "Sub-Admin created successfully" });
            setIsDialogOpen(false);
            setFormData({ username: "", password: "", email: "" });
        },
        onError: (err: Error) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-6 border-b flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold font-serif">Sub Admins</h2>
                    <p className="text-muted-foreground">Manage your sub-admin team</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus size={16} /> Create Sub-Admin</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Sub-Admin</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div>
                                <label className="text-sm font-medium">Username</label>
                                <Input
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Password</label>
                                <Input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                {createMutation.isPending ? "Creating..." : "Create Account"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="p-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created By</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow> :
                            (!subAdmins || subAdmins.length === 0) ? <TableRow><TableCell colSpan={4}>No sub-admins found.</TableCell></TableRow> :
                                subAdmins.map((admin) => (
                                    <TableRow key={admin.id}>
                                        <TableCell className="font-medium">{admin.username}</TableCell>
                                        <TableCell>{admin.email}</TableCell>
                                        <TableCell>{admin.role}</TableCell>
                                        <TableCell>{admin.createdBy || "N/A"}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="outline" onClick={() => setEnrollUser(admin.username)}>
                                                <ScanFace className="mr-2 h-4 w-4" /> Enroll Face
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                    </TableBody>
                </Table>
            </div>


            <FaceEnrollDialog
                isOpen={!!enrollUser}
                onOpenChange={(open) => !open && setEnrollUser(null)}
                username={enrollUser || ""}
                onSuccess={() => {
                    // Optional: refresh logic or show icon
                }}
            />
        </div>
    );
}
