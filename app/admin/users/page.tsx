import { requireAdmin } from "@/lib/auth-guard";
import { Metadata } from "next";
import { getAllUsers, deleteUser } from "@/actions/user.actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatId } from "@/lib/utils";
import Pagination from "@/components/ui/shared/pagination";
import { Badge } from "@/components/ui/badge";
import DeleteDialog from "@/components/ui/shared/delete-dialog";
import {
    ShieldCheck,
    User,
    Users,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Admin Users",
};

const AdminUserPage = async (props: {
    searchParams: Promise<{
        page: string;
        query: string;
    }>;
}) => {
    await requireAdmin();

    const { page = "1", query: searchText } =
        await props.searchParams;

    const users = await getAllUsers({
        page: Number(page),
        query: searchText,
    });

    return (
        <div className="space-y-6">

            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Users
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage customer accounts and permissions.
                    </p>
                </div>
            </div>

            {searchText && (
                <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm shadow-sm">
                    <span className="text-muted-foreground">
                        Filtered by
                    </span>

                    <span className="font-medium">
                        &quot;{searchText}&quot;
                    </span>

                    <Link href="/admin/users">
                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-1 rounded-lg"
                        >
                            Remove Filter
                        </Button>
                    </Link>
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">

                <div className="border-b px-6 py-4">
                    <div>
                        <h2 className="font-semibold">
                            User Management
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            View and manage registered users.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <TableHead className="px-6">
                                    User
                                </TableHead>

                                <TableHead>
                                    Name
                                </TableHead>

                                <TableHead>
                                    Email
                                </TableHead>

                                <TableHead>
                                    Role
                                </TableHead>

                                <TableHead className="px-6 text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {users.data.map((user) => (
                                <TableRow
                                    key={user.id}
                                    className="transition-colors hover:bg-muted/30"
                                >
                                    {/* ID */}
                                    <TableCell className="px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                            </div>

                                            <span className="font-semibold">
                                                #{formatId(user.id)}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <span className="font-medium">
                                            {user.name || "Unnamed User"}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {user.email}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        {user.role === "user" ? (
                                            <Badge
                                                variant="secondary"
                                                className="rounded-full px-2.5 py-1"
                                            >
                                                <User className="mr-1.5 h-3.5 w-3.5" />
                                                User
                                            </Badge>
                                        ) : (
                                            <Badge
                                                className="rounded-full bg-primary/10 px-2.5 py-1 text-primary hover:bg-primary/10"
                                            >
                                                <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                                                Admin
                                            </Badge>
                                        )}
                                    </TableCell>

                                    <TableCell className="px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className="rounded-lg"
                                            >
                                                <Link
                                                    href={`/admin/users/${user.id}`}
                                                >
                                                    Edit
                                                </Link>
                                            </Button>

                                            <DeleteDialog
                                                id={user.id}
                                                action={deleteUser}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {users.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-48 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                                <Users className="h-6 w-6 text-muted-foreground" />
                                            </div>

                                            <h3 className="mt-4 font-semibold">
                                                No users found
                                            </h3>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                No users match your current
                                                search.
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {users.totalPages > 1 && (
                    <div className="border-t px-6 py-4">
                        <Pagination
                            page={Number(page) || 1}
                            totalPages={users.totalPages}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUserPage;