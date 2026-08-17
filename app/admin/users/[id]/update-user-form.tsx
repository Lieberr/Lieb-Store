'use client';

import { updateUserSchema } from "@/lib/validators";
import z from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { USER_ROLES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/actions/user.actions";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";



const UpdateUserForm = ({user}: {
    user: z.infer<typeof updateUserSchema>
}) => {
    const router = useRouter();
    const {toast} = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof updateUserSchema>>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: user
    });

    const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
        setIsLoading(true);

        try {
            const res = await updateUser({
                ...values,
                id: user.id
            });

           if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message
                });

                return;
                }

            form.reset();
            router.push('/admin/users');
            
        } catch (error) {
            toast({
                variant: 'destructive',
                description: (error as Error).message
            })
        } finally {
            setIsLoading(false);
        }
    }

    return <Form {...form}>
        <form method="POST" className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>

            {/*Email*/}
                <FormField
                control={form.control}
                name="email"
                render={({field}: {field: ControllerRenderProps<z.infer<typeof updateUserSchema>,'email'>}) => (
                    <FormItem className="w-full">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input disabled={true} placeholder='Enter user email' className="h-11 bg-muted/50" {...field} />
                        </FormControl>

                        <p className="text-xs text-muted-foreground">
                            Email addresses cannot be changed.
                        </p>

                        <FormMessage />
                    </FormItem>
                )} />

                {/*NAME*/}
                <FormField
                control={form.control}
                name="name"
                render={({field}: {field: ControllerRenderProps<z.infer<typeof updateUserSchema>,'name'>}) => (
                    <FormItem className="w-full">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input className="h-11" placeholder='Enter user name' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField
                control={form.control}
                name="role"
                render={({field}: {field: ControllerRenderProps<z.infer<typeof updateUserSchema>,'role'>}) => (
                    <FormItem className="w-full">
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value.toString()}>
                            <FormControl>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {USER_ROLES.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />

            <div className="border-t mt-6">
                <Button type="submit" className="h-11 w-full rounded-xl font-semibold gap-2 flex items-center justify-center" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving changes...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Update User
                        </>
                    )}
                </Button>
            </div>
        </form>
    </Form>
}
 
export default UpdateUserForm;