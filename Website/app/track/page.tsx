"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, ArrowLeft, Truck, MapPin, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("")
  const [trackingResult, setTrackingResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!trackingId) return

    setIsLoading(true)

    // Simulate API call to blockchain
    setTimeout(() => {
      // Mock data - in a real app, this would come from the blockchain via Pharos
      setTrackingResult({
        id: trackingId,
        status: "In Transit",
        statusCode: 2, // 1: Registered, 2: In Transit, 3: Out for Delivery, 4: Delivered
        sender: "0x1234...5678",
        receiver: "0xabcd...ef01",
        timestamps: [
          { status: "Registered", time: "2023-06-10T10:30:00Z", location: "New York, NY", hash: "0x123..." },
          { status: "Picked Up", time: "2023-06-10T14:45:00Z", location: "New York, NY", hash: "0x456..." },
          { status: "In Transit", time: "2023-06-11T09:15:00Z", location: "Chicago, IL", hash: "0x789..." },
        ],
        estimatedDelivery: "2023-06-13T17:00:00Z",
      })
      setIsLoading(false)
    }, 1500)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

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
            <Link href="/#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
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
      <main className="flex-1 container px-4 md:px-6 py-8 md:py-12">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Track Your Package</h1>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Package Tracker</CardTitle>
            <CardDescription>
              Enter your tracking number to see real-time, blockchain-verified status updates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrack} className="flex gap-2 mb-6">
              <Input
                placeholder="Enter tracking ID (e.g. DPC-1234-5678-90)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !trackingId}>
                {isLoading ? "Tracking..." : "Track"}
              </Button>
            </form>

            {isLoading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              </div>
            )}

            {trackingResult && !isLoading && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Tracking Number</h3>
                    <p className="font-mono">{trackingResult.id}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-teal-600"></span>
                      <p className="font-medium text-teal-600">{trackingResult.status}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Sender</h3>
                    <p className="font-mono text-sm">{trackingResult.sender}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Receiver</h3>
                    <p className="font-mono text-sm">{trackingResult.receiver}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Estimated Delivery</h3>
                  <p className="font-medium">{formatDate(trackingResult.estimatedDelivery)}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Tracking Progress</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div
                      className="bg-teal-600 h-2.5 rounded-full"
                      style={{ width: `${(trackingResult.statusCode / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Shipment History</h3>
                  <div className="space-y-4">
                    {trackingResult.timestamps.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
                            {event.status === "Registered" && <Package className="h-4 w-4" />}
                            {event.status === "Picked Up" && <Truck className="h-4 w-4" />}
                            {event.status === "In Transit" && <MapPin className="h-4 w-4" />}
                            {event.status === "Delivered" && <CheckCircle2 className="h-4 w-4" />}
                          </div>
                          {index < trackingResult.timestamps.length - 1 && (
                            <div className="w-0.5 bg-gray-200 h-full mt-1"></div>
                          )}
                        </div>
                        <div className="space-y-1 pb-4">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{event.status}</p>
                            <span className="text-xs text-gray-500">{formatDate(event.time)}</span>
                          </div>
                          <p className="text-sm text-gray-500">{event.location}</p>
                          <a
                            href={`https://etherscan.io/tx/${event.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-teal-600 hover:underline"
                          >
                            View on blockchain: {event.hash}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
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
