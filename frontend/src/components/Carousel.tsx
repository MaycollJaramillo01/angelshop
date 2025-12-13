import { Children, ReactNode, useMemo, useState } from 'react';

interface CarouselProps {
  children: ReactNode;
  ariaLabel?: string;
}

export const Carousel = ({ children, ariaLabel }: CarouselProps) => {
  const slides = useMemo(() => Children.toArray(children), [children]);
  const [index, setIndex] = useState(0);

  const goTo = (next: number) => {
    const total = slides.length;
    if (total === 0) return;
    const normalized = (next + total) % total;
    setIndex(normalized);
  };

  if (!slides.length) return null;

  return (
    <div className="carousel" role="region" aria-label={ariaLabel}>
      <div className="carousel-window">
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            className={`carousel-item ${slideIndex === index ? 'active' : ''}`}
            aria-hidden={slideIndex !== index}
          >
            {slide}
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="carousel-controls" aria-label="Controles de galería">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Imagen anterior"
          >
            ←
          </button>
          <div className="carousel-dots" role="tablist">
            {slides.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                className={dotIndex === index ? 'active' : ''}
                onClick={() => goTo(dotIndex)}
                aria-label={`Ir a la imagen ${dotIndex + 1}`}
                aria-pressed={dotIndex === index}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Imagen siguiente"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export const CarouselItem = ({ children }: { children: ReactNode }) => (
  <div className="carousel-item-content">{children}</div>
);
