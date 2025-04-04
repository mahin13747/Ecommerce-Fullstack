import React from "react";

// Base Skeleton component
export const Skeleton: React.FC<{
	className?: string;
	style?: React.CSSProperties;
}> = ({ className = "", style }) => {
	return (
		<div
			className={`animate-pulse bg-gray-200 rounded ${className}`}
			style={style}
		/>
	);
};

// Product Grid Skeleton for product listings
export const ProductGridSkeleton: React.FC<{ count: number }> = ({ count }) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{Array(count)
				.fill(0)
				.map((_, i) => (
					<div
						key={i}
						className="bg-white border border-gray-200 rounded-lg overflow-hidden"
					>
						{/* Image placeholder */}
						<Skeleton className="w-full h-48" />
						{/* Content */}
						<div className="p-4">
							<Skeleton className="h-3 w-16 mb-1" />
							<Skeleton className="h-5 w-full mb-1" />
							<Skeleton className="h-5 w-20 mb-2" />
							<div className="flex items-center mt-2 mb-3">
								<Skeleton className="h-3 w-24" />
							</div>
							<Skeleton className="h-9 w-full rounded-md" />
						</div>
					</div>
				))}
		</div>
	);
};

// Category Filter Skeleton for the filter section
export const CategoryFilterSkeleton: React.FC<{ count: number }> = ({
	count,
}) => {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full">
			{Array(count)
				.fill(0)
				.map((_, i) => (
					<Skeleton key={i} className="h-9 rounded-full" />
				))}
		</div>
	);
};

// Product Detail Skeleton for product detail pages
export const ProductDetailSkeleton: React.FC = () => {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
			{/* Product Image */}
			<div>
				<Skeleton className="w-full h-80 lg:h-96 rounded-lg mb-4" />
				<div className="grid grid-cols-4 gap-2">
					{Array(4)
						.fill(0)
						.map((_, i) => (
							<Skeleton key={i} className="w-full h-20 rounded-lg" />
						))}
				</div>
			</div>

			{/* Product Info */}
			<div className="space-y-4">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-8 w-3/4" />
				<Skeleton className="h-6 w-32" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-3/4" />
				<div className="pt-4">
					<Skeleton className="h-10 w-full rounded-lg" />
				</div>
			</div>
		</div>
	);
};

// Single Line Text Skeleton
export const TextSkeleton: React.FC<{
	width?: string;
	height?: string;
}> = ({ width = "w-full", height = "h-4" }) => {
	return <Skeleton className={`${width} ${height}`} />;
};

// Card Skeleton for general purpose cards
export const CardSkeleton: React.FC = () => {
	return (
		<div className="border rounded-lg p-4 space-y-3">
			<Skeleton className="h-6 w-1/2" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-3/4" />
			<Skeleton className="h-10 w-full rounded-md" />
		</div>
	);
};
