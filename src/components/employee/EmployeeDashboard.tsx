"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// TypeScript Types
interface Employee {
  id: string;
  email: string;
  name: string;
  role: "admin" | "engineer" | "sales" | "operations";
}

interface Project {
  id: string;
  name: string;
  customer: string;
  type: "padmount" | "substation" | "dry-type" | "custom";
  kva: number;
  voltage: string;
  status: "design" | "review" | "approved" | "manufacturing" | "testing" | "shipped";
  assignedTo: string;
  dueDate: string;
  createdAt: string;
}

interface Quote {
  id: string;
  customer: string;
  email: string;
  type: string;
  kva: number;
  voltage: string;
  status: "pending" | "reviewed" | "quoted" | "accepted" | "declined";
  estimatedValue: number;
  submittedAt: string;
  notes?: string;
}

interface MarketplaceListing {
  id: string;
  seller: string;
  sellerEmail: string;
  type: string;
  kva: number;
  voltage: string;
  condition: "new" | "used-excellent" | "used-good" | "used-fair" | "refurbished";
  askingPrice: number;
  status: "pending-review" | "approved" | "rejected" | "sold";
  submittedAt: string;
  location: string;
}

interface Order {
  id: string;
  projectId: string;
  customer: string;
  type: string;
  kva: number;
  status: "pending" | "in-production" | "quality-check" | "ready-to-ship" | "shipped" | "delivered";
  orderDate: string;
  estimatedDelivery: string;
  trackingNumber?: string;
}

// Mock Data
const mockProjects: Project[] = [
  {
    id: "PRJ-001",
    name: "Austin Data Center - Unit A",
    customer: "TechCorp Industries",
    type: "padmount",
    kva: 2500,
    voltage: "13.8kV / 480V",
    status: "manufacturing",
    assignedTo: "John Martinez",
    dueDate: "2026-03-15",
    createdAt: "2026-01-10",
  },
  {
    id: "PRJ-002",
    name: "Houston Solar Farm Substation",
    customer: "SunPower Texas",
    type: "substation",
    kva: 10000,
    voltage: "69kV / 13.8kV",
    status: "design",
    assignedTo: "Sarah Chen",
    dueDate: "2026-04-20",
    createdAt: "2026-01-25",
  },
  {
    id: "PRJ-003",
    name: "Dallas Office Complex",
    customer: "Metro Properties LLC",
    type: "dry-type",
    kva: 750,
    voltage: "480V / 208V",
    status: "approved",
    assignedTo: "Mike Johnson",
    dueDate: "2026-02-28",
    createdAt: "2026-01-05",
  },
  {
    id: "PRJ-004",
    name: "San Antonio Manufacturing Plant",
    customer: "Industrial Solutions Inc",
    type: "padmount",
    kva: 5000,
    voltage: "34.5kV / 480V",
    status: "review",
    assignedTo: "Emily Rodriguez",
    dueDate: "2026-05-01",
    createdAt: "2026-01-20",
  },
];

const mockQuotes: Quote[] = [
  {
    id: "QT-001",
    customer: "Green Energy Corp",
    email: "procurement@greenenergy.com",
    type: "Padmount Transformer",
    kva: 3000,
    voltage: "25kV / 480V",
    status: "pending",
    estimatedValue: 125000,
    submittedAt: "2026-01-27",
  },
  {
    id: "QT-002",
    customer: "City of Fort Worth",
    email: "utilities@fortworthtx.gov",
    type: "Substation Transformer",
    kva: 15000,
    voltage: "138kV / 13.8kV",
    status: "reviewed",
    estimatedValue: 450000,
    submittedAt: "2026-01-25",
    notes: "Government project - requires bid documentation",
  },
  {
    id: "QT-003",
    customer: "Retail Development Group",
    email: "projects@retaildev.com",
    type: "Dry-Type Transformer",
    kva: 500,
    voltage: "480V / 208V",
    status: "quoted",
    estimatedValue: 28000,
    submittedAt: "2026-01-22",
  },
  {
    id: "QT-004",
    customer: "AgriTech Farms",
    email: "operations@agritechfarms.com",
    type: "Padmount Transformer",
    kva: 1500,
    voltage: "13.8kV / 480V",
    status: "pending",
    estimatedValue: 75000,
    submittedAt: "2026-01-28",
  },
];

