import { getLatestProducts } from "@/actions/product.actions";
import ProductList from "@/components/ui/shared/header/product/product-list";

const Homepage = async () => {

   const LatestProducts = await getLatestProducts();

  return (
    <>
      <ProductList data={LatestProducts} title='Newest Arrivals' />
    </>
  );
}
 
export default Homepage;