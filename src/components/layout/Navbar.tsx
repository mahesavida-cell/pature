
"use client";

import Link from "next/link";
import { Search, Menu, User, LogOut, Bookmark, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { collection, query, limit } from "firebase/firestore";
import Image from "next/image";
import { cn } from "@/lib/utils";
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
  const db = useFirestore();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch some posts for search preview
  const postsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "posts"), limit(20));
  }, [db]);
  const { data: posts } = useCollection(postsQuery);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !posts) return [];
    return posts.filter(post => 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5); // Show top 5 results
  }, [searchQuery, posts]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <div className="relative flex items-center" ref={searchContainerRef}>
            <AnimatePresence>
              {isSearchOpen && (
                <div className="relative">
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

                  {/* Dynamic Search Results Dropdown - Solid Background for Readability */}
                  <AnimatePresence>
                    {searchQuery.trim() !== "" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-12 right-2 w-80 bg-white rounded-lg border-2 border-primary/10 shadow-xl overflow-hidden z-[60]"
                      >
                        <div className="p-2">
                          <p className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-primary/5">
                            Hasil pencarian
                          </p>
                          <div className="mt-1">
                            {searchResults.length > 0 ? (
                              searchResults.map((result) => (
                                <Link
                                  key={result.id}
                                  href={`/news/${result.id}`}
                                  onClick={() => {
                                    setSearchQuery("");
                                    setIsSearchOpen(false);
                                  }}
                                  className="flex items-center gap-3 p-3 rounded-md hover:bg-primary/5 transition-colors group"
                                >
                                  <div className="relative h-12 w-12 shrink-0 rounded-md overflow-hidden bg-muted border border-primary/5">
                                    <Image
                                      src={result.image || `https://picsum.photos/seed/${result.id}/100/100`}
                                      alt={result.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <span className="block text-[9px] font-bold text-accent mb-0.5">
                                      {result.category}
                                    </span>
                                    <h4 className="text-xs font-bold text-primary truncate leading-snug group-hover:text-accent transition-colors">
                                      {result.title}
                                    </h4>
                                  </div>
                                </Link>
                              ))
                            ) : (
                              <div className="py-8 text-center">
                                <Search className="h-5 w-5 text-muted-foreground/20 mx-auto mb-2" />
                                <p className="text-[10px] font-bold text-muted-foreground opacity-60 px-4">
                                  Tidak ada berita yang ditemukan untuk kata kunci ini.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        {searchResults.length > 0 && (
                          <div className="bg-primary/5 p-2 text-center border-t border-primary/5">
                            <span className="text-[9px] font-bold text-muted-foreground">
                              Menampilkan {searchResults.length} hasil teratas
                            </span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </AnimatePresence>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-primary hover:bg-primary/5 h-10 w-10 rounded-full transition-all active:scale-95"
              onClick={toggleSearch}
            >
              {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground md:hidden h-10 w-10 hover:bg-primary/5 rounded-full">
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
