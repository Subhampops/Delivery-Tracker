import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, Shield, Clock, Search, ArrowRight, Truck, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-teal-600" />
            <span className="text-xl font-bold">dPackChain</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              Home
            </Link>
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
              Dashboard
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Link href="/register-shipment">
              <Button>Register Shipment</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-teal-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Track Your Parcels... On-Chain
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    A transparent, verifiable package tracking system powered by blockchain technology. No more lost
                    packages or fake delivery updates.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/track">
                    <Button size="lg" className="gap-2">
                      Track Package <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/register-shipment">
                    <Button size="lg" variant="outline">
                      Register Shipment
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[500px] aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-200 to-teal-400 rounded-lg opacity-20 blur-xl"></div>
                  <div className="relative bg-white p-6 rounded-lg shadow-lg border">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-teal-600">
                        <Search className="h-5 w-5" />
                        <h3 className="font-semibold">Track Your Package</h3>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Enter your tracking number</p>
                        <div className="flex gap-2">
                          <Input placeholder="e.g. DPC-1234-5678-90" />
                          <Button>Track</Button>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Package Status</span>
                            <span className="text-sm text-teal-600 font-medium">In Transit</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-teal-600 h-2.5 rounded-full w-2/3"></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Shipped</span>
                            <span>In Transit</span>
                            <span>Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why Choose dPackChain?</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our blockchain-powered shipping platform offers transparency and reliability that traditional systems
                  can't match.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 pt-8">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Shield className="h-12 w-12 text-teal-600" />
                <h3 className="text-xl font-bold">Immutable Records</h3>
                <p className="text-center text-gray-500">
                  Every shipment update is permanently recorded on the blockchain, making it tamper-proof and
                  verifiable.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Clock className="h-12 w-12 text-teal-600" />
                <h3 className="text-xl font-bold">Real-time Updates</h3>
                <p className="text-center text-gray-500">
                  Get instant notifications and track your package's journey with accurate, real-time status updates.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <BarChart3 className="h-12 w-12 text-teal-600" />
                <h3 className="text-xl font-bold">Analytics & Insights</h3>
                <p className="text-center text-gray-500">
                  Access delivery speed stats, average delays by area, and other analytics powered by Pharos.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">Process</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A simple, transparent process for both senders and receivers.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-4 pt-12">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                  1
                </div>
                <h3 className="text-lg font-bold">Register Shipment</h3>
                <p className="text-sm text-gray-500">
                  Seller registers the shipment on-chain with sender, receiver, and package details.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                  2
                </div>
                <h3 className="text-lg font-bold">Status Updates</h3>
                <p className="text-sm text-gray-500">
                  Delivery updates are recorded via smart contract events as the package moves.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                  3
                </div>
                <h3 className="text-lg font-bold">Track Package</h3>
                <p className="text-sm text-gray-500">
                  Users enter their Tracking ID to view real-time status and location information.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                  4
                </div>
                <h3 className="text-lg font-bold">Delivery Confirmation</h3>
                <p className="text-sm text-gray-500">
                  Final delivery is signed by receiver via wallet signature or OTP verification.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Get Started?</h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Join the future of package tracking with our blockchain-powered solution. Register your first
                    shipment today.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register-shipment">
                    <Button size="lg" className="gap-2">
                      Register Shipment <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline">
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[500px] aspect-video">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-200 to-teal-400 rounded-lg opacity-20 blur-xl"></div>
                  <div className="relative bg-white p-6 rounded-lg shadow-lg border">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-teal-600">
                        <Truck className="h-5 w-5" />
                        <h3 className="font-semibold">Shipment Statistics</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border p-3">
                          <div className="text-3xl font-bold text-teal-600">98%</div>
                          <div className="text-sm text-gray-500">On-time Delivery</div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="text-3xl font-bold text-teal-600">10k+</div>
                          <div className="text-sm text-gray-500">Packages Tracked</div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="text-3xl font-bold text-teal-600">24h</div>
                          <div className="text-sm text-gray-500">Avg. Delivery Time</div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="text-3xl font-bold text-teal-600">100%</div>
                          <div className="text-sm text-gray-500">Transparency</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12 px-4 md:px-6">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Package className="h-5 w-5 text-teal-600" />
              <span className="text-lg font-bold">dPackChain</span>
            </Link>
            <p className="text-sm text-gray-500">Track your parcels... on-chain.</p>
          </div>
          <nav className="flex gap-4 md:gap-6">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
