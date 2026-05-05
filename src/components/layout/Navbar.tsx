"use client";

import Link from "next/link";
import { Search, Menu, User, LogOut, Bookmark, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { collection, query, limit, orderBy } from "firebase/firestore";
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

const DEFAULT_TOPICS = ["Berita terkini", "Pilihan redaksi", "Trending hari ini", "Analisis mendalam"];

export const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<any>(null);
  
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categoriesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "categories"), orderBy("order", "asc"));
  }, [db]);
  const { data: dynamicCategories } = useCollection(categoriesQuery);

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

  return (
    <nav 
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        isScrolled 
          ? "bg-background/90 backdrop-blur-2xl border-b border-primary/5 shadow-sm" 
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-16">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 shrink-0">
            <Image 
              src="/pature_news.png" 
              alt="Pature News Logo" 
              width={140} 
              height={40} 
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
          
          <div className="hidden lg:flex items-center gap-10">
            {dynamicCategories?.map((cat) => (
              <button 
                key={cat.id} 
                onMouseEnter={() => setHoveredCategory(cat)}
                className={cn(
                  "relative text-[11px] font-bold transition-all tracking-[0.05em] uppercase pb-2 group",
                  hoveredCategory?.id === cat.id 
                    ? "text-primary" 
                    : "text-muted-foreground/60 hover:text-primary"
                )}
              >
                {cat.name}
                {hoveredCategory?.id === cat.id && (
                  <motion.div
                    layoutId="activeCategoryUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex items-center" ref={searchContainerRef}>
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="mr-3 overflow-hidden"
                >
                  <Input
                    ref={searchInputRef}
                    placeholder="Cari berita..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 text-xs font-bold bg-primary/5 border-none rounded-lg focus-visible:ring-1 focus-visible:ring-primary/10 transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-primary hover:bg-primary/5 h-11 w-11 rounded-full transition-all"
              onClick={toggleSearch}
            >
              {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          <div className="hidden md:flex items-center border-l pl-5 border-primary/5 ml-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-11 w-11 rounded-full p-0 hover:ring-2 hover:ring-primary/5 transition-all">
                    <Avatar className="h-11 w-11 border border-primary/5">
                      <AvatarImage src={user.photoURL || ""} />
                      <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold uppercase">
                        {(user.displayName || user.email || "U")[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 rounded-xl p-2 bg-white/95 backdrop-blur-xl shadow-2xl mt-3 border-primary/5" align="end">
                  <DropdownMenuLabel className="px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold">Pusat akun</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/5 mx-2" />
                  <Link href="/profile">
                    <DropdownMenuItem className="rounded-lg cursor-pointer py-3 px-4 gap-4 text-xs font-bold hover:bg-primary/5 transition-all">
                      <User className="h-4 w-4 text-muted-foreground/60" /> <span>Halaman profil</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="bg-primary/5 mx-2" />
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-lg cursor-pointer py-3 px-4 gap-4 text-destructive text-xs font-bold hover:bg-destructive/5 transition-all">
                    <LogOut className="h-4 w-4" /> <span>Keluar sekarang</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button size="sm" variant="outline" className="font-bold text-[10px] px-8 h-10 rounded-lg bg-primary/5 border-none hover:bg-primary hover:text-white transition-all uppercase tracking-widest">
                  Masuk
                </Button>
              </Link>
            )}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground lg:hidden h-11 w-11 hover:bg-primary/5 rounded-full transition-all">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] bg-white border-none p-10">
              <SheetHeader className="text-left mb-16">
                <SheetTitle>
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <Image src="/pature_news.png" alt="Logo" width={140} height={40} className="h-9 w-auto object-contain" />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-8">
                {dynamicCategories?.map((cat) => (
                  <div key={cat.id} className="space-y-4">
                    <Link 
                      href={`/category/${cat.slug}`} 
                      onClick={() => setIsOpen(false)}
                      className="text-xl font-headline font-bold hover:text-primary transition-all block tracking-tight"
                    >
                      {cat.name}
                    </Link>
                    <div className="pl-5 flex flex-col gap-3 border-l-2 border-primary/5">
                      {cat.subCategories.map((sub: string) => (
                        <span key={sub} className="text-[11px] font-bold text-muted-foreground/60 hover:text-primary cursor-pointer transition-all tracking-wide uppercase">{sub}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div 
        className="border-t border-primary/5 overflow-hidden bg-background/50 backdrop-blur-md" 
        onMouseLeave={() => setHoveredCategory(null)}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-12 flex items-center overflow-x-auto no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div 
              key={hoveredCategory ? hoveredCategory.id : "default"}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-10 whitespace-nowrap"
            >
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.25em] mr-4 opacity-40">
                {hoveredCategory ? `Topik ${hoveredCategory.name}:` : "Topik populer:"}
              </span>
              {(hoveredCategory ? hoveredCategory.subCategories : DEFAULT_TOPICS).map((sub: string, idx: number) => (
                <Link 
                  key={idx} 
                  href="#" 
                  className="text-[10px] font-bold text-muted-foreground/70 hover:text-primary transition-all flex items-center gap-2.5 group"
                >
                  <span className="uppercase tracking-widest">{sub}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/10 group-hover:bg-primary transition-all" />
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};
