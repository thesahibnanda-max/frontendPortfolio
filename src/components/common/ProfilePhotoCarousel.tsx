import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

/**
 * `profilePhotoLink` can hold multiple photos. A single photo renders
 * plainly (no carousel chrome); multiple photos get a small swipeable
 * carousel — drag/swipe via Embla, dot indicators, no autoplay (browsing
 * someone's photos should be user-driven, not auto-cycling next to their bio).
 */
export function ProfilePhotoCarousel({
  photos,
  className,
}: {
  photos: string[]
  className?: string
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!api) return
    setSelected(api.selectedScrollSnap())
    api.on('select', () => setSelected(api.selectedScrollSnap()))
  }, [api])

  if (photos.length === 0) return null

  if (photos.length === 1) {
    return (
      <img
        src={photos[0]}
        alt=""
        className={cn('shrink-0 rounded-full border border-border object-cover', className)}
      />
    )
  }

  return (
    <div className={cn('group relative shrink-0', className)}>
      <Carousel setApi={setApi} className="size-full">
        <CarouselContent className="ml-0 size-full">
          {photos.map((photo) => (
            <CarouselItem key={photo} className="basis-full pl-0">
              <img src={photo} alt="" className="size-full rounded-full border border-border object-cover" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <button
        onClick={() => api?.scrollPrev()}
        aria-label="Previous photo"
        className="absolute top-1/2 left-0 -translate-x-1 -translate-y-1/2 rounded-full border border-border bg-background/90 p-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
      >
        <ChevronLeft className="size-3" />
      </button>
      <button
        onClick={() => api?.scrollNext()}
        aria-label="Next photo"
        className="absolute top-1/2 right-0 translate-x-1 -translate-y-1/2 rounded-full border border-border bg-background/90 p-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
      >
        <ChevronRight className="size-3" />
      </button>

      <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
        {photos.map((photo, i) => (
          <button
            key={photo}
            onClick={() => api?.scrollTo(i)}
            aria-label={`Show photo ${i + 1}`}
            className={cn('size-1.5 rounded-full transition-colors', i === selected ? 'bg-signal' : 'bg-border')}
          />
        ))}
      </div>
    </div>
  )
}
