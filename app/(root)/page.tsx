import { getLatestProducts, getFeaturedProducts } from "@/actions/product.actions";
import ProductList from "@/components/ui/shared/header/product/product-list";
import ProductCarousel from "@/components/ui/shared/header/product/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";
import IconBoxes from "@/components/icon-boxes";
import DealCountdown from "@/components/deal-countdown";

// Força essa página a ser sempre renderizada dinamicamente (em runtime),
// nunca durante o build. Isso é necessário porque o header (via
// category-drop.tsx) e os componentes acima dependem do Prisma/DATABASE_URL,
// que só está disponível quando o app está rodando de verdade, não no build.
export const dynamic = "force-dynamic";

const Homepage = async () => {

   const LatestProducts = await getLatestProducts();
      const featuredProducts = await getFeaturedProducts();


  return (
    <>
    {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
      <ProductList data={LatestProducts} title='Newest Arrivals' />
      <ViewAllProductsButton />
      <DealCountdown />
      <IconBoxes />
    </>
  );
}
 
export default Homepage;
