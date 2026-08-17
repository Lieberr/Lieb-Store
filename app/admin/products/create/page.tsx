import { Metadata } from "next";
import ProductForm from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/auth-guard";
import { PackagePlus } from "lucide-react";


export const metadata: Metadata = {
    title: 'Create Product'
}

const CreateProductPage = async () => {
    await requireAdmin();
    
    return ( 
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <PackagePlus className="h-5 w-5" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Create Product
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Add a new product to your store catalog.
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border bg-card shadow-sm">
                <div className="border-b px-6 py-4">
                    <h2 className="font-semibold">
                        Product Information
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Enter the details and configuration for your product.
                    </p>
                </div>

                <div className="p-6">
                    <ProductForm type="Create" />
                </div>
            </div>
        </div>
     );
}
 
export default CreateProductPage;