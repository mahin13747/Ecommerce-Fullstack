import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const PageLoadingSkeleton: React.FC = () => {
	return (
		<div className="min-h-screen">
			{/* Header skeleton */}
			<div className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<Skeleton className="h-8 w-32" />
						<div className="flex space-x-4">
							<Skeleton className="h-8 w-8 rounded-full" />
							<Skeleton className="h-8 w-24" />
						</div>
					</div>
				</div>
			</div>

			{/* Main content area */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
				<div className="rounded-xl shadow-md overflow-hidden">
					{/* Title and search */}
					<div className="p-6 border-b border-gray-200">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<Skeleton className="h-8 w-48" />
							<Skeleton className="h-10 w-full md:w-80" />
						</div>
						{/* Filters */}
						<div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full">
								{Array(8)
									.fill(0)
									.map((_, i) => (
										<Skeleton key={i} className="h-9 rounded-full" />
									))}
							</div>
							<Skeleton className="h-10 w-40" />
							<div className="flex items-center gap-2">
								<Skeleton className="h-10 w-24" />
								<span className="text-gray-500">-</span>
								<Skeleton className="h-10 w-32" />
							</div>
						</div>
					</div>

					{/* Product grid */}
					<div className="p-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{Array(8)
								.fill(0)
								.map((_, i) => (
									<div
										key={i}
										className="bg-white border border-gray-200 rounded-lg overflow-hidden"
									>
										{/* Image */}
										<Skeleton className="w-full h-48" />
										{/* Content */}
										<div className="p-4">
											<Skeleton className="h-3 w-16 mb-1" />
											<Skeleton className="h-5 w-full mb-1" />
											<Skeleton className="h-5 w-20 mb-2" />
											<Skeleton className="h-3 w-24 mb-3" />
											<Skeleton className="h-9 w-full rounded-md" />
										</div>
									</div>
								))}
						</div>

						{/* Pagination */}
						<div className="mt-8 flex items-center justify-between">
							<Skeleton className="h-10 w-24 rounded-lg" />
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-10 w-24 rounded-lg" />
						</div>
					</div>
				</div>
			</div>

			{/* Footer skeleton */}
			<div className="bg-gray-100 mt-12 py-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<Skeleton className="h-8 w-32 mb-4" />
							<Skeleton className="h-4 w-full mb-2" />
							<Skeleton className="h-4 w-3/4" />
						</div>
						{Array(3)
							.fill(0)
							.map((_, i) => (
								<div key={i}>
									<Skeleton className="h-6 w-24 mb-4" />
									<Skeleton className="h-4 w-full mb-2" />
									<Skeleton className="h-4 w-full mb-2" />
									<Skeleton className="h-4 w-2/3" />
								</div>
							))}
					</div>

					{/* Copyright section */}
					<div className="mt-8 pt-8 border-t border-gray-200">
						<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
							<Skeleton className="h-4 w-64" />
							<div className="flex gap-4">
								{Array(4)
									.fill(0)
									.map((_, i) => (
										<Skeleton key={i} className="h-8 w-8 rounded-full" />
									))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PageLoadingSkeleton;
