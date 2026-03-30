"use client";

import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { BrandButton, CustomCard } from "@/components/layout";

const brandSansStyle = { fontFamily: "var(--font-brand-sans)" } as const;
const brandDisplayStyle = { fontFamily: "var(--font-brand-display)" } as const;

const featureCards = [
  {
    title: "Build without fear",
    description:
      "From idea to demo, get the clarity and support you need to participate with confidence — even if you're joining your first hackathon.",
  },
  {
    title: "Seamless participation",
    description:
      "Register, manage your team, and submit your demo in one place—no messy spreadsheets or scattered updates.",
  },
  {
    title: "Prizes worth hustling for",
    description:
      "Cash rewards, internship offers, and swag for top teams across every hackathon hosted on Hackathon Wallah.",
  },
] as const;

// ─── Dot grid ─────────────────────────────────────────────────────────────────
function buildGridDots(
  cols: number,
  rows: number,
  sx: number,
  sy: number,
  ox: number,
  oy: number,
) {
  const dots: { cx: number; cy: number; idx: number }[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      dots.push({ cx: ox + c * sx, cy: oy + r * sy, idx: r * cols + c });
  return dots;
}
const allDots = buildGridDots(30, 16, 48, 48, 16, 16);

// ─── Hex grid ─────────────────────────────────────────────────────────────────
function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}
// Left cluster
const hexCellsLeft = [
  { cx: 80, cy: 200, r: 40 },
  { cx: 150, cy: 165, r: 40 },
  { cx: 150, cy: 235, r: 40 },
  { cx: 220, cy: 200, r: 40 },
  { cx: 80, cy: 280, r: 40 },
  { cx: 150, cy: 315, r: 40 },
] as const;
// Right cluster
const hexCellsRight = [
  { cx: 1280, cy: 480, r: 38 },
  { cx: 1348, cy: 445, r: 38 },
  { cx: 1348, cy: 515, r: 38 },
  { cx: 1416, cy: 480, r: 38 },
  { cx: 1280, cy: 558, r: 38 },
  { cx: 1348, cy: 593, r: 38 },
] as const;

// ─── Network graph — upper-right quadrant ────────────────────────────────────
const networkNodes = [
  { id: 0, cx: 1050, cy: 100 },
  { id: 1, cx: 1150, cy: 155 },
  { id: 2, cx: 990, cy: 190 },
  { id: 3, cx: 1230, cy: 115 },
  { id: 4, cx: 1080, cy: 270 },
  { id: 5, cx: 1290, cy: 200 },
  { id: 6, cx: 940, cy: 290 },
  { id: 7, cx: 1180, cy: 300 },
] as const;
const networkEdges: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 5],
  [1, 3],
  [2, 4],
  [2, 6],
  [4, 7],
  [5, 7],
  [3, 5],
  [6, 7],
];

// ─── Circuit traces — bottom corners ─────────────────────────────────────────
const circuitTraces = [
  "M40 650 L40 705 L130 705 L130 685 L210 685",
  "M65 705 L65 735 L155 735 L155 720 L240 720",
  "M130 685 L130 668 L185 668",
  "M1400 650 L1400 705 L1310 705 L1310 685 L1230 685",
  "M1375 705 L1375 735 L1285 735 L1285 720 L1200 720",
  "M1310 685 L1310 668 L1255 668",
] as const;
const circuitDots = [
  { cx: 210, cy: 685 },
  { cx: 185, cy: 668 },
  { cx: 240, cy: 720 },
  { cx: 1230, cy: 685 },
  { cx: 1255, cy: 668 },
  { cx: 1200, cy: 720 },
] as const;

