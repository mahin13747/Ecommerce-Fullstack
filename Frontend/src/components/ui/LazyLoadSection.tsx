import { useEffect, useRef, useState } from "react";

const LazyLoadSection = ({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const sectionRef = useRef<HTMLDivElement>(null);
	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		const sectionElement = sectionRef.current;

		if (!sectionElement) return;

		observerRef.current = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsVisible(true);
						if (observerRef.current) {
							observerRef.current.disconnect();
						}
					}
				});
			},
			{
				rootMargin: "100px 0px",
				threshold: 0.1,
			}
		);

		observerRef.current.observe(sectionElement);

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, []);

	return (
		<div
			ref={sectionRef}
			className={`${className} transition-opacity duration-500 ${
				isVisible ? "opacity-100" : "opacity-0"
			}`}
		>
			{isVisible ? children : <div className="h-32 bg-gray-50 rounded" />}
		</div>
	);
};

export default LazyLoadSection;
