"use client";

import { Zap, Menu, X, LogIn } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const navLinks = [
    { name: "About", href: "#about", isAnchor: true },
    { name: "Products", href: "#products", isAnchor: true },
    { name: "Inventory", href: "/inventory", isAnchor: false },
    { name: "Careers", href: "/careers", isAnchor: false },
    { name: "Contact", href: "#contact", isAnchor: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:shadow-[0_0_20px_hsl(205_100%_50%/0.5)] transition-all duration-300">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl tracking-wide text-foreground">
              FLUXCO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 ml-auto">
            {navLinks.map((link) => (
              link.isAnchor ? (
                <Link
                  key={link.name}
                  href={isHomePage ? link.href : `/${link.href}`}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm uppercase tracking-wider"
                >
                  {link.name}
                </Link>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm uppercase tracking-wider"
                >
                  {link.name}
                </Link>
              )
            ))}

            {/* Login Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/employee" className="cursor-pointer">
                    Fluxer Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/supplier" className="cursor-pointer">
                    Supplier Login
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Design Tool Button */}
            <Button asChild variant="hero" size="lg">
              <Link href="/design">
                Design Tool
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-border animate-fade-up">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                link.isAnchor ? (
                  <Link
                    key={link.name}
                    href={isHomePage ? link.href : `/${link.href}`}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm uppercase tracking-wider py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm uppercase tracking-wider py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              ))}

              {/* Mobile Login Links */}
              <div className="border-t border-border pt-4 mt-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Login</p>
                <Link
                  href="/employee"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm uppercase tracking-wider py-2 block"
                  onClick={() => setIsOpen(false)}
                >
                  Fluxer Login
                </Link>
                <Link
                  href="/supplier"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm uppercase tracking-wider py-2 block"
                  onClick={() => setIsOpen(false)}
                >
                  Supplier Login
                </Link>
              </div>

              <Button asChild variant="hero" size="lg" className="mt-4">
                <Link href="/design" onClick={() => setIsOpen(false)}>
                  Design Tool
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
