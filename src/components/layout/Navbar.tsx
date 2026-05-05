
"use client";

import Link from "next/link";
import { Search, PenSquare, Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
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
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  const navLinks = [
    { name: "Berita", href: "/" },
    { name: "Fitur", href: "#" },
    { name: "Arsip", href: "/profile" },
  ];

  return (
    <motion.nav 
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b"
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-headline text-xl font-bold text-primary tracking-tight">
            InfoFlow
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-9 w-9">
            <Search className="h-4 w-4" />
          </Button>
          
          <Link href="/create" className="hidden sm:inline-flex">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-9 w-9">
              <PenSquare className="h-4 w-4" />
            </Button>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground md:hidden h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader className="text-left">
                <SheetTitle className="font-headline text-xl font-bold text-primary mb-8">
                  InfoFlow
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-headline font-semibold hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-base font-medium">
                      <User className="h-4 w-4" /> Profil Saya
                    </Link>
                    <Button variant="ghost" onClick={handleSignOut} className="justify-start px-0 text-base font-medium text-destructive">
                      <LogOut className="h-4 w-4 mr-3" /> Keluar Akun
                    </Button>
                  </>
                ) : (
                  <Link href="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-10 text-sm font-bold rounded-md">
                      Masuk Sekarang
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex items-center ml-2 border-l pl-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border border-border/50">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                      <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                        {(user.displayName || user.email || "U")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 rounded-md p-1" align="end" forceMount>
                  <DropdownMenuLabel className="font-headline font-bold px-2 py-1.5 text-xs">Pusat Akun</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem className="rounded-sm cursor-pointer py-2 px-2 gap-2 text-xs">
                      <User className="h-3.5 w-3.5" /> <span>Halaman Profil</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-sm cursor-pointer py-2 px-2 gap-2 text-destructive text-xs focus:bg-destructive/5">
                    <LogOut className="h-3.5 w-3.5" /> <span>Keluar Sekarang</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button size="sm" variant="outline" className="font-bold text-[10px] px-5 h-8 rounded-md">
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
