
"use client";

import Link from "next/link";
import { Search, PenSquare, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-headline text-2xl font-bold text-primary">
            InfoFlow
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/news" className="text-sm font-medium hover:text-accent transition-colors">News</Link>
            <Link href="/features" className="text-sm font-medium hover:text-accent transition-colors">Features</Link>
            <Link href="/archive" className="text-sm font-medium hover:text-accent transition-colors">Archive</Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Search className="h-5 w-5" />
          </Button>
          <Link href="/create">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <PenSquare className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="text-muted-foreground md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden md:flex items-center ml-2 border-l pl-4">
            <Link href="/auth">
              <Button size="sm" variant="outline" className="font-medium">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
