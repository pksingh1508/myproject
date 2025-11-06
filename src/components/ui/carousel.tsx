"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { gsap } from "gsap"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselOptionsWithAutoplay = CarouselOptions & {
  autoplayInterval?: number
}
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptionsWithAutoplay
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  slidesContainerRef: React.RefObject<HTMLDivElement | null>
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const emblaOptions = React.useMemo(() => {
    if (!opts) return undefined
    const { autoplayInterval, ...rest } = opts as CarouselOptions & {
      autoplayInterval?: number
    }
    return rest as CarouselOptions
  }, [opts])

  const [carouselRef, api] = useEmblaCarousel(
    {
      ...(emblaOptions ?? {}),
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const slidesContainerRef = React.useRef<HTMLDivElement | null>(null)
  const autoScrollRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const autoplayInterval = React.useMemo(() => {
    if (!opts) return undefined
    const maybe = opts as CarouselOptions & { autoplayInterval?: number }
    return maybe.autoplayInterval
  }, [opts])

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())

    if (slidesContainerRef.current) {
      const selected = api.selectedScrollSnap()
      const track = slidesContainerRef.current
      const slides = Array.from(track.children) as HTMLElement[]

      slides.forEach((slide, index) => {
        const isActive = index === selected
        gsap.to(slide, {
          scale: isActive ? 1 : 0.95,
          opacity: isActive ? 1 : 0.6,
          duration: 0.4,
          ease: "power2.out"
        })
      })
    }
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const clearAutoScroll = React.useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
      autoScrollRef.current = null
    }
  }, [])

  const startAutoScroll = React.useCallback(() => {
    if (!api) return
    clearAutoScroll()
    const interval = autoplayInterval ?? 5000
    autoScrollRef.current = setInterval(() => {
      if (!api) return
      api.scrollNext()
    }, interval)
  }, [api, clearAutoScroll, autoplayInterval])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api || !slidesContainerRef.current) return

    const slides = Array.from(slidesContainerRef.current.children) as HTMLElement[]
    const selected = api.selectedScrollSnap()

    slides.forEach((slide, index) => {
      gsap.set(slide, {
        scale: index === selected ? 1 : 0.95,
        opacity: index === selected ? 1 : 0.6
      })
    })
  }, [api])

  React.useEffect(() => {
    if (!api) return
    startAutoScroll()

    const handlePointerDown = () => clearAutoScroll()
    const handleResume = () => startAutoScroll()

    api.on("pointerDown", handlePointerDown)
    api.on("pointerUp", handleResume)
    api.on("select", handleResume)
    api.on("reInit", handleResume)

    return () => {
      clearAutoScroll()
      api.off("pointerDown", handlePointerDown)
      api.off("pointerUp", handleResume)
      api.off("select", handleResume)
      api.off("reInit", handleResume)
    }
  }, [api, startAutoScroll, clearAutoScroll])

  React.useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      api?.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        slidesContainerRef: slidesContainerRef,
        opts,
        orientation:
          orientation ||
          ((emblaOptions?.axis === "y" || opts?.axis === "y")
            ? "vertical"
            : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation, slidesContainerRef } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        ref={slidesContainerRef}
        className={cn(
          "flex",
          orientation === "horizontal"
            ? "gap-4 px-4"
            : "flex-col gap-4 py-2",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        className
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}

