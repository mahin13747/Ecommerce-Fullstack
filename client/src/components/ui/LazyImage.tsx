import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

interface LazyImageProps {
	src: string;
	alt: string;
	className?: string;
	placeholderSrc?: string;
	onClick?: () => void;
	onLoad?: () => void;
	aspectRatio?: string;
	objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export const LazyImage: React.FC<LazyImageProps> = ({
	src,
	alt,
	className = "",
	placeholderSrc = "/api/placeholder/300/225",
	onClick,
	onLoad,
	aspectRatio = "4/3",
	objectFit = "contain",
}) => {
	const [isLoading, setIsLoading] = useState(true);
	const [imgSrc, setImgSrc] = useState(placeholderSrc);
	const [isInView, setIsInView] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setIsInView(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.1 }
		);

		const currentElement = document.getElementById(
			`lazy-img-${alt.replace(/\s+/g, "-").toLowerCase()}`
		);

		if (currentElement) {
			observer.observe(currentElement);
		}

		return () => {
			observer.disconnect();
		};
	}, [alt]);

	useEffect(() => {
		if (isInView) {
			const img = new Image();
			img.src = src;
			img.onload = () => {
				setImgSrc(src);
				setIsLoading(false);
				if (onLoad) {
					onLoad();
				}
			};
			img.onerror = () => {
				console.error(`Failed to load image: ${src}`);
				setIsLoading(false);
			};
		}
	}, [src, isInView, onLoad]);
	return (
		<div
			id={`lazy-img-${alt.replace(/\s+/g, "-").toLowerCase()}`}
			className={`relative ${className}`}
			style={{ aspectRatio }}
		>
			{isLoading && <Skeleton className="absolute inset-0 w-full h-full z-0" />}
			<img
				src={imgSrc}
				alt={alt}
				className={`w-full h-full transition-opacity duration-300 
				 ${
						objectFit === "contain"
							? "object-contain"
							: objectFit === "cover"
							? "object-cover"
							: objectFit === "fill"
							? "object-fill"
							: objectFit === "none"
							? "object-none"
							: "object-scale-down"
					} ${isLoading ? "opacity-0" : "opacity-200"}
				`}
				onClick={onClick}
			/>
		</div>
	);
};

// Usage example:
// <LazyImage
//   src={product.images[0]}
//   alt={product.title}
//   aspectRatio="4/3"
//   objectFit="contain"
//   onClick={() => navigate(`/products/${product.id}`)}
//   onLoad={() => console.log("Image loaded successfully")}
//   className="rounded-lg"
// />
