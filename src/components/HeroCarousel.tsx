"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import { SITE_NAME } from "@/config";

type CarouselImage = {
    url: string;
    alt: string;
    title: string;
    subtitle: string;
};

const carouselImages: CarouselImage[] = [
    {
        url: "/slides/slide-1.jpg",
        alt: "University campus main building",
        title: "Welcome to ODL ESUT Portal",
        subtitle: "Discover a world of opportunities and excellence",
    },
    {
        url: "/slides/slide-2.jpg",
        alt: "University library",
        title: "Academic Excellence",
        subtitle: "Where knowledge meets innovation",
    },
    {
        url: "/slides/slide-3.jpg",
        alt: "University students",
        title: "Student Life",
        subtitle: "Create memories that last a lifetime",
    },
];

export default function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const fullSiteName = SITE_NAME.split(" ").slice(0, -1);
    const fullSiteNameLastText = SITE_NAME.split(" ").pop();

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    // Auto-advance carousel
    useEffect(() => {
        const interval = setInterval(() => {
            goToNext();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Images */}
            {carouselImages.map((image, index) => (
                <div
                    key={index}
                    className={cn(
                        "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out",
                        index === currentIndex ? "opacity-100" : "opacity-0"
                    )}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${image.url})`,
                        }}
                    >
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center text-center">
                        <div className="max-w-3xl px-4">
                            <h1 className="text-5xl font-bold text-white mb-4">{image.title}</h1>
                            <p className="text-xl text-white mb-8">{image.subtitle}</p>
                            {/* <button className="bg-[#d25400] hover:bg-[#b34800] text-white font-bold py-3 px-8 rounded-md transition-colors">
                                Learn More
                            </button> */}
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 backdrop-blur-sm text-white"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={goToNext}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 backdrop-blur-sm text-white"
            >
                <ChevronRight size={24} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-2">
                {carouselImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                            "w-3 h-3 rounded-full transition-colors",
                            index === currentIndex ? "bg-black" : "bg-black/40"
                        )}
                    />
                ))}
            </div>
            <div className="absolute z-50 top-3/4 left-15 max-w-2xl min-h-20 rounded-lg p-10 transform -translate-y-1/2">
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-10">
                    <h2 className="text-2xl font-bold text-site-a mb-4">{`${fullSiteName.join(' ')} `} <span className="text-site-b">{fullSiteNameLastText}</span></h2>
                    <div className="h-full flex items-center justify-start gap-10">
                        <Button variant={"default"} asChild size={"lg"}>
                            <Link href="/auth/signin">
                                Login to continue
                            </Link>
                        </Button>
                        <Button variant={"default"} asChild size={"lg"} className="bg-[#d25400] hover:bg-[#b34800] text-white">
                            <Link href="/auth/signup" className="flex items-center gap-10">
                                <div className="">Create An Account</div>
                                <ChevronsRight className="h-5 w-5 ml-5 " />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}