import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types";
import LatestProductCard from "./LatestProductCard";

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface LatestProductsLayoutProps {
  products: Product[];
}

export default function LatestProductsLayout({ products }: LatestProductsLayoutProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  if (products.length === 0) return null;

  return (
    // FIX 1: Added overflow-hidden here to stop the page from scrolling horizontally
    <section className="relative w-full bg-[#0F1115] py-20 overflow-hidden group/section">

      {/* Ambient glow background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="container relative z-10 mx-auto px-4 md:px-12">

        {/* HEADER SECTION */}
        <div className="flex items-center justify-between mb-10 pl-2">
          <div className="flex items-center gap-4">
            {/* Small header accent strip */}
            <div className="hidden md:block w-1.5 h-10 bg-[#FF6B00] rounded-full"></div>
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                Latest Products
              </h2>
              <p className="mt-2 text-[#9CA3AF] text-base md:text-lg font-light">
                Upgrade your setup with our newest arrivals.
              </p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="hidden md:flex gap-3 relative z-30">
            <button
              onClick={() => swiperInstance?.slidePrev()}
              className="p-3 rounded-full border border-white/10 bg-[#14161B] text-white hover:bg-[#FF6B00] hover:border-[#FF6B00] transition-all duration-300 group"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => swiperInstance?.slideNext()}
              className="p-3 rounded-full border border-white/10 bg-[#14161B] text-white hover:bg-[#FF6B00] hover:border-[#FF6B00] transition-all duration-300 group"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CAROUSEL LAYOUT FLEXBOX */}
        <div className="flex items-center gap-8">

          {/* FIX 2: THE SIDEBAR IS NOW HERE (Inside the flex container) */}
          {/* It will now sit exactly to the left of the products, not the screen edge */}
          <div className="hidden md:block w-3 h-[380px] shrink-0 bg-[#FF6B00] rounded-full shadow-[0_0_25px_rgba(255,107,0,0.4)]"></div>

          {/* FIX 3: SWIPER WRAPPER */}
          {/* 'min-w-0' is CRITICAL. It stops flex children from overflowing the parent */}
          <div className="w-full min-w-0">
            <Swiper
              modules={[Autoplay, Navigation]}
              onSwiper={setSwiperInstance}
              slidesPerView={'auto'}
              spaceBetween={24}
              loop={true}
              speed={800}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              // Removed !overflow-visible to keep it contained cleanly within the container limits
              className="w-full py-4"
            >
              {products.map((product) => (
                <SwiperSlide key={product.id} style={{ width: 'auto' }}>
                  <div className="h-full">
                    <LatestProductCard product={product} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

      </div>
    </section>
  );
}