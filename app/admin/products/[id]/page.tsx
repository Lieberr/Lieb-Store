import { getProductById } from "@/actions/product.actions";
import ProductForm from "@/components/admin/product-form";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";
import { PackageCheck } from "lucide-react";


export const metadata: Metadata = {
    title: 'Update Product'
}



const AdminProductUpdatePage = async (props: {
    params: Promise<{
        id: string
    }>
}) => {
    await requireAdmin();
    
    const {id} = await props.params;
    const product = await getProductById(id);

    if(!product) return notFound();

    return ( 
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <PackageCheck className="h-5 w-5" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Update Product
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Update the information, pricing and inventory of this product.
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border bg-card shadow-sm">
                <div className="border-b px-6 py-4">
                    <h2 className="font-semibold">
                        Product Information
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Make changes to your product and save them when you&apos;re finised
                    </p>
                </div>

                <div className="p-6">
                    <ProductForm type="Update" product={product} productId={product.id} />
                </div>
            </div>
        </div>
     );
}
 
export default AdminProductUpdatePage;