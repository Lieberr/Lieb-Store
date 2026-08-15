import ProductCard from "./product-card";
import {Product} from '@/types'


const ProductList = ({ 

    data, title, limit 

} : {

    data: Product[]; title?: string; limit?: number

}) => {

    const limitedData = limit ? data.slice(0, limit) : data;

    return ( 
        <div className="my-12">
            {title && (
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                            Featured
                        </p>
                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            {title}
                        </h2>
                    </div>
                </div>
            )}

            {data.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {limitedData.map((product: Product) => (
                        <ProductCard key={product.slug} product={product} />
                    ) )}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed p-10 text-center">
                    <p className="text-sm text-muted-foreground">No Products found</p>
                </div>
            )}
        </div>
     );
}
 
export default ProductList;