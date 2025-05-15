import React from "react";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

interface ProductGridSkeletonProps {
	count?: number;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
	count = 8,
}) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{Array(count)
				.fill(0)
				.map((_, index) => (
					<ProductCardSkeleton key={index} />
				))}
		</div>
	);
};
