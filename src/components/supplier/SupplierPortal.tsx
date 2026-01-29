"use client";

import { useState } from "react";
import {
  FileText,
  DollarSign,
  Trophy,
  LogOut,
  Building2,
  Clock,
  Zap,
  Calendar,
  Send,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ==================== Types ====================

interface Supplier {
  id: string;
  companyName: string;
  email: string;
  contactName: string;
  phone: string;
  location: string;
  certifications: string[];
}

interface RFQ {
  id: string;
  title: string;
  description: string;
  capacityKVA: number;
  primaryVoltage: string;
  secondaryVoltage: string;
  phase: "single" | "three";
  cooling: string;
  application: string;
  quantity: number;
  deliveryDeadline: string;
  bidDeadline: string;
  status: "open" | "closed" | "awarded";
  specialRequirements?: string;
}

interface Bid {
  id: string;
  rfqId: string;
  rfqTitle: string;
  supplierId: string;
  unitPrice: number;
  totalPrice: number;
  leadTimeDays: number;
  notes: string;
  submittedAt: string;
  status: "pending" | "under_review" | "accepted" | "rejected";
}

interface Contract {
  id: string;
  rfqId: string;
  rfqTitle: string;
  supplierId: string;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
  deliveryDate: string;
  awardedAt: string;
  status: "active" | "in_production" | "shipped" | "completed";
}

// ==================== Mock Data ====================

const mockSupplier: Supplier = {
  id: "sup-001",
  companyName: "Texas Transformer Manufacturing",
  email: "sales@texastrans.com",
  contactName: "Robert Martinez",
  phone: "+1 (512) 555-0123",
  location: "Houston, TX",
  certifications: ["ISO 9001", "IEEE C57", "DOE 2016"],
};

const mockRFQs: RFQ[] = [
  {
    id: "rfq-2024-001",
    title: "500 kVA Distribution Transformers",
    description:
      "Pad-mounted distribution transformers for municipal utility expansion project.",
    capacityKVA: 500,
    primaryVoltage: "12,470V",
    secondaryVoltage: "480V",
    phase: "three",
    cooling: "ONAN",
    application: "Distribution",
    quantity: 25,
    deliveryDeadline: "2024-06-15",
    bidDeadline: "2024-02-28",
    status: "open",
    specialRequirements: "DOE 2016 efficiency compliant. FEOC certification required.",
  },
  {
    id: "rfq-2024-002",
    title: "2.5 MVA Substation Transformer",
    description:
      "Large power transformer for industrial facility upgrade.",
    capacityKVA: 2500,
    primaryVoltage: "34,500V",
    secondaryVoltage: "4,160V",
    phase: "three",
    cooling: "ONAF",
    application: "Power",
    quantity: 3,
    deliveryDeadline: "2024-08-01",
    bidDeadline: "2024-03-15",
    status: "open",
    specialRequirements: "Temperature rise testing required. Include factory witness test.",
  },
  {
    id: "rfq-2024-003",
    title: "75 kVA Pole-Mount Units",
    description:
      "Single-phase pole-mounted transformers for rural electrification.",
    capacityKVA: 75,
    primaryVoltage: "7,200V",
    secondaryVoltage: "240/120V",
    phase: "single",
    cooling: "ONAN",
    application: "Distribution",
    quantity: 150,
    deliveryDeadline: "2024-05-01",
    bidDeadline: "2024-02-15",
    status: "closed",
  },
  {
    id: "rfq-2024-004",
    title: "1000 kVA Mining Transformer",
    description:
      "Heavy-duty transformers for underground mining operations.",
    capacityKVA: 1000,
    primaryVoltage: "13,800V",
    secondaryVoltage: "600V",
    phase: "three",
    cooling: "KNAN",
    application: "Specialty",
    quantity: 8,
    deliveryDeadline: "2024-07-15",
    bidDeadline: "2024-03-01",
    status: "open",
    specialRequirements: "Explosion-proof enclosure. Mining safety certification required.",
  },
];

const mockBids: Bid[] = [
  {
    id: "bid-001",
    rfqId: "rfq-2024-001",
    rfqTitle: "500 kVA Distribution Transformers",
    supplierId: "sup-001",
    unitPrice: 18500,
    totalPrice: 462500,
    leadTimeDays: 90,
    notes: "Includes 2-year warranty and installation support.",
    submittedAt: "2024-02-10",
    status: "under_review",
  },
  {
    id: "bid-002",
    rfqId: "rfq-2024-003",
    rfqTitle: "75 kVA Pole-Mount Units",
    supplierId: "sup-001",
    unitPrice: 4200,
    totalPrice: 630000,
    leadTimeDays: 60,
    notes: "Bulk discount applied. Can expedite for additional 5%.",
    submittedAt: "2024-02-05",
    status: "rejected",
  },
];

const mockContracts: Contract[] = [
  {
    id: "con-001",
    rfqId: "rfq-2023-045",
    rfqTitle: "300 kVA Industrial Transformers",
    supplierId: "sup-001",
    unitPrice: 12800,
    totalPrice: 256000,
    quantity: 20,
    deliveryDate: "2024-03-15",
    awardedAt: "2023-12-01",
    status: "in_production",
  },
  {
    id: "con-002",
    rfqId: "rfq-2023-032",
    rfqTitle: "50 kVA Dry-Type Units",
    supplierId: "sup-001",
    unitPrice: 3500,
    totalPrice: 175000,
    quantity: 50,
    deliveryDate: "2024-01-30",
    awardedAt: "2023-10-15",
    status: "shipped",
  },
];

// ==================== Component ====================

const SupplierPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [supplier] = useState<Supplier>(mockSupplier);
  const [rfqs] = useState<RFQ[]>(mockRFQs);
  const [bids, setBids] = useState<Bid[]>(mockBids);
  const [contracts] = useState<Contract[]>(mockContracts);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Bid form state
  const [bidPrice, setBidPrice] = useState("");
  const [bidLeadTime, setBidLeadTime] = useState("");
  const [bidNotes, setBidNotes] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - in production would call Supabase auth
    if (email && password) {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Please enter both email and password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRFQ || !bidPrice || !bidLeadTime) return;

    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      rfqId: selectedRFQ.id,
      rfqTitle: selectedRFQ.title,
      supplierId: supplier.id,
      unitPrice: parseFloat(bidPrice),
      totalPrice: parseFloat(bidPrice) * selectedRFQ.quantity,
      leadTimeDays: parseInt(bidLeadTime),
      notes: bidNotes,
      submittedAt: new Date().toISOString().split("T")[0],
      status: "pending",
    };

    setBids([...bids, newBid]);
    setBidDialogOpen(false);
    resetBidForm();
  };

  const resetBidForm = () => {
    setBidPrice("");
    setBidLeadTime("");
    setBidNotes("");
    setSelectedRFQ(null);
  };

  const openBidDialog = (rfq: RFQ) => {
    setSelectedRFQ(rfq);
    setBidDialogOpen(true);
  };

  const openViewDialog = (rfq: RFQ) => {
    setSelectedRFQ(rfq);
    setViewDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getBidStatusBadge = (status: Bid["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500/50 text-yellow-500">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "under_review":
        return (
          <Badge variant="outline" className="border-primary/50 text-primary">
            <Eye className="w-3 h-3 mr-1" />
            Under Review
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="outline" className="border-green-500/50 text-green-500">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="border-red-500/50 text-red-500">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
    }
  };

  const getContractStatusBadge = (status: Contract["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="border-primary/50 text-primary">
            Active
          </Badge>
        );
      case "in_production":
        return (
          <Badge variant="outline" className="border-yellow-500/50 text-yellow-500">
            In Production
          </Badge>
        );
      case "shipped":
        return (
          <Badge variant="outline" className="border-accent/50 text-accent">
            Shipped
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="border-green-500/50 text-green-500">
            Completed
          </Badge>
        );
    }
  };

  const getRFQStatusBadge = (status: RFQ["status"]) => {
    switch (status) {
      case "open":
        return (
          <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
            Open for Bids
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            Closed
          </Badge>
        );
      case "awarded":
        return (
          <Badge className="bg-primary/20 text-primary border-primary/30">
            Awarded
          </Badge>
        );
    }
  };

  const openRFQs = rfqs.filter((rfq) => rfq.status === "open");
  const hasAlreadyBid = (rfqId: string) => bids.some((bid) => bid.rfqId === rfqId);

  // ==================== Login View ====================

  if (!isLoggedIn) {
    return (
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden min-h-[80vh]">
        <div className="absolute inset-0 ranch-pattern opacity-30" />

        <div className="max-w-md mx-auto relative z-10">
          <Card className="border-border bg-card/80 backdrop-blur">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Supplier Portal</CardTitle>
              <CardDescription>
                Sign in to view RFQs, submit bids, and manage your contracts with FluxCo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="supplier@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-border"
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
                    className="bg-background border-border"
                  />
                </div>
                {loginError && (
                  <p className="text-sm text-red-500">{loginError}</p>
                )}
                <Button type="submit" className="w-full" variant="hero">
                  Sign In
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 text-center">
              <p className="text-sm text-muted-foreground">
                Not a registered supplier?{" "}
                <a href="#contact" className="text-primary hover:underline">
                  Contact us
                </a>{" "}
                to join our network.
              </p>
            </CardFooter>
          </Card>
        </div>
      </section>
    );
  }

  // ==================== Dashboard View ====================

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="absolute inset-0 ranch-pattern opacity-30" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <Badge variant="outline" className="mb-2 border-primary/50 text-primary">
              <Building2 className="w-3 h-3 mr-1" />
              Supplier Portal
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Welcome, {supplier.companyName}
            </h1>
            <p className="text-muted-foreground mt-1">{supplier.location}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 border-border">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">{openRFQs.length}</div>
              <div className="text-sm text-muted-foreground">Open RFQs</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-accent">{bids.length}</div>
              <div className="text-sm text-muted-foreground">Active Bids</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-500">{contracts.length}</div>
              <div className="text-sm text-muted-foreground">Won Contracts</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-foreground">
                {formatCurrency(contracts.reduce((sum, c) => sum + c.totalPrice, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="rfqs" className="space-y-6">
          <TabsList className="bg-muted/50 border border-border">
            <TabsTrigger value="rfqs" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="w-4 h-4" />
              Available RFQs
            </TabsTrigger>
            <TabsTrigger value="bids" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <DollarSign className="w-4 h-4" />
              My Bids
            </TabsTrigger>
            <TabsTrigger value="contracts" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Trophy className="w-4 h-4" />
              Won Contracts
            </TabsTrigger>
          </TabsList>

          {/* ==================== RFQs Tab ==================== */}
          <TabsContent value="rfqs">
            <div className="grid gap-6 md:grid-cols-2">
              {rfqs.map((rfq) => (
                <Card key={rfq.id} className="bg-card/80 border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <CardTitle className="text-lg">{rfq.title}</CardTitle>
                        <CardDescription className="mt-1">{rfq.id}</CardDescription>
                      </div>
                      {getRFQStatusBadge(rfq.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{rfq.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Capacity:</span>
                        <span className="font-medium text-foreground">
                          {rfq.capacityKVA >= 1000
                            ? `${(rfq.capacityKVA / 1000).toFixed(1)} MVA`
                            : `${rfq.capacityKVA} kVA`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Phase:</span>
                        <span className="font-medium text-foreground capitalize">
                          {rfq.phase === "three" ? "3-Phase" : "Single"}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Voltage:</span>
                        <span className="ml-2 font-medium text-foreground">
                          {rfq.primaryVoltage} / {rfq.secondaryVoltage}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="ml-2 font-medium text-foreground">{rfq.quantity} units</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cooling:</span>
                        <span className="ml-2 font-medium text-foreground">{rfq.cooling}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Bid Deadline:</span>
                        <span className="font-medium text-foreground">{formatDate(rfq.bidDeadline)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Delivery Needed:</span>
                        <span className="font-medium text-foreground">{formatDate(rfq.deliveryDeadline)}</span>
                      </div>
                    </div>

                    {rfq.specialRequirements && (
                      <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-yellow-200">{rfq.specialRequirements}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => openViewDialog(rfq)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {rfq.status === "open" && !hasAlreadyBid(rfq.id) && (
                      <Button
                        variant="hero"
                        className="flex-1"
                        onClick={() => openBidDialog(rfq)}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Submit Bid
                      </Button>
                    )}
                    {hasAlreadyBid(rfq.id) && (
                      <Badge variant="outline" className="border-primary/50 text-primary">
                        Bid Submitted
                      </Badge>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ==================== Bids Tab ==================== */}
          <TabsContent value="bids">
            <Card className="bg-card/80 border-border">
              <CardHeader>
                <CardTitle>My Bids</CardTitle>
                <CardDescription>
                  Track the status of your submitted bids
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bids.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>You have not submitted any bids yet.</p>
                    <p className="text-sm mt-2">
                      Browse available RFQs and submit your first bid.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">RFQ</TableHead>
                        <TableHead className="text-muted-foreground">Unit Price</TableHead>
                        <TableHead className="text-muted-foreground">Total Price</TableHead>
                        <TableHead className="text-muted-foreground">Lead Time</TableHead>
                        <TableHead className="text-muted-foreground">Submitted</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bids.map((bid) => (
                        <TableRow key={bid.id} className="border-border hover:bg-secondary/50">
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{bid.rfqTitle}</p>
                              <p className="text-sm text-muted-foreground">{bid.rfqId}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-foreground">
                            {formatCurrency(bid.unitPrice)}
                          </TableCell>
                          <TableCell className="font-medium text-primary">
                            {formatCurrency(bid.totalPrice)}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {bid.leadTimeDays} days
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(bid.submittedAt)}
                          </TableCell>
                          <TableCell>{getBidStatusBadge(bid.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== Contracts Tab ==================== */}
          <TabsContent value="contracts">
            <Card className="bg-card/80 border-border">
              <CardHeader>
                <CardTitle>Won Contracts</CardTitle>
                <CardDescription>
                  View and track your awarded contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contracts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No contracts awarded yet.</p>
                    <p className="text-sm mt-2">
                      Submit competitive bids to win contracts.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Contract</TableHead>
                        <TableHead className="text-muted-foreground">Quantity</TableHead>
                        <TableHead className="text-muted-foreground">Unit Price</TableHead>
                        <TableHead className="text-muted-foreground">Total Value</TableHead>
                        <TableHead className="text-muted-foreground">Delivery Date</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contracts.map((contract) => (
                        <TableRow key={contract.id} className="border-border hover:bg-secondary/50">
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{contract.rfqTitle}</p>
                              <p className="text-sm text-muted-foreground">{contract.id}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground">
                            {contract.quantity} units
                          </TableCell>
                          <TableCell className="font-medium text-foreground">
                            {formatCurrency(contract.unitPrice)}
                          </TableCell>
                          <TableCell className="font-medium text-green-500">
                            {formatCurrency(contract.totalPrice)}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {formatDate(contract.deliveryDate)}
                          </TableCell>
                          <TableCell>{getContractStatusBadge(contract.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ==================== Bid Submission Dialog ==================== */}
        <Dialog open={bidDialogOpen} onOpenChange={setBidDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-card border-border">
            <DialogHeader>
              <DialogTitle>Submit Bid</DialogTitle>
              <DialogDescription>
                {selectedRFQ && (
                  <>
                    Bidding on: <span className="text-foreground">{selectedRFQ.title}</span>
                    <br />
                    Quantity: {selectedRFQ.quantity} units
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitBid} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price (USD)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  placeholder="e.g., 15000"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  className="bg-background border-border"
                  required
                />
                {bidPrice && selectedRFQ && (
                  <p className="text-sm text-muted-foreground">
                    Total bid value:{" "}
                    <span className="text-primary font-medium">
                      {formatCurrency(parseFloat(bidPrice) * selectedRFQ.quantity)}
                    </span>
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="leadTime">Lead Time (days)</Label>
                <Input
                  id="leadTime"
                  type="number"
                  placeholder="e.g., 90"
                  value={bidLeadTime}
                  onChange={(e) => setBidLeadTime(e.target.value)}
                  className="bg-background border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Include warranty terms, payment terms, or other details..."
                  value={bidNotes}
                  onChange={(e) => setBidNotes(e.target.value)}
                  className="bg-background border-border min-h-[100px]"
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setBidDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="hero">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Bid
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ==================== View RFQ Details Dialog ==================== */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px] bg-card border-border">
            <DialogHeader>
              <DialogTitle>{selectedRFQ?.title}</DialogTitle>
              <DialogDescription>{selectedRFQ?.id}</DialogDescription>
            </DialogHeader>
            {selectedRFQ && (
              <div className="space-y-6">
                <p className="text-muted-foreground">{selectedRFQ.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-medium text-foreground">
                      {selectedRFQ.capacityKVA >= 1000
                        ? `${(selectedRFQ.capacityKVA / 1000).toFixed(1)} MVA`
                        : `${selectedRFQ.capacityKVA} kVA`}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phase</p>
                    <p className="font-medium text-foreground capitalize">
                      {selectedRFQ.phase === "three" ? "Three-Phase" : "Single-Phase"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Primary Voltage</p>
                    <p className="font-medium text-foreground">{selectedRFQ.primaryVoltage}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Secondary Voltage</p>
                    <p className="font-medium text-foreground">{selectedRFQ.secondaryVoltage}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Cooling Type</p>
                    <p className="font-medium text-foreground">{selectedRFQ.cooling}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Application</p>
                    <p className="font-medium text-foreground">{selectedRFQ.application}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium text-foreground">{selectedRFQ.quantity} units</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getRFQStatusBadge(selectedRFQ.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Bid Deadline</p>
                    <p className="font-medium text-foreground">{formatDate(selectedRFQ.bidDeadline)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Delivery Deadline</p>
                    <p className="font-medium text-foreground">{formatDate(selectedRFQ.deliveryDeadline)}</p>
                  </div>
                </div>

                {selectedRFQ.specialRequirements && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                    <p className="text-sm font-medium text-yellow-500 mb-1">Special Requirements</p>
                    <p className="text-sm text-yellow-200">{selectedRFQ.specialRequirements}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
              {selectedRFQ?.status === "open" && !hasAlreadyBid(selectedRFQ.id) && (
                <Button
                  variant="hero"
                  onClick={() => {
                    setViewDialogOpen(false);
                    openBidDialog(selectedRFQ);
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Bid
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default SupplierPortal;
