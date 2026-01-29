import Navbar from "@/components/Navbar";
import SupplierPortal from "@/components/supplier/SupplierPortal";
import Footer from "@/components/Footer";

export default function SupplierPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <SupplierPortal />
      </div>
      <Footer />
    </main>
  );
}
