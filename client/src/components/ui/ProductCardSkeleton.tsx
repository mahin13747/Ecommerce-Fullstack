import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const ProductCardSkeleton: React.FC = () => {
	return (
		<div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
			{/* Product Image Skeleton */}
			<div className="relative pb-[75%] bg-gray-100">
				<Skeleton className="absolute inset-0 w-full h-full" />
			</div>

			{/* Product Details Skeleton */}
			<div className="p-4">
				<Skeleton className="h-3 w-16 mb-1" /> {/* Category */}
				<Skeleton className="h-5 w-full mb-1" /> {/* Title */}
				<Skeleton className="h-5 w-20 mb-2" /> {/* Price */}
				<Skeleton className="h-3 w-24 mb-3" /> {/* Rating */}
				<Skeleton className="h-9 w-full rounded-md" /> {/* Button */}
			</div>
		</div>
	);
};
