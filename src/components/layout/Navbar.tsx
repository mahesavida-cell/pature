
"use client";

import Link from "next/link";
import { Search, PenSquare, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "News", href: "/news" },
    { name: "Features", href: "/features" },
    { name: "Archive", href: "/archive" },
  ];

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-headline text-2xl font-bold text-primary tracking-tight">
            InfoFlow
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Search className="h-5 w-5" />
          </Button>
          
          <Link href="/create" className="hidden sm:inline-flex">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <PenSquare className="h-5 w-5" />
            </Button>
          </Link>

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="text-left">
                <SheetTitle className="font-headline text-2xl font-bold text-primary mb-8">
                  InfoFlow
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-headline font-semibold hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <Separator className="my-2" />
                <Link href="/create" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium">
                  <PenSquare className="h-5 w-5" /> Write Story
                </Link>
                <div className="pt-8">
                  <Link href="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-12 text-base font-bold uppercase tracking-widest">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex items-center ml-2 border-l pl-4">
            <Link href="/auth">
              <Button size="sm" variant="outline" className="font-bold text-xs uppercase tracking-widest px-6 h-9">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const Separator = ({ className }: { className?: string }) => (
  <div className={`h-[1px] w-full bg-border ${className}`} />
);
