"use client";

import Link from "next/link";
import { Search, Menu, User, LogOut, Bookmark, X, ChevronRight } from "lucide-react";
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

// Mock data for categories and sub-categories
// This can be replaced with dynamic data from Sanity.io or Firestore
const CATEGORIES = [
  { 
    id: "tech", 
    name: "Teknologi", 
    href: "/category/technology",
    subs: ["Kecerdasan buatan", "Gadget terbaru", "Keamanan siber", "Software"] 
  },
  { 
    id: "design", 
    name: "Desain", 
    href: "/category/design",
    subs: ["UI/UX", "Arsitektur", "Tipografi", "Desain interior"] 
  },
  { 
    id: "business", 
    name: "Bisnis", 
    href: "/category/business",
    subs: ["Ekonomi global", "Startup", "Pasar modal", "Investasi"] 
  },
  { 
    id: "culture", 
    name: "Budaya", 
    href: "/category/culture",
    subs: ["Seni visual", "Gaya hidup", "Wisata kuliner", "Sejarah"] 
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect for transparency to solid
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    ).slice(0, 5);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl border-b border-primary/5 shadow-sm" 
          : "bg-transparent border-transparent"
      )}
    >
      {/* Top Bar: Logo, Main Categories, Tools */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 shrink-0">
            <Image 
              src="/pature_news.png" 
              alt="InfoFlow Logo" 
              width={130} 
              height={36} 
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>
          
          {/* Main Categories Menu */}
          <div className="hidden lg:flex items-center gap-7">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id} 
                onMouseEnter={() => setActiveCategory(cat)}
                className={cn(
                  "text-[11px] font-bold transition-all tracking-wide pb-1 border-b-2",
                  activeCategory.id === cat.id 
                    ? "text-primary border-primary" 
                    : "text-muted-foreground border-transparent hover:text-primary"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Logic */}
          <div className="relative flex items-center" ref={searchContainerRef}>
            <AnimatePresence>
              {isSearchOpen && (
                <div className="relative">
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="mr-2 overflow-hidden"
                  >
                    <Input
                      ref={searchInputRef}
                      placeholder="Cari berita..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 text-xs font-bold bg-white/60 border-primary/10 rounded-md focus-visible:ring-1 focus-visible:ring-primary/20"
                    />
                  </motion.div>

                  <AnimatePresence>
                    {searchQuery.trim() !== "" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-12 right-0 w-80 bg-white rounded-lg border-2 border-primary/10 shadow-2xl overflow-hidden z-[60]"
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
                                  <div className="relative h-10 w-10 shrink-0 rounded-md overflow-hidden bg-muted border border-primary/5">
                                    <Image
                                      src={result.image || `https://picsum.photos/seed/${result.id}/100/100`}
                                      alt={result.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-[11px] font-bold text-primary truncate leading-snug group-hover:text-accent transition-colors">
                                      {result.title}
                                    </h4>
                                  </div>
                                </Link>
                              ))
                            ) : (
                              <div className="py-8 text-center">
                                <Search className="h-4 w-4 text-muted-foreground/20 mx-auto mb-2" />
                                <p className="text-[10px] font-bold text-muted-foreground opacity-60 px-4">
                                  Tidak ada hasil ditemukan.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </AnimatePresence>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-primary hover:bg-primary/5 h-10 w-10 rounded-full transition-all"
              onClick={toggleSearch}
            >
              {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center border-l pl-4 border-primary/5">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full p-0 border border-primary/5 hover:border-primary/10 transition-all">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || ""} />
                      <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold uppercase">
                        {(user.displayName || user.email || "U")[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-lg p-1 bg-white shadow-xl mt-2" align="end">
                  <DropdownMenuLabel className="px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Pusat akun</DropdownMenuLabel>
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
                <Button size="sm" variant="outline" className="font-bold text-[10px] px-6 h-9 rounded-md bg-white/50 border-primary/10 hover:bg-white hover:text-primary transition-all">
                  Masuk
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground lg:hidden h-10 w-10 hover:bg-primary/5 rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white border-none p-8">
              <SheetHeader className="text-left mb-12">
                <SheetTitle>
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <Image src="/pature_news.png" alt="Logo" width={120} height={35} className="h-8 w-auto object-contain" />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id} className="space-y-3">
                    <Link 
                      href={cat.href} 
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-headline font-bold hover:text-primary transition-colors block"
                    >
                      {cat.name}
                    </Link>
                    <div className="pl-4 flex flex-col gap-2">
                      {cat.subs.map(sub => (
                        <span key={sub} className="text-[11px] font-bold text-muted-foreground hover:text-primary cursor-pointer">{sub}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Sub-header: Sub-categories bar */}
      <div className="border-t border-primary/5">
        <div className="max-w-7xl mx-auto px-4 h-10 flex items-center overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-6 whitespace-nowrap">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mr-2 opacity-40">
              Topik {activeCategory.name}:
            </span>
            {activeCategory.subs.map((sub, idx) => (
              <Link 
                key={idx} 
                href="#" 
                className="text-[10px] font-bold text-muted-foreground/70 hover:text-primary transition-colors flex items-center gap-2 group"
              >
                {sub}
                <span className="h-1 w-1 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};