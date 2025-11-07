"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from "@clerk/nextjs";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Hackathons", href: "/hackathons" },
  { label: "Notification", href: "/notifications" }
];

export function SiteNavigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300 ease-out",
        isScrolled
          ? "border-border bg-background/80 shadow-sm backdrop-blur-lg"
          : "bg-background/95"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground transition-transform duration-300 ease-out hover:scale-[1.02] rounded-full border border-border/60 bg-muted/40 px-3 py-1.5"
        >
          <span>Hackathonwallah</span>
        </Link>

        <nav className="hidden gap-1 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-sm font-medium md:flex">
          {navigationLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname?.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 transition-all duration-300 ease-out hover:text-foreground",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute inset-x-3 bottom-1 h-0.5 scale-x-0 rounded-full bg-primary/80 transition-transform duration-300 ease-out",
                    isActive && "scale-x-100"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <SignedOut>
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5">
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-gray-600 hover:text-gray-50 rounded-full transition-all duration-300"
                >
                  Log in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="bg-gray-700 rounded-full">
                  Sign up
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5">
              <Button asChild variant="ghost" size="sm">
                <Link href="/profile">Profile</Link>
              </Button>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "size-9",
                    userButtonOuterIdentifier: "text-sm"
                  }
                }}
                afterSignOutUrl="/"
              />
            </div>
          </SignedIn>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <SignedIn>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/profile">Profile</Link>
              </Button>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "size-8",
                    userButtonOuterIdentifier: "text-sm"
                  }
                }}
                afterSignOutUrl="/"
              />
            </div>
          </SignedIn>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-border/60 bg-background/80 shadow-sm backdrop-blur transition-transform duration-300 ease-out active:scale-95"
              >
                <Menu className="size-5" />
                <span className="sr-only">Open navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs px-0">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="text-lg font-semibold">
                  Hackathonwallah
                </Link>
                <nav className="flex flex-col gap-2">
                  {navigationLinks.map((link) => {
                    const isActive =
                      pathname === link.href ||
                      (link.href !== "/" && pathname?.startsWith(link.href));

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "rounded-lg px-3 py-2 text-base font-medium transition-colors duration-200",
                          isActive
                            ? "bg-primary/10 text-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="flex flex-col gap-3">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full">
                        Log in
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="w-full">Sign up</Button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <p className="text-sm text-muted-foreground">
                      Use the avatar above to view your account or sign out.
                    </p>
                  </SignedIn>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
