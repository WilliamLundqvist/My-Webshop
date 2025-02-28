import Link from "next/link"
import { useState } from "react"
import { Menu, Search, ShoppingCart, User, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link href="/" className="text-xl font-bold">
                  POWERFIT
                </Link>
                <Link href="#" className="text-lg">
                  Equipment
                </Link>
                <Link href="#" className="text-lg">
                  Weights
                </Link>
                <Link href="#" className="text-lg">
                  Machines
                </Link>
                <Link href="#" className="text-lg">
                  Accessories
                </Link>
                <Link href="#" className="text-lg">
                  New Arrivals
                </Link>
                <Link href="#" className="text-lg">
                  Sale
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">POWERFIT</span>
          </Link>
          <nav className="hidden md:flex md:flex-1 md:items-center md:justify-center md:space-x-6">
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Equipment
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Weights
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Machines
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Accessories
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              New Arrivals
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Sale
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {isSearchOpen ? (
              <div className="relative flex items-center">
                <Input type="search" placeholder="Search..." className="w-[200px] pr-8 md:w-[300px]" autoFocus />
                <Button variant="ghost" size="icon" className="absolute right-0" onClick={() => setIsSearchOpen(false)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close search</span>
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                3
              </Badge>
              <span className="sr-only">Cart</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative h-[500px] w-full overflow-hidden bg-gray-900">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
              }}
            >
              <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="container relative flex h-full flex-col items-start justify-center gap-4 text-white">
              <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                Elevate Your Workout Experience
              </h1>
              <p className="max-w-md text-lg">Professional-grade equipment for your home or commercial gym</p>
              <div className="flex gap-4">
                <Button size="lg" className="font-medium">
                  Shop Now
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View Collections
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Navigation */}
        <section className="border-b py-8 mx-auto">
          <div className="container">
            <h2 className="mb-6 text-2xl font-bold">Shop By Category</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {[
                { name: "Dumbbells", image: "/placeholder.svg?height=300&width=300" },
                { name: "Kettlebells", image: "/placeholder.svg?height=300&width=300" },
                { name: "Barbells", image: "/placeholder.svg?height=300&width=300" },
                { name: "Benches", image: "/placeholder.svg?height=300&width=300" },
                { name: "Racks", image: "/placeholder.svg?height=300&width=300" },
                { name: "Accessories", image: "/placeholder.svg?height=300&width=300" },
              ].map((category) => (
                <Link key={category.name} href="#" className="group flex flex-col items-center gap-2 text-center">
                  <div className="overflow-hidden rounded-full">
                    <img
                      src={category.image || "/placeholder.svg"}
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
          <div className="container mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Featured Equipment</h2>
              <Link href="#" className="text-sm font-medium underline-offset-4 hover:underline">
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
                      name: "Pro Series Adjustable Dumbbell Set",
                      price: 299.99,
                      image: "/placeholder.svg?height=400&width=400",
                      rating: 4.8,
                      reviews: 156,
                    },
                    {
                      name: "Olympic Barbell - 20kg",
                      price: 249.99,
                      image: "/placeholder.svg?height=400&width=400",
                      rating: 4.9,
                      reviews: 203,
                    },
                    {
                      name: "Adjustable Weight Bench",
                      price: 179.99,
                      image: "/placeholder.svg?height=400&width=400",
                      rating: 4.7,
                      reviews: 128,
                    },
                    {
                      name: "Competition Kettlebell Set",
                      price: 349.99,
                      image: "/placeholder.svg?height=400&width=400",
                      rating: 4.8,
                      reviews: 97,
                    },
                  ].map((product, index) => (
                    <Card key={index} className="overflow-hidden border-0 shadow-sm">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="line-clamp-2 font-medium">{product.name}</h3>
                        <div className="mt-2 flex items-center text-sm">
                          <span className="text-yellow-500">★★★★★</span>
                          <span className="ml-1 text-muted-foreground">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>
                        <div className="mt-2 font-semibold">${product.price.toFixed(2)}</div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full">Add to Cart</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="new" className="mt-0">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {/* New arrivals products would go here */}
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">New arrivals coming soon</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="sale" className="mt-0">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {/* Sale products would go here */}
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">Sale items coming soon</p>
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
                <h2 className="mb-4 text-3xl font-bold">The Home Gym Collection</h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  Everything you need to build the perfect home gym in one convenient package. Save up to 20% when you
                  buy the complete set.
                </p>
                <div>
                  <Button size="lg" className="font-medium">
                    Shop Collection
                  </Button>
                </div>
              </div>
              <div className="relative h-[300px] overflow-hidden rounded-lg md:h-auto">
                <img
                  src="/placeholder.svg?height=600&width=800"
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
            <h2 className="mb-8 text-center text-2xl font-bold">Why Choose PowerFit</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Premium Quality",
                  description: "Commercial-grade equipment built to last with premium materials",
                },
                {
                  title: "Free Shipping",
                  description: "Free shipping on all orders over $100",
                },
                {
                  title: "Expert Support",
                  description: "Get advice from fitness professionals on the right equipment",
                },
                {
                  title: "Easy Returns",
                  description: "30-day money-back guarantee on all products",
                },
              ].map((benefit, index) => (
                <div key={index} className="flex flex-col items-center text-center">
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
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold">Join Our Community</h2>
              <p className="mb-6">
                Subscribe to our newsletter for exclusive deals, fitness tips, and new product announcements.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
                <Input type="email" placeholder="Enter your email" className="bg-primary-foreground text-primary" />
                <Button variant="secondary" className="sm:flex-shrink-0">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/40">
        <div className="container py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Shop</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Equipment
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Weights
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Machines
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Accessories
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Sale
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Shipping Information
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    YouTube
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} PowerFit. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

