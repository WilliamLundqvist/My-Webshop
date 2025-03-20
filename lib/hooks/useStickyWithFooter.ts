"use client";

import { useEffect, useRef, useState, CSSProperties } from "react";

/**
 * Custom hook to make an element sticky until it reaches the footer
 * @param navbarHeight Height of the navbar in pixels
 * @param footerSelector CSS selector for the footer element
 * @returns Object with ref to attach to the sticky element and calculated styles
 */
export function useStickyWithFooter(navbarHeight = 80, footerSelector = "footer") {
    const stickyRef = useRef<HTMLDivElement>(null);
    const [stickyStyles, setStickyStyles] = useState<CSSProperties>({
     
    });

    useEffect(() => {
        if (!stickyRef.current) return;

        const footer = document.querySelector(footerSelector);
        if (!footer) return;

        // Function to check and adjust sidebar height
        const adjustSidebarHeight = () => {
            if (!stickyRef.current || !footer) return;

            const footerRect = footer.getBoundingClientRect();
            const stickyRect = stickyRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Check if footer is in viewport
            if (footerRect.top < viewportHeight) {
                // Calculate the distance between the bottom of the sticky element and the top of the footer
                const distanceToFooter = footerRect.top - (stickyRect.top + stickyRect.height);

                if (distanceToFooter < 0) {
                    // Adjust the maxHeight to stop at the footer
                    setStickyStyles(prev => ({
                        ...prev,
                        // maxHeight: `calc(100vh - ${navbarHeight}px + ${distanceToFooter}px)`,
                        position: "absolute" as const,
                        bottom: "300px",
                        top: "0"
                    }));
                }
            } else {
                // Reset when footer is not in view
                setStickyStyles({
                    position: "sticky" as const,
                    top: `${navbarHeight}px`,
                    maxHeight: `calc(100vh - ${navbarHeight}px)`,
                    overflowY: "auto" as const,
                    zIndex: 10
                });
            }
        };

        // Set up scroll event listener
        window.addEventListener('scroll', adjustSidebarHeight, { passive: false });

        // Initial check
        adjustSidebarHeight();

        // Also use Intersection Observer as a backup
        const observer = new IntersectionObserver(
            () => {
                adjustSidebarHeight();
            },
            {
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
                rootMargin: "100px 0px 0px 0px",
            }
        );

        observer.observe(footer);

        return () => {
            window.removeEventListener('scroll', adjustSidebarHeight);
            observer.disconnect();
        };
    }, [navbarHeight, footerSelector]);

    return { stickyRef, stickyStyles };
} 