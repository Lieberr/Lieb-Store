import { requireAdmin } from "@/lib/auth-guard";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserById } from "@/actions/user.actions";
import UpdateUserForm from "./update-user-form";
import { UserCog } from "lucide-react";

export const metadata: Metadata = {
    title: 'Update User'
}

const AdminUserUpdatePage = async (props: {
    params: Promise<{
        id: string
    }>
}) => {
    await requireAdmin();

    const {id} = await props.params;
    const user = await getUserById(id);

    if(!user) notFound();

    return ( 
        <div className="mx-auto w-full max-w-2xl space-y-6">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <UserCog className="h-5 w-5" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Update User
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Update the user information and account permissions.
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="border-b px-6 py-4">
                    <h2 className="font-semibold">
                        User Information
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage the use&apos;s account details and role.
                    </p>
                </div>

                <div className="px-6 py-6">
                    <UpdateUserForm user={user} />
                </div>
            </div>
        </div> );
}
 
export default AdminUserUpdatePage;