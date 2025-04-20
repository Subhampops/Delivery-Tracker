"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Package, ArrowLeft, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterShipmentPage() {
  const [formData, setFormData] = useState({
    senderAddress: "",
    receiverAddress: "",
    receiverWallet: "",
    packageDescription: "",
    weight: "",
    dimensions: "",
    shippingMethod: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [trackingId, setTrackingId] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate blockchain transaction
    setTimeout(() => {
      // Generate a random tracking ID
      const randomId = `DPC-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`
      setTrackingId(randomId)
      setIsSuccess(true)
      setIsSubmitting(false)
    }, 2000)
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
            <Link href="/track">
              <Button variant="outline">Track Package</Button>
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
          <h1 className="text-2xl font-bold">Register Shipment</h1>
        </div>

        {isSuccess ? (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <CardTitle>Shipment Registered Successfully!</CardTitle>
              </div>
              <CardDescription>
                Your shipment has been registered on the blockchain and is ready to be tracked.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4 bg-gray-50">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Tracking Number</h3>
                  <p className="font-mono text-lg font-bold">{trackingId}</p>
                  <p className="text-sm text-gray-500">
                    Share this tracking number with the recipient so they can track the package.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Transaction Details</h3>
                <div className="grid gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Transaction Hash:</span>
                    <span className="font-mono">0x7f9e4b5c3d2a1b0e8f7d6c5b4a3...</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Block Number:</span>
                    <span>12345678</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Gas Used:</span>
                    <span>0.0023 ETH</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/dashboard">
                <Button variant="outline">Go to Dashboard</Button>
              </Link>
              <Link href={`/track?id=${trackingId}`}>
                <Button>Track This Package</Button>
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Register a New Shipment</CardTitle>
              <CardDescription>Enter the shipment details to register it on the blockchain.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Sender Information</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="senderAddress">Physical Address</Label>
                      <Textarea
                        id="senderAddress"
                        name="senderAddress"
                        placeholder="Enter the complete sender address"
                        value={formData.senderAddress}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Receiver Information</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="receiverAddress">Physical Address</Label>
                      <Textarea
                        id="receiverAddress"
                        name="receiverAddress"
                        placeholder="Enter the complete receiver address"
                        value={formData.receiverAddress}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="receiverWallet">Wallet Address (Optional)</Label>
                      <Input
                        id="receiverWallet"
                        name="receiverWallet"
                        placeholder="0x..."
                        value={formData.receiverWallet}
                        onChange={handleChange}
                      />
                      <p className="text-xs text-gray-500">
                        If provided, the receiver will need to sign with this wallet to confirm delivery.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Package Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="packageDescription">Description</Label>
                      <Textarea
                        id="packageDescription"
                        name="packageDescription"
                        placeholder="Brief description of package contents"
                        value={formData.packageDescription}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          name="weight"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.weight}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dimensions">Dimensions (cm)</Label>
                        <Input
                          id="dimensions"
                          name="dimensions"
                          placeholder="L x W x H"
                          value={formData.dimensions}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Shipping Method</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="shippingMethod">Select Method</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("shippingMethod", value)}
                      value={formData.shippingMethod}
                      required
                    >
                      <SelectTrigger id="shippingMethod">
                        <SelectValue placeholder="Select shipping method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (3-5 days)</SelectItem>
                        <SelectItem value="express">Express (1-2 days)</SelectItem>
                        <SelectItem value="sameday">Same Day</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Registering on Blockchain...
                      </>
                    ) : (
                      "Register Shipment"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
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
