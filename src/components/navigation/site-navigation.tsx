"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  LayoutGroup,
  m,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUpRight, X } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { BrandButton } from "@/components/layout/brand-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { EASE_OUT } from "@/components/motion/easing";
import { cn } from "@/lib/utils";

type NavigationLink = {
  label: string;
  href: string;
  /** Only shown once the visitor is signed in. */
  requiresAuth?: boolean;
};

const navigationLinks: NavigationLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Hackathons", href: "/hackathons" },
  { label: "Notifications", href: "/notifications", requiresAuth: true },
  { label: "Career", href: "/career" },
];

function isActiveLink(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * Clerk resolves auth on the client, so signed-in-only links stay hidden
 * through SSR and hydration and appear once the session is known.
 */
function useIsSignedIn() {
  const { isLoaded, isSignedIn } = useAuth();
  return Boolean(isLoaded && isSignedIn);
}

const HIDDEN_ON = ["/sign-in", "/sign-up"];

export function SiteNavigation() {
  const pathname = usePathname();

  // Auth pages have their own focused, full-screen layout.
  if (HIDDEN_ON.some((route) => pathname?.startsWith(route))) {
    return null;
  }

  return <NavigationBar pathname={pathname} />;
}

function NavigationBar({ pathname }: { pathname: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const signedIn = useIsSignedIn();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    mass: 0.3,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    if (latest > 420 && latest > previous + 2) setHidden(true);
    else if (latest < previous - 2 || latest <= 420) setHidden(false);
  });

  useEffect(() => {
    setMounted(true);
    setScrolled(window.scrollY > 24);
  }, []);

  // Close the mobile menu after navigating.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <m.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-signal"
        style={{ scaleX: progress }}
      />
      <m.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4"
        initial={false}
        animate={{ y: hidden && !menuOpen ? "-130%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <div
          className={cn(
            "mx-auto flex h-14 items-center justify-between gap-3 rounded-full border pl-2 pr-2 transition-[max-width,background-color,border-color,box-shadow,padding] duration-500 ease-out-quint sm:pl-4 lg:pl-6",
            scrolled
              ? "max-w-5xl border-border bg-background/80 shadow-soft backdrop-blur-xl backdrop-saturate-150 lg:pl-4"
              : "max-w-[80rem] border-transparent bg-transparent",
          )}
        >
          <BrandLogo animated />

          <LayoutGroup id="site-navigation">
            <nav
              aria-label="Primary"
              className="hidden items-center gap-0.5 lg:flex"
            >
              {navigationLinks.map((link) => {
                const item = (
                  <DesktopNavLink
                    link={link}
                    active={isActiveLink(pathname, link.href)}
                  />
                );

                if (!link.requiresAuth) {
                  return <Fragment key={link.href}>{item}</Fragment>;
                }

                // Signed-in-only links grow into place so the neighbouring
                // links slide over instead of jumping.
                return (
                  <AnimatePresence key={link.href} initial={false}>
                    {signedIn ? (
                      <m.div
                        initial={{ width: 0, opacity: 0, overflow: "hidden" }}
                        animate={{
                          width: "auto",
                          opacity: 1,
                          transitionEnd: { overflow: "visible" },
                        }}
                        exit={{ width: 0, opacity: 0, overflow: "hidden" }}
                        transition={{ duration: 0.45, ease: EASE_OUT }}
                      >
                        {item}
                      </m.div>
                    ) : null}
                  </AnimatePresence>
                );
              })}
            </nav>
          </LayoutGroup>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <div className="hidden items-center gap-1.5 sm:flex">
              {mounted ? (
                <>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <BrandButton variant="ghost" size="sm">
                        Log in
                      </BrandButton>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <BrandButton size="sm" arrow>
                        Sign up
                      </BrandButton>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <BrandButton asChild variant="ghost" size="sm">
                      <Link href="/profile">Profile</Link>
                    </BrandButton>
                    <span className="grid size-9 place-items-center">
                      <UserButton
                        appearance={{
                          elements: { userButtonAvatarBox: "size-8" },
                        }}
                        afterSignOutUrl="/"
                      />
                    </span>
                  </SignedIn>
                </>
              ) : (
                <span aria-hidden className="h-9 w-[10.5rem] rounded-full skeleton" />
              )}
            </div>
            <MobileMenu
              open={menuOpen}
              onOpenChange={setMenuOpen}
              pathname={pathname}
              mounted={mounted}
              links={navigationLinks.filter((link) => !link.requiresAuth || signedIn)}
            />
          </div>
        </div>
      </m.header>
    </>
  );
}

function DesktopNavLink({
  link,
  active,
}: {
  link: NavigationLink;
  active: boolean;
}) {
  return (
    <Link
      href={link.href}
      prefetch={link.href === "/notifications" ? true : null}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative block whitespace-nowrap rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition-colors duration-300",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {active ? (
        <m.span
          layoutId="nav-active-pill"
          aria-hidden
          className="absolute inset-0 rounded-full bg-foreground/[0.07]"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      ) : null}
      <span className="relative">{link.label}</span>
    </Link>
  );
}

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string | null;
  mounted: boolean;
  links: NavigationLink[];
};