// ─── Floating code symbols ────────────────────────────────────────────────────
const codeSymbols = [
  { symbol: "</>", x: 60, y: 420, size: 15, delay: 0 },
  { symbol: "{ }", x: 1340, y: 160, size: 16, delay: 0.7 },
  { symbol: "=>", x: 115, y: 555, size: 14, delay: 1.4 },
  { symbol: "[ ]", x: 1285, y: 350, size: 14, delay: 2.1 },
  { symbol: "fn()", x: 55, y: 330, size: 13, delay: 0.4 },
  { symbol: "git", x: 1355, y: 575, size: 13, delay: 1.8 },
  { symbol: "&&", x: 170, y: 635, size: 12, delay: 2.8 },
  { symbol: "//", x: 1215, y: 635, size: 12, delay: 1.1 },
] as const;

// ─── Ping rings ───────────────────────────────────────────────────────────────
const pingRings = [
  { cx: 150, cy: 165, delay: 0 },
  { cx: 1150, cy: 155, delay: 1.5 },
  { cx: 1348, cy: 445, delay: 3.0 },
  { cx: 130, cy: 705, delay: 2.2 },
] as const;

// ─── Binary columns ───────────────────────────────────────────────────────────
const binaryColumns = [
  { x: 20, digits: "10110010", delay: 0 },
  { x: 40, digits: "01001101", delay: 0.6 },
  { x: 1390, digits: "11010110", delay: 1.1 },
  { x: 1410, digits: "00101011", delay: 1.7 },
] as const;

