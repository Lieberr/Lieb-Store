'use client';

import { updateProfile } from "@/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UploadButton } from "@/lib/uploadthing";
import { updateProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CircleAlert, Loader2, Mail, Trash2, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ProfileForm = ({ emailVerified }: { emailVerified: boolean }) => {
    const { data: session, update } = useSession();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        // Usa 'values' ao invés de 'defaultValues' para re-sincronizar quando o session carregar
        values: {
            name: session?.user?.name ?? "",
            email: session?.user?.email ?? "",
            image: session?.user?.image ?? "",
        },
    });

    const currentImage = form.watch("image");
    const firstInitial = session?.user?.name?.charAt(0).toUpperCase() ?? "U";

    const onSubmit = async (
        values: z.infer<typeof updateProfileSchema>
    ) => {
        const res = await updateProfile(values);

        if (!res.success) {
            return toast({
                variant: "destructive",
                description: res.message,
            });
        }

        const newSession = {
            ...session,
            user: {
                ...session?.user,
                name: values.name,
                image: values.image,
            },
        };

        await update(newSession);

        toast({
            description: res.message,
        });
    };

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                {/* Profile Picture Section */}
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profile Picture</FormLabel>
                            <div className="flex items-center gap-6">
                                <Avatar className="h-20 w-20 border-2 border-border">
                                    <AvatarImage src={field.value || ""} alt={session?.user?.name || "Avatar"} />
                                    <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                                        {firstInitial}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col gap-2">
                                    <UploadButton
                                        endpoint="imageUploader" // Ajuste conforme a rota configurada no seu OurFileRouter
                                        onClientUploadComplete={(res) => {
                                            if (res && res[0]) {
                                                form.setValue("image", res[0].url, { shouldDirty: true });
                                                toast({ description: "Image uploaded successfully!" });
                                            }
                                        }}
                                        onUploadError={(error: Error) => {
                                            toast({
                                                variant: "destructive",
                                                description: `Upload error: ${error.message}`,
                                            });
                                        }}
                                    />

                                    {field.value && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs text-destructive hover:text-destructive flex items-center gap-1 w-fit"
                                            onClick={() => form.setValue("image", null, { shouldDirty: true })}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" /> Remove Image
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>

                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <FormControl>
                                    <Input
                                        disabled
                                        className="h-11 pl-10 bg-muted/50"
                                        placeholder="Email"
                                        {...field}
                                    />
                                </FormControl>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Your email address cannot be changed here.
                            </p>

                            <div className="mt-2">
                                {emailVerified ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Email verified
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                                        <CircleAlert className="h-3.5 w-3.5" />
                                        Email not verified
                                    </span>
                                )}
                            </div>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>

                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <FormControl>
                                    <Input
                                        className="h-11 pl-10"
                                        placeholder="Enter your name"
                                        {...field}
                                    />
                                </FormControl>
                            </div>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Button */}
                <div className="border-t pt-6">
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="h-11 w-full rounded-xl font-semibold sm:w-auto sm:min-w-44"
                    >
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ProfileForm;