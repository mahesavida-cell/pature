
"use client";

import Link from "next/link";
import { Search, Menu, User, LogOut, Bookmark, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const navLinks = [
    { name: "Berita utama", href: "/" },
    { name: "Topik populer", href: "#" },
    { name: "Arsip bacaan", href: "/profile" },
  ];

  return (
    <motion.nav 
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-primary/5"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-headline text-2xl font-bold text-primary tracking-tighter">
            InfoFlow
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {!isSearchOpen && navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors tracking-wide"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="mr-2 overflow-hidden"
                >
                  <Input
                    ref={searchInputRef}
                    placeholder="Cari berita..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 text-xs font-bold bg-transparent border-primary/10 rounded-md focus-visible:ring-1 focus-visible:ring-primary/20"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-primary h-10 w-10 transition-transform active:scale-90"
              onClick={toggleSearch}
            >
              {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground md:hidden h-10 w-10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white/95 backdrop-blur-2xl border-none p-8">
              <SheetHeader className="text-left mb-12">
                <SheetTitle className="font-headline text-2xl font-bold text-primary">
                  InfoFlow
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-headline font-semibold hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-8 border-t border-primary/5 flex flex-col gap-6">
                  {user ? (
                    <>
                      <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                        <User className="h-4 w-4" /> Profil saya
                      </Link>
                      <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                        <Bookmark className="h-4 w-4" /> Berita tersimpan
                      </Link>
                      <Button variant="ghost" onClick={handleSignOut} className="justify-start px-0 text-sm font-bold text-destructive hover:bg-transparent">
                        <LogOut className="h-4 w-4 mr-4" /> Keluar akun
                      </Button>
                    </>
                  ) : (
                    <Link href="/auth" onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-11 text-xs font-bold rounded-md shadow-sm">
                        Masuk sekarang
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex items-center ml-2 border-l pl-6 border-primary/5">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-primary/5 hover:border-primary/10 transition-all p-0">
                    <Avatar className="h-10 w-10 border-none">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                      <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold uppercase">
                        {(user.displayName || user.email || "U")[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-lg p-1 bg-white/95 backdrop-blur-xl border-primary/5 shadow-xl mt-2" align="end" forceMount>
                  <DropdownMenuLabel className="font-headline font-bold px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">Pusat akun</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/5" />
                  <Link href="/profile">
                    <DropdownMenuItem className="rounded-md cursor-pointer py-2.5 px-3 gap-3 text-xs font-bold">
                      <User className="h-4 w-4 text-muted-foreground" /> <span>Halaman profil</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile">
                    <DropdownMenuItem className="rounded-md cursor-pointer py-2.5 px-3 gap-3 text-xs font-bold">
                      <Bookmark className="h-4 w-4 text-muted-foreground" /> <span>Berita tersimpan</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="bg-primary/5" />
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-md cursor-pointer py-2.5 px-3 gap-3 text-destructive text-xs font-bold focus:bg-destructive/5 focus:text-destructive">
                    <LogOut className="h-4 w-4" /> <span>Keluar sekarang</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button size="sm" variant="outline" className="font-bold text-[10px] px-6 h-9 rounded-md bg-white/50 backdrop-blur-sm border-primary/10 hover:bg-white hover:text-primary transition-all shadow-sm">
                  Masuk
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