function MobileMenu({ open, onOpenChange, pathname, mounted, links }: MobileMenuProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="group/menu relative grid size-9 place-items-center rounded-full border border-border bg-background/70 backdrop-blur transition-colors hover:border-foreground/30 lg:hidden"
        >
          <span className="flex w-4 flex-col gap-[5px]">
            <span className="h-[1.5px] w-full rounded-full bg-foreground transition-transform duration-300 group-hover/menu:translate-x-0.5" />
            <span className="h-[1.5px] w-2/3 rounded-full bg-foreground transition-[width] duration-300 group-hover/menu:w-full" />
          </span>
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-ink/30 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          data-lenis-prevent
          className="fixed inset-x-3 top-3 z-[80] max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-[2rem] border border-border bg-background p-3 shadow-lift outline-none duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-4 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-6"
        >
          <DialogPrimitive.Title className="sr-only">Menu</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Navigate HackathonWallah or access your account.
          </DialogPrimitive.Description>

          <div className="flex h-12 items-center justify-between pl-3">
            <BrandLogo onNavigate={() => onOpenChange(false)} />
            <DialogPrimitive.Close
              aria-label="Close menu"
              className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:bg-foreground/5"
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          </div>

          <div className="relative mt-3 overflow-hidden rounded-[1.5rem] border border-border bg-surface px-5 py-4">
            <div aria-hidden className="absolute inset-0 bg-graph opacity-70" />
            <nav aria-label="Mobile" className="relative">
              <ul className="flex flex-col">
                {links.map((link, index) => {
                  const active = isActiveLink(pathname, link.href);
                  return (
                    <m.li
                      key={link.href}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.06 + index * 0.05, ease: EASE_OUT }}
                      className="border-b border-border last:border-b-0"
                    >
                      <Link
                        href={link.href}
                        onClick={() => onOpenChange(false)}
                        aria-current={active ? "page" : undefined}
                        className="group/item flex items-center justify-between py-3.5"
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="font-mono text-xs text-muted-foreground tabular-nums">
                            0{index + 1}
                          </span>
                          <span
                            className={cn(
                              "font-display text-[2rem] font-semibold leading-none tracking-[-0.04em] transition-colors",
                              active ? "text-foreground" : "text-foreground/55 group-hover/item:text-foreground",
                            )}
                          >
                            {link.label}
                          </span>
                        </span>
                        {active ? (
                          <span className="size-2.5 rounded-full bg-signal shadow-[0_0_0_4px_color-mix(in_oklch,var(--signal),transparent_75%)]" />
                        ) : (
                          <ArrowUpRight className="size-5 text-muted-foreground transition-transform duration-300 group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5" />
                        )}
                      </Link>
                    </m.li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE_OUT }}
            className="flex flex-col gap-3 p-3 pt-4"
          >
            {mounted ? (
              <>
                <SignedOut>
                  <div className="grid grid-cols-2 gap-2">
                    <SignInButton mode="modal">
                      <BrandButton variant="outline" size="lg" className="w-full">
                        Log in
                      </BrandButton>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <BrandButton size="lg" className="w-full">
                        Sign up
                      </BrandButton>
                    </SignUpButton>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center justify-between gap-3 rounded-full border border-border py-1.5 pl-5 pr-1.5">
                    <Link
                      href="/profile"
                      onClick={() => onOpenChange(false)}
                      className="text-sm font-medium"
                    >
                      Your profile
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </>
            ) : null}
            <p className="text-center font-mono text-[0.7rem] text-muted-foreground">
              Build · Submit · Win
            </p>
          </m.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
