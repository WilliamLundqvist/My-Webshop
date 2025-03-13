"use client";

import { useEffect, useRef, useState, CSSProperties } from "react";
import { FilterSidebar } from "@/components/shop/FilterSidebar";

export default function SidebarWrapper() {
    const wrapperRef = useRef<HTMLDivElement>(null)

    const baseStyles = {
        position: "fixed" as const,
        transform: "translateX(-100%)",
        top: "80px",
        height: "calc(100vh - 80px)",
        zIndex: 10
    }
    const [styles, setStyles] = useState<CSSProperties>({
        ...baseStyles,
    });

    useEffect(() => {
        if (!wrapperRef.current) return;

        const footer = document.querySelector("footer");
        if (!footer) return;

        const handleScroll = () => {
            if (!wrapperRef.current || !footer) return;

            const footerRect = footer.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            if (footerRect.top < viewportHeight) {
                const distanceToFooter = footerRect.top - viewportHeight;

                if (distanceToFooter < 0) {
                    setStyles(prev => ({
                        ...prev,
                        position: "absolute" as const,
                        bottom: `100px`,
                        top: "auto"


                    }));
                }
            } else {
                setStyles({
                    ...baseStyles,
                });
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        const handleResize = () => {
            handleScroll();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div ref={wrapperRef} style={styles}>
            <FilterSidebar />
        </div>
    );
} 