import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

interface CategoryFilterSkeletonProps {
	count?: number;
}

export const CategoryFilterSkeleton: React.FC<CategoryFilterSkeletonProps> = ({
	count = 8,
}) => {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full">
			{Array(count)
				.fill(0)
				.map((_, index) => (
					<Skeleton key={index} className="h-9 rounded-full" />
				))}
		</div>
	);
};