export function HeroSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const layerFarY = useTransform(scrollYProgress, [0, 1], [18, -36]);
  const layerMidY = useTransform(scrollYProgress, [0, 1], [10, -20]);
  const layerNearY = useTransform(scrollYProgress, [0, 1], [5, -10]);

  return (
    <motion.section
      ref={sectionRef}
      initial="rest"
      animate="animate"
      className="relative isolate overflow-hidden bg-background"
      style={brandSansStyle}
    >
      {/* ── Ambient glow ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_50%,rgba(59,130,246,0.09),transparent_50%),radial-gradient(ellipse_at_85%_50%,rgba(125,211,252,0.07),transparent_50%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.10),rgba(167,139,250,0.05)_50%,transparent_72%)] blur-3xl"
      />

      {/* ══ BACKGROUND SVG ══ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <svg
          viewBox="0 0 1440 760"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.65" />
            </linearGradient>
            <linearGradient id="circ-l" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.05" />
              <stop offset="55%" stopColor="#38BDF8" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.55" />
            </linearGradient>
            <linearGradient id="circ-r" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.05" />
              <stop offset="55%" stopColor="#38BDF8" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.55" />
            </linearGradient>
            <filter id="glow-sm">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-md">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── Full dot grid — fades toward center ── */}
          <motion.g style={prefersReducedMotion ? undefined : { y: layerFarY }}>
            {allDots.map((d) => {
              const ex = Math.abs(d.cx - 720) / 720;
              const ey = Math.abs(d.cy - 380) / 380;
              const edge = Math.max(ex, ey);
              const base = edge > 0.55 ? 0.32 : edge > 0.38 ? 0.16 : 0.06;
              return (
                <motion.circle
                  key={`d-${d.idx}`}
                  cx={d.cx}
                  cy={d.cy}
                  r={1.5}
                  fill="#60A5FA"
                  animate={{
                    opacity: [base * 0.7, base * 1.9, base],
                    transition: {
                      duration: 3 + (d.idx % 7) * 0.5,
                      delay: (d.idx % 13) * 0.11,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "mirror",
                    },
                  }}
                />
              );
            })}
          </motion.g>

          {/* ── Hex clusters ── */}
          <motion.g style={prefersReducedMotion ? undefined : { y: layerFarY }}>
            {[...hexCellsLeft, ...hexCellsRight].map((h, i) => (
              <motion.polygon
                key={`hx-${i}`}
                points={hexPoints(h.cx, h.cy, h.r)}
                fill="rgba(96,165,250,0.05)"
                stroke="#60A5FA"
                strokeWidth="1.1"
                animate={{
                  opacity: [0.38, 0.7, 0.42],
                  transition: {
                    duration: 4 + i * 0.55,
                    delay: i * 0.22,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                }}
              />
            ))}
          </motion.g>

          {/* ── Network graph ── */}
          <motion.g style={prefersReducedMotion ? undefined : { y: layerMidY }}>
            {networkEdges.map(([a, b], i) => {
              const na = networkNodes[a],
                nb = networkNodes[b];
              return (
                <motion.line
                  key={`e-${i}`}
                  x1={na.cx}
                  y1={na.cy}
                  x2={nb.cx}
                  y2={nb.cy}
                  stroke="url(#edge-grad)"
                  strokeWidth="1.2"
                  animate={{
                    opacity: [0.28, 0.58, 0.32],
                    transition: {
                      duration: 5 + i * 0.45,
                      delay: i * 0.28,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "mirror",
                    },
                  }}
                />
              );
            })}
            {networkNodes.map((n, i) => (
              <g key={`nd-${n.id}`} filter="url(#glow-md)">
                <motion.circle
                  cx={n.cx}
                  cy={n.cy}
                  r={10}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="1"
                  animate={{
                    opacity: [0.28, 0.62, 0.32],
                    scale: [1, 1.15, 1],
                    transition: {
                      duration: 3.5 + i * 0.4,
                      delay: i * 0.2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "mirror",
                    },
                  }}
                />
                <motion.circle
                  cx={n.cx}
                  cy={n.cy}
                  r={3.5}
                  fill="#7DD3FC"
                  animate={{
                    opacity: [0.55, 0.95, 0.6],
                    transition: {
                      duration: 3.5 + i * 0.4,
                      delay: i * 0.2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "mirror",
                    },
                  }}
                />
              </g>
            ))}
          </motion.g>

          {/* ── Terminal window — left side ── */}
          <motion.g
            style={prefersReducedMotion ? undefined : { y: layerNearY }}
            animate={{
              opacity: [0.6, 0.88, 0.65],
              transition: {
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              },
            }}
          >
            <rect
              x="44"
              y="355"
              width="198"
              height="148"
              rx="8"
              fill="rgba(15,23,42,0.48)"
              stroke="#334155"
              strokeWidth="1.3"
            />
            <rect
              x="44"
              y="355"
              width="198"
              height="24"
              rx="8"
              fill="rgba(30,41,59,0.65)"
            />
            <rect
              x="44"
              y="371"
              width="198"
              height="8"
              fill="rgba(30,41,59,0.65)"
            />
            {/* Traffic lights */}
            <circle
              cx="58"
              cy="367"
              r="4.5"
              fill="#F87171"
              fillOpacity="0.85"
            />
            <circle
              cx="72"
              cy="367"
              r="4.5"
              fill="#FBBF24"
              fillOpacity="0.85"
            />
            <circle
              cx="86"
              cy="367"
              r="4.5"
              fill="#34D399"
              fillOpacity="0.85"
            />
            {/* Code lines */}
            {[
              { y: 395, color: "#60A5FA", text: "$ hackathon init" },
              { y: 410, color: "#34D399", text: "  ✓ project ready" },
              { y: 425, color: "#F1F5F9", text: "$ git commit -m" },
              { y: 440, color: "#A78BFA", text: '  "feat: add auth"' },
              { y: 455, color: "#38BDF8", text: "$ npm run build" },
              { y: 470, color: "#FBBF24", text: "  ● compiling..." },
            ].map((line, i) => (
              <motion.text
                key={`tl-${i}`}
                x="60"
                y={line.y}
                fill={line.color}
                fontSize="9.5"
                fontFamily="monospace"
                animate={{
                  opacity: [0.65, 1, 0.7],
                  transition: {
                    duration: 2.2 + i * 0.35,
                    delay: i * 0.22,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                }}
              >
                {line.text}
              </motion.text>
            ))}
            <motion.rect
              x="60"
              y="478"
              width="7"
              height="10"
              rx="1"
              fill="#60A5FA"
              animate={{
                opacity: [1, 0, 1],
                transition: {
                  duration: 0.85,
                  ease: "easeInOut",
                  repeat: Infinity,
                },
              }}
            />
          </motion.g>

          {/* ── Trophy badge — right side ── */}
          <motion.g
            style={prefersReducedMotion ? undefined : { y: layerNearY }}
            animate={
              {
                y: prefersReducedMotion ? 0 : [0, -8, 0],
                transition: {
                  duration: 4,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror",
                },
              } as any
            }
          >
            <motion.circle
              cx="1370"
              cy="200"
              r="55"
              fill="rgba(15,23,42,0.38)"
              stroke="#FBBF24"
              strokeWidth="1.5"
              strokeOpacity="0.65"
              animate={{
                opacity: [0.6, 0.85, 0.65],
                transition: {
                  duration: 5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror",
                },
              }}
            />
            <motion.g
              transform="translate(1343, 170)"
              animate={{
                opacity: [0.65, 0.95, 0.7],
                transition: {
                  duration: 4,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror",
                },
              }}
            >
              <path
                d="M12 2 H40 V26 C40 36 26 44 26 44 C26 44 12 36 12 26 Z"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 10 C5 10 5 24 12 24"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="1.4"
              />
              <path
                d="M40 10 C47 10 47 24 40 24"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="1.4"
              />
              <line
                x1="26"
                y1="44"
                x2="26"
                y2="55"
                stroke="#FBBF24"
                strokeWidth="1.8"
              />
              <line
                x1="18"
                y1="55"
                x2="34"
                y2="55"
                stroke="#FBBF24"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <text
                x="20"
                y="24"
                fill="#FBBF24"
                fontSize="13"
                fontFamily="serif"
              >
                ★
              </text>
            </motion.g>
            <motion.text
              x="1370"
              y="270"
              textAnchor="middle"
              fill="#FBBF24"
              fontSize="9"
              fontFamily="monospace"
              letterSpacing="2"
              animate={{
                opacity: [0.6, 0.9, 0.65],
                transition: {
                  duration: 3.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror",
                },
              }}
            >
              WINNER
            </motion.text>
          </motion.g>

          {/* ── Circuit traces ── */}
          <motion.g style={prefersReducedMotion ? undefined : { y: layerMidY }}>
            {circuitTraces.map((d, i) => (
              <motion.path
                key={`tr-${i}`}
                d={d}
                fill="none"
                stroke={i < 3 ? "url(#circ-l)" : "url(#circ-r)"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="7 13"
                animate={{
                  opacity: [0.45, 0.8, 0.5],
                  strokeDashoffset: [0, i < 3 ? -40 : 40],
                  transition: {
                    opacity: {
                      duration: 3.5 + i * 0.7,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: i * 0.3,
                    },
                    strokeDashoffset: {
                      duration: 3 + i * 0.4,
                      ease: "linear",
                      repeat: Infinity,
                      delay: i * 0.3,
                    },
                  },
                }}
              />
            ))}
            {circuitDots.map((dot, i) => (
              <motion.circle
                key={`cd-${i}`}
                cx={dot.cx}
                cy={dot.cy}
                r={3.5}
                fill="#38BDF8"
                filter="url(#glow-sm)"
                animate={{
                  opacity: [0.55, 1, 0.6],
                  scale: [1, 1.6, 1],
                  transition: {
                    duration: 2.2 + i * 0.35,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: i * 0.25,
                  },
                }}
              />
            ))}
          </motion.g>

          {/* ── Floating code symbols ── */}
          <motion.g style={prefersReducedMotion ? undefined : { y: layerMidY }}>
            {codeSymbols.map((s, i) => (
              <motion.text
                key={`sy-${i}`}
                x={s.x}
                y={s.y}
                fill="#60A5FA"
                fontSize={s.size}
                fontFamily="monospace"
                fontWeight="500"
                animate={{
                  opacity: [0, 0.5, 0.28, 0.55, 0],
                  y: [s.y, s.y - 20, s.y - 40],
                  transition: {
                    duration: 6 + i * 0.7,
                    delay: s.delay,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 1.0,
                  },
                }}
              >
                {s.symbol}
              </motion.text>
            ))}
          </motion.g>

          {/* ── Binary rain ── */}
          <motion.g
            style={prefersReducedMotion ? undefined : { y: layerNearY }}
          >
            {binaryColumns.map((col, ci) => (
              <g key={`bn-${ci}`}>
                {col.digits.split("").map((digit, di) => (
                  <motion.text
                    key={`b-${ci}-${di}`}
                    x={col.x}
                    y={115 + di * 22}
                    fill={digit === "1" ? "#38BDF8" : "#818CF8"}
                    fontSize="11"
                    fontFamily="monospace"
                    animate={{
                      opacity: [0, 0.6, 0.3, 0.5, 0],
                      transition: {
                        duration: 4.5 + di * 0.28,
                        delay: col.delay + di * 0.14,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 0.5,
                      },
                    }}
                  >
                    {digit}
                  </motion.text>
                ))}
              </g>
            ))}
          </motion.g>

          {/* ── Ping rings ── */}
          {pingRings.map((p, i) => (
            <motion.circle
              key={`pr-${i}`}
              cx={p.cx}
              cy={p.cy}
              r={0}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.6"
              animate={{
                r: [0, 32],
                opacity: [0.75, 0],
                transition: {
                  duration: 2.2,
                  delay: p.delay,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: 3,
                },
              }}
            />
          ))}

          {/* ── Scan line ── */}
          <motion.line
            x1="0"
            y1="0"
            x2="1440"
            y2="0"
            stroke="#38BDF8"
            strokeWidth="1"
            animate={{
              y1: [0, 760],
              y2: [0, 760],
              opacity: [0, 0.15, 0.22, 0.12, 0],
              transition: {
                duration: 9,
                ease: "linear",
                repeat: Infinity,
                repeatDelay: 5,
              },
            }}
          />
        </svg>
      </div>

      {/* ══ HERO CONTENT ══ */}
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-10 px-4 pt-24 pb-20 text-center sm:px-6">
        <div className="space-y-6">
          <motion.span
            className="inline-flex items-center rounded-full border border-border/80 bg-muted/60 px-3 py-1 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Build. Submit. Win.
          </motion.span>
          <div className="pt-0 lg:pt-5" />
          <motion.h1
            className="text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            style={brandDisplayStyle}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Built for{" "}
            <span className="inline-block rounded-[0.45em] bg-sky-100/80 px-[0.24em] py-[0.08em] text-sky-950 ring-1 ring-sky-200/80 backdrop-blur-sm">
              TIER-2 &amp; TIER-3
            </span>{" "}
            College Students in India
          </motion.h1>
          <motion.p
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Not from a famous college? Does not matter. HackathonWallah helps
            students from tier-2 and tier-3 colleges discover real hackathons,
            build strong projects, find teammates, and compete with confidence.
          </motion.p>
        </div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <BrandButton
            className="px-8 py-3 text-xs"
            onClick={() => router.push("/hackathons")}
          >
            Browse hackathons
          </BrandButton>
          <BrandButton
            className="border border-border/60 bg-muted/40 px-8 py-3 text-xs backdrop-blur-sm"
            onClick={() => router.push("/notifications")}
          >
            Stay updated
          </BrandButton>
        </motion.div>

        <motion.div
          className="mt-0 grid gap-6 text-left md:mt-3 sm:grid-cols-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {featureCards.map((card) => (
            <CustomCard
              key={card.title}
              className="h-full bg-muted/40 backdrop-blur-sm"
            >
              <p className="text-base font-semibold text-foreground">
                {card.title}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {card.description}
              </p>
            </CustomCard>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
