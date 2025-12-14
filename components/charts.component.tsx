import { useRef, useEffect, useState, useCallback } from "react";
import { Meteorite } from "@/lib/interfaces/meteorite-interface";
import ChartFallsByCountry from "@/components/all-charts/chart-falls-by-country.component";
import ChartFallsByHemisphere from "./all-charts/chart-falls-by-hemisphere.component";
import ChartFallsByYear from "@/components/all-charts/chart-falls-by-year.component";
import ChartFallsByYearAfter1974 from "@/components/all-charts/chart-falls-by-year-after-1974.component";
import ChartCountFallByMonth from "./all-charts/chart-count-fall-by-month.component";
import ChartCountFindByMonth from "./all-charts/chart-count-find-by-month.component";
import ChartTotalByType from "@/components/all-charts/chart-total-mass-by-type.component";
import ChartTotalMassByType from "@/components/all-charts/chart-total-by-type.component";
import ChartTotalMassByYear from "@/components/all-charts/chart-total-mass-by-year.component";

export default function ChartsComponent({ meteorites }: { meteorites: Meteorite[] }) {
	const chartRefs = useRef<HTMLDivElement[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [showScrollToTop, setShowScrollToTop] = useState(false);

	const handleWheel = useCallback((event: WheelEvent) => {
		const nextIndex = event.deltaY > 0 ? currentIndex + 1 : currentIndex - 1;

		if (nextIndex >= 0 && nextIndex < chartRefs.current.length) {
			requestAnimationFrame(() => {
				setCurrentIndex(nextIndex);
				chartRefs.current[nextIndex]?.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
			});
		}
	}, [currentIndex]);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 200) {
				setShowScrollToTop(true);
			} else {
				setShowScrollToTop(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const scrollToTop = () => {
		setCurrentIndex(0);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	useEffect(() => {
		window.addEventListener("wheel", handleWheel, { passive: false });
		return () => {
			window.removeEventListener("wheel", handleWheel);
		};
	}, [handleWheel]);

	return (
		<div id="charts">
			{[
				ChartFallsByYear,
				ChartFallsByYearAfter1974,
				ChartTotalMassByYear,
				ChartCountFindByMonth,
				ChartCountFallByMonth,
				ChartFallsByCountry,
				ChartTotalMassByType,
				ChartTotalByType,
				ChartFallsByHemisphere,
			].map((ChartComponent, index) => (
				<div key={ index }
						ref={(el) => {
							if (el) chartRefs.current[index] = el;
						}}
						className="chart-container" >
					<ChartComponent meteorites={ meteorites } />
				</div>
			))}

			{showScrollToTop && (
				<button
					id="scroll-button"
					onClick={ scrollToTop } >
					↑
				</button>
			)}
		</div>
	);
}
