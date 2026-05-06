
"use client";

import Link from "next/link";
import { Search, User, LogOut, TrendingUp, TrendingDown, Clock, Sun, Cloud, CloudRain, RefreshCw, Sparkles, ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter, useParams } from "next/navigation";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { client } from "@/sanity/lib/client";
import { CATEGORIES_QUERY, SEARCH_SUGGESTIONS_QUERY, TRENDING_POSTS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { TypographySmall, TypographyMuted, TypographyLabel } from "@/components/wrapped/Typography";

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

  if (!mounted) return <div className="h-10 border-b border-primary/5 bg-background" />;

  return (
    <div className="border-b border-primary/5 bg-white/40 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4 w-32 sm:w-80 shrink-0 border-r border-primary/5 mr-3 sm:mr-4">
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <Clock className="h-3 w-3 text-primary/40" />
            <TypographySmall className="font-semibold text-primary">
              {currentTime || "--:--"} <span className="text-[9px] font-normal opacity-40">WIB</span>
            </TypographySmall>
          </div>
          
          <div className="relative flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCityIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                <span className="text-primary/40">{cities[currentCityIndex].icon}</span>
                <TypographySmall className="font-semibold text-primary truncate leading-normal text-[10px] sm:text-sm">
                  {cities[currentCityIndex].name} • {cities[currentCityIndex].temp}
                </TypographySmall>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex-1 relative flex items-center overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              duration: 40,
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex items-center gap-8 sm:gap-12 whitespace-nowrap"
          >
            {[...stocks, ...stocks, ...stocks].map((stock, idx) => (
              <div key={`stock-${idx}`} className="flex items-center gap-2">
                <span className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-tighter font-headline">{stock.symbol}</span>
                <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground tracking-tight font-body">{stock.price}</span>
                <div className={cn(
                  "flex items-center gap-0.5 text-[8px] sm:text-[9px] font-bold",
                  stock.up ? "text-green-600" : "text-red-600"
                )}>
                  {stock.up ? <TrendingUp className="h-2 sm:h-2.5 w-2 sm:w-2.5" /> : <TrendingDown className="h-2 sm:h-2.5 w-2 sm:w-2.5" />}
                  {stock.change}
                </div>
              </div>
            ))}
          </motion.div>
          <div className="absolute inset-y-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-white/40 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-8 sm:w-12 bg-gradient-to-l from-white/40 to-transparent z-10" />
        </div>
      </div>
    </div>
  );
};

