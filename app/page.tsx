import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "./components/ProductCard";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative h-[500px] w-full overflow-hidden bg-gray-900">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://placehold.co/1920x1080')",
              }}
            >
              <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="container relative flex h-full flex-col items-start justify-center gap-4 text-white">
              <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                Elevate Your Workout Experience
              </h1>
              <p className="max-w-md text-lg">
                Professional-grade equipment for your home or commercial gym
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="font-medium">
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  View Collections
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Navigation */}
        <section className="border-b py-8">
          <div className="container ">
            <h2 className="mb-6 text-2xl font-bold">Shop By Category</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {[
                { name: "Dumbbells", image: "https://placehold.co/300x300" },
                { name: "Kettlebells", image: "https://placehold.co/300x300" },
                { name: "Barbells", image: "https://placehold.co/300x300" },
                { name: "Benches", image: "https://placehold.co/300x300" },
                { name: "Racks", image: "https://placehold.co/300x300" },
                { name: "Accessories", image: "https://placehold.co/300x300" },
              ].map((category) => (
                <Link
                  key={category.name}
                  href="#"
                  className="group flex flex-col items-center gap-2 text-center"
                >
                  <div className="overflow-hidden rounded-full">
                    <img
                      src={category.image || "https://placehold.co/300x300"}
                      alt={category.name}
                      width={150}
                      height={150}
                      className="aspect-square h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <span className="font-medium">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Featured Equipment</h2>
              <Link
                href="#"
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                View All
              </Link>
            </div>

            <Tabs defaultValue="bestsellers" className="mb-8">
              <TabsList className="mb-6">
                <TabsTrigger value="bestsellers">Bestsellers</TabsTrigger>
                <TabsTrigger value="new">New Arrivals</TabsTrigger>
                <TabsTrigger value="sale">On Sale</TabsTrigger>
              </TabsList>
              <TabsContent value="bestsellers" className="mt-0">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {[
                    {
                      id: "product-1",
                      name: "Premium Yoga Mat",
                      slug: "premium-yoga-mat",
                      sku: "YM001",
                      price: 49.99,
                      image: "https://placehold.co/400x400",
                      rating: 4.5,
                      reviews: 210,
                    },
                    {
                      id: "product-2",
                      name: "Resistance Bands Set",
                      slug: "resistance-bands-set",
                      sku: "RB002",
                      price: 29.99,
                      image: "https://placehold.co/400x400",
                      rating: 4.3,
                      reviews: 185,
                    },
                    {
                      id: "product-3",
                      name: "Adjustable Weight Bench",
                      slug: "adjustable-weight-bench",
                      sku: "WB003",
                      price: 179.99,
                      image: "https://placehold.co/400x400",
                      rating: 4.7,
                      reviews: 128,
                    },
                    {
                      id: "product-4",
                      name: "Competition Kettlebell Set",
                      slug: "competition-kettlebell-set",
                      sku: "KB004",
                      price: 349.99,
                      image: "https://placehold.co/400x400",
                      rating: 4.8,
                      reviews: 97,
                    },
                  ].map((product, index) => (
                    <ProductCard key={index} product={product} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="new" className="mt-0">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {/* New arrivals products would go here */}
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">
                      New arrivals coming soon
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="sale" className="mt-0">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {/* Sale products would go here */}
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">
                      Sale items coming soon
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Featured Collection */}
        <section className="bg-muted py-12">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col justify-center">
                <h2 className="mb-4 text-3xl font-bold">
                  The Home Gym Collection
                </h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  Everything you need to build the perfect home gym in one
                  convenient package. Save up to 20% when you buy the complete
                  set.
                </p>
                <div>
                  <Button size="lg" className="font-medium">
                    Shop Collection
                  </Button>
                </div>
              </div>
              <div className="relative h-[300px] overflow-hidden rounded-lg md:h-auto">
                <img
                  src="https://placehold.co/800x600"
                  alt="Home Gym Collection"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12">
          <div className="container">
            <h2 className="mb-8 text-center text-2xl font-bold">
              Why Choose PowerFit
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Premium Quality",
                  description:
                    "Commercial-grade equipment built to last with premium materials",
                },
                {
                  title: "Free Shipping",
                  description: "Free shipping on all orders over $100",
                },
                {
                  title: "Expert Support",
                  description:
                    "Get advice from fitness professionals on the right equipment",
                },
                {
                  title: "Easy Returns",
                  description: "30-day money-back guarantee on all products",
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <div className="h-8 w-8 rounded-full bg-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-primary py-12 text-primary-foreground">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="mb-4 text-3xl font-bold">Join Our Community</h2>
              <p className="mb-6">
                Subscribe to our newsletter for exclusive deals, fitness tips,
                and new product announcements.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-primary-foreground text-primary"
                />
                <Button variant="secondary" className="sm:flex-shrink-0">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>
  );
}
