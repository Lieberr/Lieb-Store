'use server';

import { shippingAddressSchema, signInFormSchema, signUpFormSchema, paymentMethodSchema, updateUserSchema } from "@/lib/validators";
import {signIn, signOut, auth} from '@/auth';
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {prisma} from "@/db/prisma";
import { formatError } from "@/lib/utils";
import { cookies } from "next/headers";
import { shippingAddress } from "@/types";
import z from "zod";
import { PAGE_SIZE } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { hash } from "@/lib/encrypt";
import { generateResetCode, getResetCodeExpiration, hashResetCode } from "@/lib/password-reset";
import { sendVerificationEmail } from "@/lib/email";


// Sign in the user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
        });

        await signIn('credentials', user);

        return {success: true, message: "Signed is successfully"}
    } catch (error) {
        if(isRedirectError(error)) {
            throw error;
        }

        return {success: false, message: "Invalid email or password"}
    }
}

//Sign user out
export async function signOutUser() {
    await signOut();
    const cookieStore = await cookies();
    cookieStore.delete('sessionCartId');
}

//sign Up user
export async function signUpUser(prevState: unknown, formData: FormData) {
    try {
        const user = signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        });

        user.email = user.email.trim().toLowerCase();

        user.password = await hash(user.password)

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password
            }
        });

        const code = generateResetCode();
        const tokenHash = hashResetCode(code);
        const expiresAt = getResetCodeExpiration();

        await prisma.passwordResetTokenUser.create({
            data: {
                email: user.email,
                tokenHash,
                expiresAt
            }
        })

        await sendVerificationEmail(user.email, code);

        return {
            success: true,
            message: "User registered succesfully. Check your email for verification code."
        }
    } catch (error) {
        if(isRedirectError(error)) {
            throw error;
        }

        return {success: false, message: await formatError(error)}
    }
    
}

//Verify User email
export async function verifyUserEmailAction(
    email: string,
    code: string,
    password: string
) {
    try {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedCode = code.trim();

        if (!/^\d{6}$/.test(normalizedCode)) {
            return {
                success: false,
                message: "The code must contain exactly 6 digits"
            }
        }

        const tokenHash = hashResetCode(normalizedCode);

        const tokenRecord = await prisma.passwordResetTokenUser.findFirst({
            where: {email: normalizedEmail, tokenHash}
        })

        if(!tokenRecord) {
            return {
                success: false,
                message: "Invalid Code"
            }
        }

        if(tokenRecord.expiresAt < new Date()) {
            return {
                success: false,
                message: "Expired Code. Please get a new one."
            }
        }

        await prisma.user.update({
            where: {email: normalizedEmail},
            data: {emailVerified: new Date()}
        })

        await signIn('credentials', {
            email: normalizedEmail,
            password,
            redirect: false
        });

        await prisma.passwordResetTokenUser.deleteMany({
            where: {email: normalizedEmail}
        });

        revalidatePath('/user/profile');

        return {
            success: true,
            message: "E-mail successfully verify"
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

// Get user by Id
export async function getUserById(userId: string) {
    const user = await prisma.user.findFirst({
        where: {id: userId}
    });
    
    if(!user) throw new Error("User not found")

    return user;
}

// Update the user address
export async function updateUserAddress(data: shippingAddress) {
    try {
        const session = await auth();

        const currentUser = await prisma.user.findFirst({
            where: {id: session?.user?.id}
        });

        if (!currentUser) throw new Error('User not found');

        const address = shippingAddressSchema.parse(data);

        await prisma.user.update({
            where: {id: currentUser.id},
            data: {address: address}
        });

        return {
            success: true,
            message: 'User updated succesfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

// update users payment method
export async function updateUserPaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
    try {
        const session = await auth();
        const currentUser = await prisma.user.findFirst({
            where: {id: session?.user?.id}
        })

        if(!currentUser) throw new Error('User not found');

        const paymentMethod = paymentMethodSchema.parse(data);

        await prisma.user.update({
            where: {id: currentUser.id},
            data: {paymentMethod: paymentMethod.type}
        });

        return {
            success: true,
            message: 'User updated successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

// Update the user profile
export async function updateProfile(user: {name: string, email: string, image?: string | null}) {
    try {
        const session = await auth();

        const currentUser = await prisma.user.findFirst({
            where: {
                id: session?.user?.id
            }
        })

        if(!currentUser) throw new Error('User not found');

        await prisma.user.update({
            where: {
                id: session?.user?.id
            },
            data: {
                name: user.name,
                image: user.image
            }
        })

        return {
            success: true,
            message: 'User updated successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

// get all the users
export async function getAllUsers({
    limit = PAGE_SIZE,
    page,
    query
}: {
    limit?: number;
    page: number;
    query: string
}) {
    
    const queryFilter: Prisma.UserWhereInput = query && query !== 'all'? {
                name: {
                    contains: query,
                    mode: 'insensitive'
                } as Prisma.StringFilter
        } :{}

    const data = await prisma.user.findMany({
        where: {
            ...queryFilter
        },
        orderBy: {createdAt: 'desc'},
        take: limit,
        skip: (page - 1) * limit
    });

    const dataCount = await prisma.user.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit)
    }
}

// Delete a user
export async function deleteUser(id: string) {
    try {
        await prisma.user.delete({
            where: {id}
        })

        revalidatePath('/admin/users');

        return {
            success: true,
            message: 'User delete successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

// Update a user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
    try {
        await prisma.user.update({
            where: {id: user.id},
            data: {
                name: user.name,
                role: user.role
            }
        })

        revalidatePath('/admin/users');

        return {
            success: true,
            message: 'User update successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

// Sign in with google
export async function signInWithGoogle() {
    await signIn('google', {redirectTo: '/'});
}

// Sign in with github
export async function signInWithGithub() {
    await signIn('github', {redirectTo: '/'})
}

// Sign in with linkedin
export async function signInWithLinkedin() {
    await signIn('linkedin', {redirectTo: '/'})
}