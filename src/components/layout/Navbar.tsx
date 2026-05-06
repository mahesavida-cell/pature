"use client";

import Link from "next/link";
import { Search, User, LogOut, TrendingUp, TrendingDown, Clock, Sun, Cloud, CloudRain, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatCasing } from "@/lib/casing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { client } from "@/sanity/lib/client";
import { CATEGORIES_QUERY, SEARCH_SUGGESTIONS_QUERY, TRENDING_POSTS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

const DEFAULT_TOPICS = ["Berita utama", "Politik", "Ekonomi", "Internasional", "Teknologi", "Olahraga", "Gaya hidup", "Kesehatan"];

const MarketWeatherBar = () => {
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  
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
  ];

  useEffect(() => {
    setMounted(true);
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
  }, []);

  if (!mounted) return <div className="h-10 border-b border-primary/5 bg-background/30" />;

  return (
    <div className="border-b border-primary/5 bg-background/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between overflow-hidden">
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
              <div key={`stock-${idx}`} className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">{stock.symbol}</span>
                <span className="text-[10px] font-medium text-muted-foreground tracking-tight">{stock.price}</span>
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState<any>(null);
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    Promise.all([
      client.fetch(CATEGORIES_QUERY),
      client.fetch(TRENDING_POSTS_QUERY)
    ]).then(([cats, trends]) => {
      setDynamicCategories(cats || []);
      setTrending(trends || []);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      setIsSearching(true);
      client.fetch(SEARCH_SUGGESTIONS_QUERY, { searchTerm: `*${debouncedQuery}*` })
        .then((data) => {
          setSuggestions(data || []);
          setIsSearching(false);
        })
        .catch(() => setIsSearching(false));
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full transition-all duration-300 bg-background border-b border-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 shrink-0">
            <Image 
              src="/pature_news.png" 
              alt="Logo PatureNews" 
              width={140} 
              height={40} 
              className="h-7 w-auto sm:h-8 object-contain"
              priority
            />
          </Link>
          
          <div className="hidden lg:flex items-center gap-10">
            {dynamicCategories?.map((cat) => (
              <button 
                key={cat._id} 
                onMouseEnter={() => setHoveredCategory(cat)}
                className={cn(
                  "relative text-[11px] font-bold transition-all pb-2 group tracking-widest",
                  hoveredCategory?._id === cat._id 
                    ? "text-primary" 
                    : "text-muted-foreground/60 hover:text-primary"
                )}
              >
                {formatCasing(cat.title, 'sentence')}
                {hoveredCategory?._id === cat._id && (
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
          <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-primary hover:bg-primary/5 h-10 w-10 rounded-full transition-all shadow-none"
                onClick={() => {
                  setIsSearchOpen(true);
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
              >
                <Search className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-screen sm:w-[400px] p-0 border border-primary/5 bg-white/95 backdrop-blur-xl shadow-none rounded-xl mt-3 overflow-hidden" 
              align="end"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <form onSubmit={handleSearchSubmit} className="p-4 border-b border-primary/5 bg-primary/5">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-primary/40" />
                  <Input 
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={formatCasing("Cari berita atau topik...", 'sentence')}
                    className="pl-10 h-11 bg-white border-none shadow-none text-xs font-bold rounded-lg focus-visible:ring-1 focus-visible:ring-primary/20"
                  />
                  {isSearching && <RefreshCw className="absolute right-3 h-3 w-3 animate-spin text-primary/40" />}
                </div>
              </form>
              <div className="max-h-[400px] overflow-y-auto no-scrollbar py-2">
                {!searchQuery && (
                  <div className="px-4 py-2 space-y-4">
                    <span className="text-[10px] font-bold text-muted-foreground/50 tracking-widest block px-1 uppercase">Berita trending</span>
                    <div className="grid gap-4">
                      {trending.map((post) => (
                        <Link key={post._id} href={`/news/${post.slug}`} onClick={() => setIsSearchOpen(false)} className="flex gap-4 group/item items-center">
                          <div className="h-12 w-12 relative rounded-md overflow-hidden bg-muted shrink-0">
                            <Image src={post.mainImage ? urlFor(post.mainImage).url() : `https://picsum.photos/seed/${post._id}/100/100`} alt={post.title} fill className="object-cover group-item:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[9px] font-bold text-primary/60 mb-0.5 tracking-wider uppercase">{formatCasing(post.categories?.[0] || "Berita", 'sentence')}</span>
                            <h4 className="text-[11px] font-headline font-bold leading-tight group-item:text-primary transition-colors line-clamp-1 tracking-tight">{formatCasing(post.title, 'sentence')}</h4>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {searchQuery && (
                  <div className="px-4 py-2 space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-bold text-muted-foreground/50 tracking-widest block uppercase">Hasil pencarian</span>
                      {!isSearching && suggestions.length > 0 && (
                        <Link href={`/search?q=${searchQuery}`} onClick={() => setIsSearchOpen(false)} className="text-[9px] font-bold text-primary hover:underline flex items-center gap-1 tracking-tighter uppercase">Lihat semua <ArrowRight className="h-3 w-3" /></Link>
                      )}
                    </div>
                    {isSearching ? (
                      <div className="py-10 flex flex-col items-center justify-center gap-3 opacity-30"><RefreshCw className="h-6 w-6 animate-spin" /><span className="text-[10px] font-bold tracking-widest uppercase">Mencari...</span></div>
                    ) : suggestions.length > 0 ? (
                      <div className="grid gap-4">
                        {suggestions.map((post) => (
                          <Link key={post._id} href={`/news/${post.slug}`} onClick={() => setIsSearchOpen(false)} className="flex gap-4 group/item items-center">
                            <div className="h-12 w-12 relative rounded-md overflow-hidden bg-muted shrink-0">
                              <Image src={post.mainImage ? urlFor(post.mainImage).url() : `https://picsum.photos/seed/${post._id}/100/100`} alt={post.title} fill className="object-cover group-item:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[9px] font-bold text-primary/60 mb-0.5 tracking-wider uppercase">{formatCasing(post.categories?.[0] || "Berita", 'sentence')}</span>
                              <h4 className="text-[11px] font-headline font-bold leading-tight group-item:text-primary transition-colors line-clamp-1 tracking-tight">{formatCasing(post.title, 'sentence')}</h4>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center space-y-2 opacity-30"><p className="text-[11px] font-bold tracking-tight">Tidak ditemukan hasil untuk "{searchQuery}"</p><p className="text-[9px] tracking-wide">Coba gunakan kata kunci lain.</p></div>
                    )}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex items-center sm:border-l sm:pl-5 border-primary/5 sm:ml-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none rounded-full transition-all group p-0.5">
                    <Avatar size="sm" className="border border-primary/5 group-hover:border-primary/20 transition-all duration-300">
                      <AvatarImage src={user.photoURL || ""} />
                      <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold tracking-tight uppercase">
                        {(user.displayName || user.email || "U")[0]}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 rounded-xl p-2 bg-white/95 backdrop-blur-xl shadow-none mt-3 border border-primary/5" align="end">
                  <DropdownMenuLabel className="px-4 py-3 text-[10px] text-muted-foreground/60 font-bold tracking-widest uppercase">Pusat akun</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/5 mx-2" />
                  <Link href="/profile">
                    <DropdownMenuItem className="rounded-lg cursor-pointer py-3 px-4 gap-4 text-xs font-bold hover:bg-primary/5 transition-all tracking-tight">
                      <User className="h-4 w-4 text-muted-foreground/60" /> <span>{formatCasing("Halaman profil", 'sentence')}</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="bg-primary/5 mx-2" />
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-lg cursor-pointer py-3 px-4 gap-4 text-destructive text-xs font-bold hover:bg-destructive/5 transition-all tracking-tight">
                    <LogOut className="h-4 w-4" /> <span>{formatCasing("Keluar dari akun", 'sentence')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button size="sm" variant="outline" className="font-bold text-[10px] px-8 h-10 rounded-lg bg-primary/5 border-none hover:bg-primary hover:text-white transition-all shadow-none tracking-widest uppercase">
                  Masuk
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <MarketWeatherBar />
      <div className="border-b border-primary/5 bg-background/50 backdrop-blur-md relative" onMouseLeave={() => setHoveredCategory(null)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center overflow-x-auto no-scrollbar scroll-smooth">
          {mounted ? (
            <AnimatePresence mode="wait">
              <motion.div key={hoveredCategory ? hoveredCategory._id : "default"} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.3 }} className="flex items-center gap-6 sm:gap-10 whitespace-nowrap pr-10">
                <span className="hidden sm:inline text-[9px] font-bold text-muted-foreground mr-4 opacity-40 tracking-widest uppercase">{hoveredCategory ? formatCasing(`Topik ${hoveredCategory.title}:`, 'sentence') : "Topik populer:"}</span>
                {(hoveredCategory?.subCategories || DEFAULT_TOPICS).map((sub: string, idx: number) => (
                  <Link key={`${sub}-${idx}`} href="#" className="text-[10px] sm:text-[11px] font-bold text-muted-foreground/70 hover:text-primary transition-all flex items-center gap-2.5 group font-body py-2 tracking-tighter">
                    <span className="whitespace-nowrap">{formatCasing(sub, 'sentence')}</span>
                    <span className="h-1 w-1 rounded-full bg-primary/10 group-hover:bg-primary transition-all shrink-0" />
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="h-full flex items-center gap-10 opacity-20">
              {DEFAULT_TOPICS.slice(0, 5).map((topic, i) => (
                <div key={i} className="text-[11px] font-bold">{topic}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};