const mockListings: MarketplaceListing[] = [
  {
    id: "MKT-001",
    seller: "Industrial Surplus Co",
    sellerEmail: "sales@industrialsurplus.com",
    type: "Padmount Transformer",
    kva: 2000,
    voltage: "13.8kV / 480V",
    condition: "used-excellent",
    askingPrice: 45000,
    status: "pending-review",
    submittedAt: "2026-01-26",
    location: "Houston, TX",
  },
  {
    id: "MKT-002",
    seller: "PowerGrid Decommission",
    sellerEmail: "inventory@powergrid.com",
    type: "Substation Transformer",
    kva: 7500,
    voltage: "69kV / 13.8kV",
    condition: "refurbished",
    askingPrice: 180000,
    status: "approved",
    submittedAt: "2026-01-20",
    location: "Dallas, TX",
  },
  {
    id: "MKT-003",
    seller: "Factory Liquidators",
    sellerEmail: "contact@factoryliq.com",
    type: "Dry-Type Transformer",
    kva: 300,
    voltage: "480V / 208V",
    condition: "used-good",
    askingPrice: 8500,
    status: "pending-review",
    submittedAt: "2026-01-27",
    location: "Austin, TX",
  },
];

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    projectId: "PRJ-001",
    customer: "TechCorp Industries",
    type: "Padmount 2500kVA",
    kva: 2500,
    status: "in-production",
    orderDate: "2026-01-15",
    estimatedDelivery: "2026-03-10",
  },
  {
    id: "ORD-002",
    projectId: "PRJ-003",
    customer: "Metro Properties LLC",
    type: "Dry-Type 750kVA",
    kva: 750,
    status: "quality-check",
    orderDate: "2026-01-08",
    estimatedDelivery: "2026-02-25",
  },
  {
    id: "ORD-003",
    projectId: "PRJ-005",
    customer: "Lone Star Energy",
    type: "Padmount 1000kVA",
    kva: 1000,
    status: "shipped",
    orderDate: "2025-12-20",
    estimatedDelivery: "2026-01-30",
    trackingNumber: "1Z999AA10123456784",
  },
  {
    id: "ORD-004",
    projectId: "PRJ-006",
    customer: "Gulf Coast Utilities",
    type: "Substation 5000kVA",
    kva: 5000,
    status: "delivered",
    orderDate: "2025-12-01",
    estimatedDelivery: "2026-01-15",
    trackingNumber: "1Z999AA10123456785",
  },
];

