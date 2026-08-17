"use client";

import { useToast } from "@/hooks/use-toast";
import { productDefaultValues } from "@/lib/constants";
import {
    insertProductsSchema,
    updateProductsSchema,
} from "@/lib/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
    ControllerRenderProps,
    SubmitHandler,
    useForm,
} from "react-hook-form";
import z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import slugify from "slugify";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
    createProduct,
    updateProduct,
} from "@/actions/product.actions";
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import {
    ImageIcon,
    Package,
    Tag,
    DollarSign,
    FileText,
    Star,
    Loader2,
} from "lucide-react";

const ProductForm = ({
    type,
    product,
    productId,
}: {
    type: "Create" | "Update";
    product?: Product;
    productId?: string;
}) => {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof insertProductsSchema>>({
        resolver:
            type === "Update"
                ? zodResolver(updateProductsSchema)
                : zodResolver(insertProductsSchema),

        defaultValues:
            product && type === "Update"
                ? product
                : productDefaultValues,
    });

    const onSubmit: SubmitHandler<
        z.infer<typeof insertProductsSchema>
    > = async (values) => {
        if (type === "Create") {
            const res = await createProduct(values);

            if (!res.success) {
                toast({
                    variant: "destructive",
                    description: res.message,
                });
            } else {
                toast({
                    description: res.message,
                });

                router.push("/admin/products");
            }
        }

        if (type === "Update") {
            if (!productId) {
                router.push("/admin/products");
                return;
            }

            const res = await updateProduct({
                ...values,
                id: productId,
            });

            if (!res.success) {
                toast({
                    variant: "destructive",
                    description: res.message,
                });
            } else {
                toast({
                    description: res.message,
                });

                router.push("/admin/products");
            }
        }
    };

    const images = form.watch("images");
    const isFeatured = form.watch("isFeatured");
    const banner = form.watch("banner");

    return (
        <Form {...form}>
            <form
                method="POST"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
            >

                {/* BASIC INFORMATION */}
                <section className="space-y-5">

                    <div className="flex items-center gap-2 border-b pb-3">
                        <Package className="h-5 w-5 text-primary" />

                        <div>
                            <h3 className="font-semibold">
                                Basic Information
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Basic details about your product.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">

                        {/* NAME */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder="Enter product name"
                                            className="h-11"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* SLUG */}
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>

                                    <FormControl>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="product-slug"
                                                className="h-11"
                                                {...field}
                                            />

                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-11 shrink-0"
                                                onClick={() => {
                                                    form.setValue(
                                                        "slug",
                                                        slugify(
                                                            form.getValues(
                                                                "name"
                                                            ),
                                                            {
                                                                lower: true,
                                                            }
                                                        )
                                                    );
                                                }}
                                            >
                                                Generate
                                            </Button>
                                        </div>
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* CATEGORY */}
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder="Electronics"
                                            className="h-11"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* BRAND */}
                        <FormField
                            control={form.control}
                            name="brand"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Brand</FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder="Apple"
                                            className="h-11"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                </section>

                {/* PRICE AND INVENTORY */}
                <section className="space-y-5">

                    <div className="flex items-center gap-2 border-b pb-3">
                        <DollarSign className="h-5 w-5 text-primary" />

                        <div>
                            <h3 className="font-semibold">
                                Pricing & Inventory
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Set the price and available stock.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">

                        {/* PRICE */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>

                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="h-11"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* STOCK */}
                        <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock</FormLabel>

                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            className="h-11"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                </section>

                {/* IMAGES */}
                <section className="space-y-5">

                    <div className="flex items-center gap-2 border-b pb-3">

                        <ImageIcon className="h-5 w-5 text-primary" />

                        <div>
                            <h3 className="font-semibold">
                                Product Images
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Upload images that will be displayed in your store.
                            </p>
                        </div>

                    </div>

                    <FormField
                        control={form.control}
                        name="images"
                        render={() => (
                            <FormItem>

                                <FormControl>
                                    <Card className="border-dashed">
                                        <CardContent className="p-6">

                                            <div className="flex flex-wrap gap-4">

                                                {images.map(
                                                    (image: string) => (
                                                        <div
                                                            key={image}
                                                            className="relative overflow-hidden rounded-xl border"
                                                        >
                                                            <Image
                                                                src={image}
                                                                alt="Product image"
                                                                width={100}
                                                                height={100}
                                                                className="h-24 w-24 object-cover"
                                                            />
                                                        </div>
                                                    )
                                                )}

                                                <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-dashed bg-muted/30">

                                                    <UploadButton
                                                        endpoint="imageUploader"
                                                        onClientUploadComplete={(
                                                            res: {
                                                                url: string;
                                                            }[]
                                                        ) => {
                                                            form.setValue(
                                                                "images",
                                                                [
                                                                    ...images,
                                                                    res[0].url,
                                                                ]
                                                            );
                                                        }}
                                                        onUploadError={(
                                                            error: Error
                                                        ) => {
                                                            toast({
                                                                variant:
                                                                    "destructive",
                                                                description: `Error! ${error.message}`,
                                                            });
                                                        }}
                                                    />

                                                </div>

                                            </div>

                                        </CardContent>
                                    </Card>
                                </FormControl>

                                <FormMessage />

                            </FormItem>
                        )}
                    />

                </section>

                {/* FEATURED PRODUCT */}
                <section className="space-y-5">

                    <div className="flex items-center gap-2 border-b pb-3">

                        <Star className="h-5 w-5 text-primary" />

                        <div>
                            <h3 className="font-semibold">
                                Featured Product
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Highlight this product on your homepage.
                            </p>
                        </div>

                    </div>

                    <Card>
                        <CardContent className="space-y-5 p-6">

                            <FormField
                                control={form.control}
                                name="isFeatured"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-3 space-y-0">

                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={
                                                    field.onChange
                                                }
                                            />
                                        </FormControl>

                                        <div>
                                            <FormLabel className="cursor-pointer">
                                                Feature this product
                                            </FormLabel>

                                            <p className="text-xs text-muted-foreground">
                                                Display this product in featured sections.
                                            </p>
                                        </div>

                                    </FormItem>
                                )}
                            />

                            {isFeatured && banner && (
                                <div className="overflow-hidden rounded-xl border">
                                    <Image
                                        src={banner}
                                        alt="Product banner"
                                        width={1920}
                                        height={680}
                                        className="w-full object-cover"
                                    />
                                </div>
                            )}

                            {isFeatured && !banner && (
                                <div className="rounded-xl border border-dashed p-6">
                                    <UploadButton
                                        endpoint="imageUploader"
                                        onClientUploadComplete={(
                                            res: { url: string }[]
                                        ) => {
                                            form.setValue(
                                                "banner",
                                                res[0].url
                                            );
                                        }}
                                        onUploadError={(error: Error) => {
                                            toast({
                                                variant: "destructive",
                                                description: `Error! ${error.message}`,
                                            });
                                        }}
                                    />
                                </div>
                            )}

                        </CardContent>
                    </Card>

                </section>

                {/* DESCRIPTION */}
                <section className="space-y-5">

                    <div className="flex items-center gap-2 border-b pb-3">

                        <FileText className="h-5 w-5 text-primary" />

                        <div>
                            <h3 className="font-semibold">
                                Description
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Provide a detailed description of the product.
                            </p>
                        </div>

                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>

                                <FormControl>
                                    <Textarea
                                        placeholder="Enter product description..."
                                        className="min-h-36 resize-none"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />

                            </FormItem>
                        )}
                    />

                </section>

                {/* SUBMIT */}
                <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">

                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() =>
                            router.push("/admin/products")
                        }
                        disabled={form.formState.isSubmitting}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        size="lg"
                        disabled={form.formState.isSubmitting}
                        className="min-w-40"
                    >
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                {type === "Create"
                                    ? "Create Product"
                                    : "Save Changes"}
                            </>
                        )}
                    </Button>

                </div>

            </form>
        </Form>
    );
};

export default ProductForm;