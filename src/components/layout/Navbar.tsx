
"use client";

import Link from "next/link";
import { Search, Menu, User, LogOut, X, TrendingUp, TrendingDown, Clock, Sun, Cloud, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
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

const MarketWeatherBar = () => {
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>("");
  
  const cities = [
    { name: "Jakarta", temp: "31°C", status: "Cerah", icon: <Sun className="h-3.5 w-3.5" /> },
    { name: "Surabaya", temp: "33°C", status: "Berawan", icon: <Cloud className="h-3.5 w-3.5" /> },
    { name: "Bandung", temp: "24°C", status: "Hujan", icon: <CloudRain className="h-3.5 w-3.5" /> },
    { name: "Medan", temp: "29°C", status: "Cerah", icon: <Sun className="h-3.5 w-3.5" /> },
  ];

  const stocks = [
    { symbol: "IHSG", price: "7,245.12", change: "+0.45%", up: true },
    { symbol: "BBCA", price: "10,125", change: "-0.25%", up: false },
    { symbol: "BBRI", price: "4,850", change: "+1.20%", up: true },
    { symbol: "TLKM", price: "3,120", change: "-0.95%", up: false },
    { symbol: "ASII", price: "5,150", change: "+0.10%", up: true },
    { symbol: "GOTO", price: "52", change: "0.00%", up: true },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
      });
      setCurrentTime(timeStr);
    };

    updateTime();
    const timeTimer = setInterval(updateTime, 1000);
    const cityTimer = setInterval(() => {
      setCurrentCityIndex((prev) => (prev + 1) % cities.length);
    }, 5000);

    return () => {
      clearInterval(timeTimer);
      clearInterval(cityTimer);
    };
  }, [cities.length]);

  return (
    <div className="border-b border-primary/5 bg-background/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-10 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-4 w-48 sm:w-80 shrink-0 border-r border-primary/5 mr-4">
          <div className="flex items-center gap-1.5 shrink-0">
            <Clock className="h-3 w-3 text-primary/40" />
            <span className="text-[10px] font-bold text-primary tracking-tight">
              {currentTime || "--:--"} <span className="text-[9px] opacity-40">WIB</span>
            </span>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCityIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <span className="text-primary/40">{cities[currentCityIndex].icon}</span>
              <span className="text-[10px] font-bold text-primary tracking-tight truncate">
                {cities[currentCityIndex].name} • {cities[currentCityIndex].temp}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex-1 relative flex items-center overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              duration: 40,
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex items-center gap-12 whitespace-nowrap"
          >
            {[...stocks, ...stocks, ...stocks].map((stock, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-primary">{stock.symbol}</span>
                <span className="text-[10px] font-medium text-muted-foreground">{stock.price}</span>
                <div className={cn(
                  "flex items-center gap-0.5 text-[9px] font-bold",
                  stock.up ? "text-green-600" : "text-red-600"
                )}>
                  {stock.up ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                  {stock.change}
                </div>
              </div>
            ))}
          </motion.div>
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />
        </div>
      </div>
    </div>
  );
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState<any>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const popularSearches = useMemo(() => {
    if (!dynamicCategories) return DEFAULT_TOPICS;
    return dynamicCategories.map(cat => cat.name).slice(0, 4);
  }, [dynamicCategories]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftGradient(scrollLeft > 10);
      setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [dynamicCategories, hoveredCategory]);

  return (
    <nav className="sticky top-0 z-50 w-full transition-all duration-300 bg-background shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between border-b border-primary/5">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 shrink-0">
            <Image 
              src="/pature_news.png" 
              alt="Pature News Logo" 
              width={140} 
              height={40} 
              className="h-7 w-auto sm:h-8 object-contain"
              priority
            />
          </Link>
          
          <div className="hidden lg:flex items-center gap-10">
            {dynamicCategories?.map((cat) => (
              <button 
                key={cat.id} 
                onMouseEnter={() => setHoveredCategory(cat)}
                className={cn(
                  "relative text-[11px] font-bold transition-all tracking-[0.05em] pb-2 group",
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

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative flex items-center" ref={searchContainerRef}>
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form
                  onSubmit={handleSearchSubmit}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: typeof window !== 'undefined' && window.innerWidth < 640 ? 180 : 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="mr-2 sm:mr-3 overflow-hidden"
                >
                  <Input
                    ref={searchInputRef}
                    placeholder="Cari..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 sm:h-10 text-xs font-bold bg-primary/5 border-none rounded-lg focus-visible:ring-1 focus-visible:ring-primary/10 transition-all"
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-primary hover:bg-primary/5 h-9 w-9 sm:h-11 sm:w-11 rounded-full transition-all"
              onClick={toggleSearch}
            >
              {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </Button>

            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-14 left-0 w-[240px] sm:w-[280px] bg-white/95 backdrop-blur-xl border border-primary/5 rounded-xl shadow-sm p-4 z-[60]"
                >
                  {searchQuery.trim() === "" ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 px-1">
                        <TrendingUp className="h-3.5 w-3.5 text-primary/40" />
                        <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wider">Pencarian populer</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSearchQuery(term)}
                            className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-primary/5 hover:bg-primary/10 text-primary/70 transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-muted-foreground/60 px-1 tracking-wider">Saran pencarian</span>
                      {searchResults.length > 0 ? (
                        <div className="space-y-1">
                          {searchResults.map((result) => (
                            <Link 
                              key={result.id}
                              href={`/news/${result.id}`}
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery("");
                              }}
                              className="flex flex-col p-2 rounded-lg hover:bg-primary/5 transition-colors group"
                            >
                              <span className="text-[11px] font-bold text-primary group-hover:text-primary transition-colors line-clamp-1">{result.title}</span>
                              <span className="text-[9px] font-medium text-muted-foreground/50">{result.category}</span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="py-4 text-center">
                          <span className="text-[10px] font-medium text-muted-foreground/40 italic">Tekan enter untuk mencari...</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center sm:border-l sm:pl-5 border-primary/5 sm:ml-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 sm:h-11 sm:w-11 rounded-full p-0 hover:ring-2 hover:ring-primary/5 transition-all">
                    <Avatar className="h-9 w-9 sm:h-11 sm:w-11 border border-primary/5">
                      <AvatarImage src={user.photoURL || ""} />
                      <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold uppercase">
                        {(user.displayName || user.email || "U")[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 rounded-xl p-2 bg-white/95 backdrop-blur-xl shadow-lg mt-3 border-primary/5" align="end">
                  <DropdownMenuLabel className="px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground/60 font-bold">Pusat akun</DropdownMenuLabel>
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
                <Button size="sm" variant="outline" className="font-bold text-[9px] sm:text-[10px] px-4 sm:px-8 h-8 sm:h-10 rounded-lg bg-primary/5 border-none hover:bg-primary hover:text-white transition-all tracking-widest">
                  Masuk
                </Button>
              </Link>
            )}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground lg:hidden h-9 w-9 hover:bg-primary/5 rounded-full transition-all">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] bg-white border-none p-6 sm:p-10 flex flex-col">
              <SheetHeader className="text-left mb-10">
                <SheetTitle>
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <Image src="/pature_news.png" alt="Logo" width={140} height={40} className="h-8 w-auto object-contain" />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto no-scrollbar py-4">
                <div className="flex flex-col gap-10">
                  {dynamicCategories?.map((cat) => (
                    <div key={cat.id} className="space-y-4">
                      <Link 
                        href={`/category/${cat.slug}`} 
                        onClick={() => setIsOpen(false)}
                        className="text-2xl font-headline font-bold hover:text-primary transition-all block tracking-tight"
                      >
                        {cat.name}
                      </Link>
                      <div className="pl-5 flex flex-col gap-4 border-l-2 border-primary/5">
                        {cat.subCategories.map((sub: string) => (
                          <span key={sub} className="text-[13px] font-bold text-muted-foreground/60 hover:text-primary cursor-pointer transition-all tracking-wide">{sub}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="pt-10 border-t border-primary/5 mt-auto">
                    <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] mb-4">Informasi</p>
                    <div className="flex flex-col gap-3">
                      <Link href="/about" className="text-xs font-bold text-muted-foreground/60">Tentang InfoFlow</Link>
                      <Link href="/contact" className="text-xs font-bold text-muted-foreground/60">Kontak Redaksi</Link>
                      <Link href="/terms" className="text-xs font-bold text-muted-foreground/60">Syarat & Ketentuan</Link>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <MarketWeatherBar />

      <div 
        className="border-b border-primary/5 bg-background/50 backdrop-blur-md relative" 
        onMouseLeave={() => setHoveredCategory(null)}
      >
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-w-7xl mx-auto px-4 md:px-6 h-12 flex items-center overflow-x-auto no-scrollbar scroll-smooth"
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={hoveredCategory ? hoveredCategory.id : "default"}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-6 sm:gap-10 whitespace-nowrap pr-10"
            >
              <span className="hidden sm:inline text-[9px] font-bold text-muted-foreground tracking-[0.25em] mr-4 opacity-40">
                {hoveredCategory ? `Topik ${hoveredCategory.name.toLowerCase()}:` : "Topik populer:"}
              </span>
              {(hoveredCategory ? hoveredCategory.subCategories : DEFAULT_TOPICS).map((sub: string, idx: number) => (
                <Link 
                  key={idx} 
                  href="#" 
                  className="text-[10px] sm:text-[11px] font-bold text-muted-foreground/70 hover:text-primary transition-all flex items-center gap-2.5 group font-body py-2"
                >
                  <span className="tracking-wide whitespace-nowrap">{sub}</span>
                  <span className="h-1 w-1 rounded-full bg-primary/10 group-hover:bg-primary transition-all shrink-0" />
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showLeftGradient && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-10 sm:hidden" 
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRightGradient && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-10 sm:hidden" 
            />
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