export const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  const params = useParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeSlug = params?.slug as string;

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
          setIsSearching(false)
        })
        .catch(() => setIsSearching(false));
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  const activeCategory = useMemo(() => 
    dynamicCategories.find(cat => cat.slug === activeSlug),
  [dynamicCategories, activeSlug]);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      setSearchQuery("");
    }
  };

  const currentNavContext = hoveredCategory || activeCategory;
  const subCategoriesToDisplay = currentNavContext?.subCategories || DEFAULT_TOPICS;
  const subLabel = currentNavContext 
    ? `Topik ${currentNavContext.title}:` 
    : "Topik populer:";

  return (
    <nav className="sticky top-0 z-50 w-full bg-background border-b border-primary/5">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-12">
          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 -ml-2 hover:bg-primary/5 rounded-full transition-all">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 border-r border-primary/5 bg-white">
              <SheetHeader className="p-6 border-b border-primary/5 text-left">
                <SheetTitle className="text-sm font-headline font-bold uppercase tracking-[0.2em] text-primary/40">Menu Navigasi</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-primary/5 bg-primary/5">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                    <Input 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={formatCasing("Cari berita...", 'sentence')}
                      className="pl-10 h-10 bg-white border-none shadow-sm rounded-lg text-sm"
                    />
                  </form>
                </div>
                <div className="flex-1 overflow-y-auto py-4 px-6">
                  <div className="space-y-6">
                    <div>
                      <TypographyLabel className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mb-4">Kategori Utama</TypographyLabel>
                      <div className="grid gap-2">
                        {dynamicCategories.map((cat) => (
                          <Link 
                            key={cat._id} 
                            href={`/category/${cat.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center justify-between py-2 text-sm font-semibold transition-colors",
                              activeSlug === cat.slug ? "text-primary" : "text-muted-foreground/60 hover:text-primary"
                            )}
                          >
                            {formatCasing(cat.title, 'sentence')}
                            <ArrowRight className="h-3.5 w-3.5 opacity-20" />
                          </Link>
                        ))}
                      </div>
                    </div>
                    
                    <DropdownMenuSeparator className="bg-primary/5" />
                    
                    <div>
                      <TypographyLabel className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mb-4">Informasi & Bantuan</TypographyLabel>
                      <div className="grid gap-4">
                        <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-muted-foreground/60 hover:text-primary">Tentang PatureNews</Link>
                        <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-muted-foreground/60 hover:text-primary">Kontak Redaksi</Link>
                        <Link href="/membership" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-muted-foreground/60 hover:text-primary">Layanan Membership</Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-primary/5 border-t border-primary/5">
                  {user ? (
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border border-white">
                        <AvatarImage src={user.photoURL || ""} />
                        <AvatarFallback className="bg-primary text-white text-xs font-bold uppercase">{(user.displayName || user.email || "U")[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-primary truncate">{user.displayName || user.email}</p>
                        <button onClick={handleSignOut} className="text-[10px] font-bold text-destructive uppercase tracking-wider">Keluar Akun</button>
                      </div>
                    </div>
                  ) : (
                    <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full h-11 font-bold text-[10px] tracking-widest uppercase shadow-none">Daftar / Masuk</Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 shrink-0">
            <Image 
              src="/pature_news.png" 
              alt="Logo PatureNews" 
              width={130} 
              height={36} 
              className="h-6 sm:h-7 w-auto object-contain"
              priority
            />
          </Link>
          
          <div className="hidden lg:flex items-center gap-8">
            {dynamicCategories?.map((cat) => {
              const isActive = activeSlug === cat.slug;
              const isHovered = hoveredCategory?._id === cat._id;
              const showUnderline = isHovered || (isActive && !hoveredCategory);

              return (
                <Link 
                  href={`/category/${cat.slug}`}
                  key={cat._id} 
                  onMouseEnter={() => setHoveredCategory(cat)}
                  className={cn(
                    "relative text-[14px] font-medium transition-all py-5 tracking-tight font-headline antialiased",
                    (isActive || isHovered) 
                      ? "text-primary" 
                      : "text-muted-foreground/60 hover:text-primary"
                  )}
                  style={{ fontSynthesis: 'none' }}
                >
                  {formatCasing(cat.title, 'sentence')}
                  {showUnderline && (
                    <motion.div
                      layoutId="activeCategoryUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-4">
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
              className="w-[calc(100vw-32px)] sm:w-[400px] p-0 border border-primary/5 bg-white/95 backdrop-blur-xl shadow-2xl rounded-xl mt-3 overflow-hidden" 
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
                    className="pl-10 h-10 bg-white border-none shadow-none text-xs font-semibold rounded-lg font-body focus-visible:ring-1 focus-visible:ring-primary/20"
                  />
                  {isSearching && <RefreshCw className="absolute right-3 h-3 w-3 animate-spin text-primary/40" />}
                </div>
              </form>
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-h-[300px] overflow-y-auto p-2"
                  >
                    <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider">Saran berita</div>
                    {suggestions.map((post) => (
                      <Link 
                        key={post._id} 
                        href={`/news/${post.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-4 p-2 rounded-lg hover:bg-primary/5 transition-colors group"
                      >
                        <div className="relative h-10 w-10 shrink-0 rounded-md overflow-hidden bg-muted">
                          <Image 
                            src={post.mainImage ? urlFor(post.mainImage).url() : `https://picsum.photos/seed/${post._id}/100/100`}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-bold text-primary truncate leading-tight group-hover:text-primary transition-colors">{post.title}</div>
                          <div className="text-[9px] font-medium text-muted-foreground/60 truncate uppercase">{post.categories?.[0] || "Berita"}</div>
                        </div>
                        <ArrowRight className="h-3 w-3 text-primary/20 group-hover:text-primary transition-all group-hover:translate-x-1" />
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </PopoverContent>
          </Popover>

          <div className="flex items-center sm:border-l sm:pl-5 border-primary/5 sm:ml-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none rounded-full transition-all group p-0.5">
                    <Avatar size="sm" className="border border-primary/5 group-hover:border-primary/20 transition-all duration-300 h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarImage src={user.photoURL || ""} />
                      <AvatarFallback className="bg-primary text-white text-[10px] font-bold tracking-tight uppercase font-headline">
                        {(user.displayName || user.email || "U")[0]}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 rounded-xl p-2 bg-white/95 backdrop-blur-xl shadow-2xl mt-3 border border-primary/5" align="end">
                  <DropdownMenuLabel className="px-4 py-3 text-[10px] text-muted-foreground/60 font-bold tracking-normal font-headline">Pusat akun</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/5 mx-2" />
                  <Link href="/profile">
                    <DropdownMenuItem className="rounded-lg cursor-pointer py-3 px-4 gap-4 text-xs font-semibold font-body hover:bg-primary/5 transition-all tracking-tight">
                      <User className="h-4 w-4 text-muted-foreground/60" /> <span>{formatCasing("Halaman profil", 'sentence')}</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="bg-primary/5 mx-2" />
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-lg cursor-pointer py-3 px-4 gap-4 text-destructive text-xs font-semibold font-body hover:bg-destructive/5 transition-all tracking-tight">
                    <LogOut className="h-4 w-4" /> <span>{formatCasing("Keluar dari akun", 'sentence')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button size="sm" variant="outline" className="group font-bold text-[9px] sm:text-[10px] px-4 sm:px-8 h-8 sm:h-10 rounded-lg bg-primary/5 border-none hover:bg-primary hover:text-white transition-all shadow-none tracking-normal font-headline flex items-center gap-2">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.15, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="text-primary group-hover:text-white"
                  >
                    <Sparkles className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                  </motion.div>
                  Subscribe
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <MarketWeatherBar />
      <div className="border-b border-primary/5 bg-white/40 backdrop-blur-md relative" onMouseLeave={() => setHoveredCategory(null)}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center overflow-x-auto no-scrollbar scroll-smooth">
          {mounted && (
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentNavContext ? currentNavContext._id : "default"} 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 5 }} 
                transition={{ duration: 0.3 }} 
                className="flex items-center gap-6 sm:gap-10 whitespace-nowrap pr-10"
              >
                <span className="hidden sm:inline text-[9px] font-bold text-muted-foreground mr-4 opacity-40 tracking-normal antialiased font-headline">
                  {subLabel}
                </span>
                {subCategoriesToDisplay.map((sub: string, idx: number) => (
                  <Link 
                    key={`${sub}-${idx}`} 
                    href={currentNavContext ? `/category/${currentNavContext.slug}?topic=${encodeURIComponent(sub)}` : "#"} 
                    className="text-[12px] sm:text-[13px] font-normal text-[#171717]/70 hover:text-[#171717] leading-normal transition-all flex items-center gap-2.5 group font-body py-2 tracking-normal antialiased" 
                    style={{ fontSynthesis: 'none', textRendering: 'optimizeLegibility' }}
                  >
                    <span className="whitespace-nowrap">{formatCasing(sub, 'sentence')}</span>
                    <span className="h-1 w-1 rounded-full bg-primary/10 group-hover:bg-[#171717] transition-all shrink-0" />
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </nav>
  );
};