// Status Badge Variants
const getProjectStatusBadge = (status: Project["status"]) => {
  const variants: Record<Project["status"], { label: string; className: string }> = {
    design: { label: "Design", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    review: { label: "In Review", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    approved: { label: "Approved", className: "bg-green-500/20 text-green-400 border-green-500/30" },
    manufacturing: { label: "Manufacturing", className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    testing: { label: "Testing", className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    shipped: { label: "Shipped", className: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  };
  return variants[status];
};

const getQuoteStatusBadge = (status: Quote["status"]) => {
  const variants: Record<Quote["status"], { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    reviewed: { label: "Reviewed", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    quoted: { label: "Quoted", className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    accepted: { label: "Accepted", className: "bg-green-500/20 text-green-400 border-green-500/30" },
    declined: { label: "Declined", className: "bg-red-500/20 text-red-400 border-red-500/30" },
  };
  return variants[status];
};

const getListingStatusBadge = (status: MarketplaceListing["status"]) => {
  const variants: Record<MarketplaceListing["status"], { label: string; className: string }> = {
    "pending-review": { label: "Pending Review", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    approved: { label: "Approved", className: "bg-green-500/20 text-green-400 border-green-500/30" },
    rejected: { label: "Rejected", className: "bg-red-500/20 text-red-400 border-red-500/30" },
    sold: { label: "Sold", className: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  };
  return variants[status];
};

const getOrderStatusBadge = (status: Order["status"]) => {
  const variants: Record<Order["status"], { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
    "in-production": { label: "In Production", className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    "quality-check": { label: "Quality Check", className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    "ready-to-ship": { label: "Ready to Ship", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    shipped: { label: "Shipped", className: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
    delivered: { label: "Delivered", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  };
  return variants[status];
};

const getConditionBadge = (condition: MarketplaceListing["condition"]) => {
  const variants: Record<MarketplaceListing["condition"], { label: string; className: string }> = {
    new: { label: "New", className: "bg-green-500/20 text-green-400 border-green-500/30" },
    "used-excellent": { label: "Used - Excellent", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    "used-good": { label: "Used - Good", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    "used-fair": { label: "Used - Fair", className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    refurbished: { label: "Refurbished", className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  };
  return variants[condition];
};

// Login Form Component
function LoginForm({ onLogin }: { onLogin: (employee: Employee) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock employee users (would be replaced with Supabase auth)
  const mockEmployees: Record<string, Employee> = {
    "admin@fluxco.com": { id: "1", email: "admin@fluxco.com", name: "Admin User", role: "admin" },
    "engineer@fluxco.com": { id: "2", email: "engineer@fluxco.com", name: "John Martinez", role: "engineer" },
    "sales@fluxco.com": { id: "3", email: "sales@fluxco.com", name: "Sarah Chen", role: "sales" },
    "ops@fluxco.com": { id: "4", email: "ops@fluxco.com", name: "Mike Johnson", role: "operations" },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock authentication (password is "fluxco123" for all users)
    const employee = mockEmployees[email.toLowerCase()];
    if (employee && password === "fluxco123") {
      onLogin(employee);
    } else {
      setError("Invalid email or password");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-display">Employee Portal</CardTitle>
          <CardDescription>Sign in to access the FluxCo project management dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@fluxco.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md p-3">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Demo credentials: any email ending in @fluxco.com with password &quot;fluxco123&quot;
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Dashboard Header Component
function DashboardHeader({ employee, onLogout }: { employee: Employee; onLogout: () => void }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-display text-foreground">Employee Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {employee.name} ({employee.role})
        </p>
      </div>
      <Button variant="outline" onClick={onLogout}>
        Sign Out
      </Button>
    </div>
  );
}

// Stats Cards Component
function StatsCards() {
  const stats = [
    { label: "Active Projects", value: mockProjects.filter((p) => p.status !== "shipped").length, color: "text-primary" },
    { label: "Pending Quotes", value: mockQuotes.filter((q) => q.status === "pending").length, color: "text-yellow-400" },
    { label: "Marketplace Listings", value: mockListings.filter((l) => l.status === "pending-review").length, color: "text-purple-400" },
    { label: "Orders In Progress", value: mockOrders.filter((o) => !["delivered", "shipped"].includes(o.status)).length, color: "text-green-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card/50 backdrop-blur border-border">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-3xl font-display mt-2 ${stat.color}`}>{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Projects Tab Component
function ProjectsTab() {
  return (
    <Card className="bg-card/50 backdrop-blur border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transformer Design Projects</CardTitle>
            <CardDescription>Manage and track all transformer design and manufacturing projects</CardDescription>
          </div>
          <Button>New Project</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Specs</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProjects.map((project) => {
              const statusBadge = getProjectStatusBadge(project.status);
              return (
                <TableRow key={project.id}>
                  <TableCell className="font-mono text-sm">{project.id}</TableCell>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.customer}</TableCell>
                  <TableCell className="capitalize">{project.type}</TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {project.kva.toLocaleString()} kVA
                      <br />
                      <span className="text-muted-foreground">{project.voltage}</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                  </TableCell>
                  <TableCell>{project.assignedTo}</TableCell>
                  <TableCell>{project.dueDate}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Quotes Tab Component
function QuotesTab() {
  return (
    <Card className="bg-card/50 backdrop-blur border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quote Requests</CardTitle>
            <CardDescription>Review and respond to customer quote requests</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quote ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Specs</TableHead>
              <TableHead>Est. Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockQuotes.map((quote) => {
              const statusBadge = getQuoteStatusBadge(quote.status);
              return (
                <TableRow key={quote.id}>
                  <TableCell className="font-mono text-sm">{quote.id}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{quote.customer}</span>
                      <br />
                      <span className="text-sm text-muted-foreground">{quote.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{quote.type}</TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {quote.kva.toLocaleString()} kVA
                      <br />
                      <span className="text-muted-foreground">{quote.voltage}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-green-400">${quote.estimatedValue.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                  </TableCell>
                  <TableCell>{quote.submittedAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        Review
                      </Button>
                      {quote.status === "pending" && (
                        <Button variant="default" size="sm">
                          Create Quote
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Marketplace Tab Component
function MarketplaceTab() {
  return (
    <Card className="bg-card/50 backdrop-blur border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Marketplace Submissions</CardTitle>
            <CardDescription>Review and manage user-submitted transformer listings</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Filter</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing ID</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Specs</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Asking Price</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockListings.map((listing) => {
              const statusBadge = getListingStatusBadge(listing.status);
              const conditionBadge = getConditionBadge(listing.condition);
              return (
                <TableRow key={listing.id}>
                  <TableCell className="font-mono text-sm">{listing.id}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{listing.seller}</span>
                      <br />
                      <span className="text-sm text-muted-foreground">{listing.sellerEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>{listing.type}</TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {listing.kva.toLocaleString()} kVA
                      <br />
                      <span className="text-muted-foreground">{listing.voltage}</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={conditionBadge.className}>{conditionBadge.label}</Badge>
                  </TableCell>
                  <TableCell className="text-green-400">${listing.askingPrice.toLocaleString()}</TableCell>
                  <TableCell>{listing.location}</TableCell>
                  <TableCell>
                    <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {listing.status === "pending-review" && (
                        <>
                          <Button variant="default" size="sm">
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm">
                            Reject
                          </Button>
                        </>
                      )}
                      {listing.status !== "pending-review" && (
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Orders Tab Component
function OrdersTab() {
  return (
    <Card className="bg-card/50 backdrop-blur border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Order Fulfillment</CardTitle>
            <CardDescription>Track manufacturing and shipping status of all orders</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export Report</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Project ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Est. Delivery</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrders.map((order) => {
              const statusBadge = getOrderStatusBadge(order.status);
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.id}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{order.projectId}</TableCell>
                  <TableCell className="font-medium">{order.customer}</TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>
                    <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                  </TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.estimatedDelivery}</TableCell>
                  <TableCell>
                    {order.trackingNumber ? (
                      <span className="font-mono text-xs text-primary">{order.trackingNumber}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                      {order.status === "ready-to-ship" && (
                        <Button variant="default" size="sm">
                          Ship
                        </Button>
                      )}
                      {order.status === "quality-check" && (
                        <Button variant="default" size="sm">
                          Approve QC
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Main Dashboard Component
export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState<Employee | null>(null);

  const handleLogin = (emp: Employee) => {
    setEmployee(emp);
    // In production, would store in session/localStorage
  };

  const handleLogout = () => {
    setEmployee(null);
  };

  if (!employee) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader employee={employee} onLogout={handleLogout} />
      <StatsCards />

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="bg-card/50 backdrop-blur border border-border mb-6">
          <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Projects
          </TabsTrigger>
          <TabsTrigger value="quotes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Quotes
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <ProjectsTab />
        </TabsContent>

        <TabsContent value="quotes">
          <QuotesTab />
        </TabsContent>

        <TabsContent value="marketplace">
          <MarketplaceTab />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
