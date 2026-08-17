import { Metadata } from "next";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import ProfileForm from "./profile-form";
import { UserRound } from "lucide-react";

export const metadata: Metadata = {
    title: "Customer Profile",
};

const Profile = async () => {
    const session = await auth();

    return (
        <SessionProvider session={session}>
            <div className="mx-auto w-full max-w-2xl">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <UserRound className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Profile
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage your account information and personal details.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile card */}
                <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">

                    <div className="border-b px-6 py-5 sm:px-8">
                        <h2 className="font-semibold">
                            Personal Information
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Update the information associated with your account.
                        </p>
                    </div>

                    <div className="px-6 py-6 sm:px-8">
                        <ProfileForm />
                    </div>

                </div>
            </div>
        </SessionProvider>
    );
};

export default Profile;