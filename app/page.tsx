import { Suspense } from 'react';
import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { ItemCarousel } from '@/components/ItemCarousel';
import { GET_HOMEPAGE_DATA, GET_PRODUCTS } from '@/graphql/queries';
import { getClient } from '@/lib/client';
import CategoryRows from '@/components/CategoryRows';
import Image from 'next/image';
import { ProductCategory } from '@/generated/graphql';

export default async function HomePage() {
  const client = getClient();
  
  const { data: homeData } = await client.query({
    query: GET_HOMEPAGE_DATA,
    context: {
      fetchOptions: {
        next: { revalidate: 60 }, // revalidate the data at most every 60 seconds
      },
    },
  });

  const { data: productsData } = await client.query({
    query: GET_PRODUCTS,
    variables: {
      first: 8,
    },
    context: {
      fetchOptions: {
        next: { revalidate: 60 }, // revalidate the data at most every 60 seconds
      },
    },
  });

  return (
    <div className="flex flex-col">
      <Hero 
        title={homeData.homepageSections?.heroSection?.title || 'Welcome to Our Shop'} 
        subtitle={homeData.homepageSections?.heroSection?.subtitle || 'Find the best products for you'} 
        ctaText={homeData.homepageSections?.heroSection?.ctaText || 'Shop Now'} 
        ctaLink={homeData.homepageSections?.heroSection?.ctaLink || '/shop'} 
        backgroundImage={homeData.homepageSections?.heroSection?.backgroundImage?.url || '/hero-bg.jpg'} 
      />

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">New Arrivals</h2>
          <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
            <ProductGrid products={productsData.products.edges.map(edge => edge.node)} limit={4} searchParams={{}} />
          </Suspense>
        </div>
      </section>

      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden group rounded-lg shadow-lg h-80">
              <Image 
                src="/collection-men.jpg" 
                alt="Men's Collection" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                width={600}
                height={400}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Men's Collection</h3>
                  <a href="/shop?category=men" className="inline-block bg-white text-black font-semibold py-2 px-4 rounded-md hover:bg-gray-200 transition">Shop Now</a>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden group rounded-lg shadow-lg h-80">
              <Image 
                src="/collection-women.jpg" 
                alt="Women's Collection" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                width={600}
                height={400}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Women's Collection</h3>
                  <a href="/shop?category=women" className="inline-block bg-white text-black font-semibold py-2 px-4 rounded-md hover:bg-gray-200 transition">Shop Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Products</h2>
          <Suspense fallback={<div className="h-48 flex items-center justify-center">Loading carousel...</div>}>
            <ItemCarousel products={productsData.products.edges.map(edge => edge.node)} searchParams={{}} />
          </Suspense>
        </div>
      </section>

      <section className="py-12 bg-gray-100 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop By Category</h2>
          <CategoryRows 
            categories={[
              { name: 'Shoes', slug: 'shoes', imageUrl: '/category-shoes.jpg', tag: ProductCategory.Shoes },
              { name: 'Accessories', slug: 'accessories', imageUrl: '/category-accessories.jpg', tag: ProductCategory.Accessories },
              { name: 'Clothing', slug: 'clothing', imageUrl: '/category-clothing.jpg', tag: ProductCategory.Clothing },
              { name: 'Sports', slug: 'sports', imageUrl: '/category-sports.jpg', tag: ProductCategory.Sports }
            ]} 
          />
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Stay updated with the latest products, exclusive offers, and fashion tips.
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary text-white px-6 py-2 rounded-r-md hover:bg-primary-dark transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}