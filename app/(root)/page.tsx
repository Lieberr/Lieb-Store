import { getLatestProducts, getFeaturedProducts } from "@/actions/product.actions";
import ProductList from "@/components/ui/shared/header/product/product-list";
import ProductCarousel from "@/components/ui/shared/header/product/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";

const Homepage = async () => {

   const LatestProducts = await getLatestProducts();
      const featuredProducts = await getFeaturedProducts();


  return (
    <>
    {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
      <ProductList data={LatestProducts} title='Newest Arrivals' />
      <ViewAllProductsButton />
    </>
  );
}
 
export default Homepage;