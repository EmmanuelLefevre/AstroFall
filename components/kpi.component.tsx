import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { capitalizeWords } from "@/lib/utils/capitalize-words";
import { getCountryNameInFrench } from '@/lib/utils/translate-country-in-french';
import { getMonthNameInFrench } from '@/lib/utils/translate-month-in-french';
import { Meteorite } from "@/lib/interfaces/meteorite-interface";
import { useGenericColorsHook } from "@/lib/utils/use-generic-colors-hook";
import styles from "@/public/styles/modules/animations.module.scss";


export default function Kpi({ meteorites }: { meteorites: Meteorite[] }) {
	const parseWeight = (weight: string | null): number => {
		if (!weight) return 0;
		return parseFloat(weight);
	};

	const formatMass = (massInKg: number): string => {
		if (massInKg >= 1000) {
			const massInTonnes = massInKg / 1000;
			return massInTonnes.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " t";
		}
		else {
			return massInKg.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " kg";
		}
	};

	// Get generic colors
	const { bronzeColor, colorMeteoriteType, goldColor, silverColor } = useGenericColorsHook();

	/* ========= Année record en nombre ========= */
	const yearCounts: Record<string, number> = {};
	meteorites.forEach((m) => {
		if (m.Year != null) {
			const year = String(m.Year).trim();
			yearCounts[year] = (yearCounts[year] || 0) + 1;
		}
	});
	let yearMaxCount = "";
	let maxCount = 0;
	Object.entries(yearCounts).forEach(([year, count]) => {
		if (count > maxCount) {
			maxCount = count;
			yearMaxCount = year;
		}
	});


	/* ========= Année record en masse ========= */
	const yearMass: Record<string, number> = {};
	meteorites.forEach((m) => {
		if (m.Year != null) {
			const year = String(m.Year).trim();
			const weight = parseWeight(m["Recovered weight"]);
			yearMass[year] = (yearMass[year] || 0) + weight;
		}
	});
	let yearMaxMass = "";
	let maxMass = 0;
	Object.entries(yearMass).forEach(([year, mass]) => {
		if (mass > maxMass) {
			maxMass = mass;
			yearMaxMass = year;
		}
	});


	/* ========= Chutes enregistrées ========= */
	const totalMeteorites = meteorites.length;


	/* ========= La plus massive ========= */
	let biggestMeteorite: Meteorite | null = null;
	let biggestWeight = 0;
	meteorites.forEach((m) => {
		const weight = parseWeight(m["Recovered weight"]);
		if (weight > biggestWeight) {
			biggestWeight = weight;
			biggestMeteorite = m;
		}
	});
	let formattedWeight: string;
	if (biggestWeight >= 1000) {
		const weightInTonnes = biggestWeight / 1000;
		formattedWeight = weightInTonnes % 1 === 0
    ? weightInTonnes.toLocaleString("fr-FR") + " t"
    : weightInTonnes.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " t";
	}
	else {
		formattedWeight = biggestWeight.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " kg";
	}


	/* ========= Pays le plus impacté ========= */
	const countryStats: Record<string, { count: number; totalMass: number }> = {};
	meteorites.forEach((m) => {
		const country = m.Country?.trim();
		if (country) {
			if (!countryStats[country]) {
				countryStats[country] = { count: 0, totalMass: 0 };
			}
			countryStats[country].count += 1;
			countryStats[country].totalMass += parseWeight(m["Recovered weight"]);
		}
	});
	let countryMost = "";
	let countryMostCount = 0;
	let countryMostMass = 0;
	Object.entries(countryStats).forEach(([country, stats]) => {
		if (stats.count > countryMostCount) {
			countryMostCount = stats.count;
			countryMostMass = stats.totalMass;
			countryMost = country;
		}
	});


	/* ========= Type dominant + Détails par type de météorite ========= */
	const typeStats: Record<string, { count: number; totalMass: number }> = {};
	meteorites.forEach((m) => {
		const type = m.Type?.trim();
		if (type) {
			if (!typeStats[type]) {
				typeStats[type] = { count: 0, totalMass: 0 };
			}
			typeStats[type].count += 1;
			typeStats[type].totalMass += parseWeight(m["Recovered weight"]);
		}
	});
	let mostCommonType = "";
	let typeMostCount = 0;
	let typeMostMass = 0;
	Object.entries(typeStats).forEach(([type, stats]) => {
		if (stats.count > typeMostCount) {
			typeMostCount = stats.count;
			typeMostMass = stats.totalMass;
			mostCommonType = type;
		}
	});


	/* ========= Découvertes ========= */
	let findCount = 0;
	let notFindCount = 0;
	meteorites.forEach((m) => {
		if (m.ff === "Find") {
			findCount++;
		}
		else {
			notFindCount++;
		}
	});


	/* ========= Masse totale ========= */
	let totalMassAll = 0;
	meteorites.forEach((m) => {
		totalMassAll += parseWeight(m["Recovered weight"]);
	});


	/* ========= Statistiques pour la France ========= */
	const franceStats = countryStats["France"] || null;


	/* ========= Mois record de découverte ========= */
	const findMonthCounts: Record<string, number> = {};
	meteorites
		.filter((m) => m.ff === "Find")
		.forEach((m) => {
			if (m.Month) {
				const month = capitalizeWords(m.Month.trim());
				findMonthCounts[month] = (findMonthCounts[month] || 0) + 1;
			}
		});
	const topFindMonths = Object.entries(findMonthCounts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 3);


	/* ========= Mois record en nombre ========= */
	const monthCounts: Record<string, number> = {};
	meteorites.forEach((m) => {
		if (m.Month) {
			const month = capitalizeWords(m.Month.trim());
			monthCounts[month] = (monthCounts[month] || 0) + 1;
		}
	});
	const topMonths = Object.entries(monthCounts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 3)

	/* ========= Météorites par hémisphère ========= */
	let northernHemisphereCount = 0;
	let southernHemisphereCount = 0;
	meteorites.forEach((m) => {
		if (m.latitude !== undefined) {
			if (m.latitude > 0) {
				northernHemisphereCount++;
			}
			else if (m.latitude < 0) {
				southernHemisphereCount++;
			}
		}
	});

	interface KPIProps {
		yearMaxCount: string;
		maxCount: number;
		yearMaxMass: string;
		maxMass: number;
	}

	const KPI_Cards: React.FC<KPIProps> = ({ yearMaxCount, maxCount, yearMaxMass, maxMass }) => {
		const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(13).fill(false));

		useEffect(() => {
			const timers = visibleCards.map((_, index) =>
				setTimeout(() => {
					setVisibleCards((prev) => {
						const updated = [...prev];
						updated[index] = true;
						return updated;
					});
				}, index * 350)
			);

			setVisibleCards((prev) => {
				const updated = [...prev];
				updated[0] = true;
				return updated;
			});

			return () => {
				timers.forEach(clearTimeout);
			};
		}, []);

		return (
			<>
				<div id="kpi">
					<Card className={`kpi-card ${ styles.flipX }`} style={{ display: visibleCards[0] ? "block" : "none" }}>
						<CardHeader className="kpi-card-header">
							<h3>Année record</h3>
						</CardHeader>
						<CardContent className="kpi-card-content">
							<p>{yearMaxCount}</p>
							<p className="card-content-text">
								Chutes :
								<span> {maxCount.toLocaleString("fr-FR")}</span>
							</p>
						</CardContent>
					</Card>

					<Card className={`kpi-card ${ styles.flipX }` } style={{ display: visibleCards[1] ? "block" : "none" }}>
						<CardHeader className="kpi-card-header">
							<h3>Année record (t)</h3>
						</CardHeader>
						<CardContent className="kpi-card-content">
							<p>{yearMaxMass}</p>
							<p className="card-content-text">Masse cumulée :
								<span> {formatMass(maxMass)}</span>
							</p>
						</CardContent>
					</Card>

					<Card className={`kpi-card ${ styles.flipX }` } style={{ display: visibleCards[2] ? "block" : "none" }}>
						<CardHeader className="kpi-card-header">
							<h3>Chutes enregistrées</h3>
						</CardHeader>
						<CardContent className="kpi-card-content">
							<p className="card-content-text">Total cumulé : </p>
							<p>{totalMeteorites.toLocaleString("fr-FR")}<span className="emoji"> ☄️</span></p>
						</CardContent>
					</Card>

					<Card className={`kpi-card ${ styles.flipX }` } style={{ display: visibleCards[3] ? "block" : "none" }}>
						<CardHeader className="kpi-card-header">
							<h3>Type dominant</h3>
						</CardHeader>
						<CardContent className="kpi-card-content">
							<p>
								<strong style={{ color: colorMeteoriteType[capitalizeWords(mostCommonType)] }}>
									{capitalizeWords(mostCommonType)}
								</strong>
							</p>
							<p className="card-content-text">Chutes :
								<span> {typeMostCount.toLocaleString("fr-FR")}</span>
							</p>
							<p className="card-content-text">Masse cumulée : <span>{formatMass(typeMostMass)}</span></p>
						</CardContent>
					</Card>

					<Card className={ `kpi-card ${ styles.flipX }` } style={{ display: visibleCards[4] ? "block" : "none" }}>
						<CardHeader className="kpi-card-header">
							<h3>La plus massive</h3>
						</CardHeader>
						<CardContent className="kpi-card-content">
							{ biggestMeteorite &&
								<>
									<p className="highlight">{ biggestMeteorite["Name"] }</p>
									<p>{ formattedWeight }</p>
									<p className="country-color">{ getCountryNameInFrench(biggestMeteorite["Country"]) }
										<span> en { String(biggestMeteorite["Year"]).trim() }</span>
									</p>
								</>
							}
						</CardContent>
					</Card>

					<Card className={ `kpi-card ${ styles.flipX }` } style={{ display: visibleCards[5] ? "block" : "none" }}>
						<CardHeader className="kpi-card-header">
							<h3>Pays le plus impacté</h3>
						</CardHeader>
						<CardContent className="kpi-card-content">
							<p className="country-color">{ getCountryNameInFrench(countryMost) }</p>
							<p className="card-content-text">Chutes :
								<span> { countryMostCount.toLocaleString("fr-FR") }</span>
							</p>
							<p className="card-content-text">Masse cumulée :
								<span> { formatMass(countryMostMass) }</span>
							</p>
						</CardContent>
					</Card>

					<Card className={ `kpi-card ${ styles.flipX }` } style={{ display: visibleCards[6] ? "block" : "none" }}>
						<CardHeader className="kpi-card-header">
							<h3>Stats France</h3>
						</CardHeader>
						<CardContent className="kpi-card-content">
							{franceStats &&
								<>
									<p>{ franceStats.count }<span className="emoji"> ☄️</span></p>
									<p className="card-content-text">Masse cumulée :
										<span> { formatMass(franceStats.totalMass) }</span>
									</p>
								</> }
						</CardContent>
					</Card>

					<Card className={ `kpi-card ${ styles.flipX }` } style={{ display: visibleCards[7] ? "block" : "none" }}>
						<CardHeader className="kpi-card-header">
							<h3>Masse totale</h3>
						</CardHeader>
						<CardContent className="kpi-card-content">
							<p className="card-content-text mass">⚖️</p>
							<p className="card-content-text">Cumul :
								<span> { formatMass(totalMassAll) }</span>
							</p>
						</CardContent>
					</Card>

					<Card className={ `kpi-card ${ styles.flipX }` } style={{ display: visibleCards[8] ? "block" : "none" }}>
						<CardHeader className="kpi-card-header">
							<h3>Découvertes</h3>
						</CardHeader>
						<CardContent className="kpi-card-content">
							<p className="card-content-text find-fall">✔️
								<span> { findCount.toLocaleString("fr-FR") }</span>
							</p>
							<p className="card-content-text find-fall">❌
								<span> { notFindCount.toLocaleString("fr-FR") }</span>
							</p>
						</CardContent>
					</Card>

					<Card className={ `kpi-card ${ styles.flipX }` } style={{ display: visibleCards[9] ? "block" : "none" }}>
						<CardHeader className="kpi-card-header">
							<h3>Record de chutes</h3>
						</CardHeader>
						<CardContent className="kpi-card-content">
							{topMonths.map(([month, count], index) => {
								let emoji = '';
								let color = '';
								if (index === 0) {
									emoji = '🏆';
									color = goldColor;
								} else if (index === 1) {
									emoji = '🥈';
									color = silverColor;
								} else if (index === 2) {
									emoji = '🥉';
									color = bronzeColor;
								}
								return (
									<p key={ month } className="card-content-text record">
										<span>{ emoji } </span>
										<span className="top-month" style={{ color: color }}> { getMonthNameInFrench(month) } : </span>
										<span> { count.toLocaleString("fr-FR") }</span>
									</p>
								);
							})}
						</CardContent>
					</Card>

					<Card className={ `kpi-card ${ styles.flipX }` } style={{ display: visibleCards[10] ? "block" : "none" }}>
						<CardHeader className="kpi-card-header">
							<h3>Record de découvertes</h3>
						</CardHeader>
						<CardContent className="kpi-card-content">
							{topFindMonths.map(([month, count], index) => {
								let emoji = '';
								let color = '';
								if (index === 0) {
									emoji = '🏆';
									color = goldColor;
								} else if (index === 1) {
									emoji = '🥈';
									color = silverColor;
								} else if (index === 2) {
									emoji = '🥉';
									color = bronzeColor;
								}
								return (
									<p key={ month } className="card-content-text record">
										<span>{ emoji } </span>
										<span className="top-month" style={{ color: color }}> { getMonthNameInFrench(month) } : </span>
										<span> { count.toLocaleString("fr-FR") }</span>
									</p>
								);
							})}
						</CardContent>
					</Card>

					<Card className={ `kpi-card ${ styles.flipX }` } style={{ display: visibleCards[11] ? "block" : "none" }}>
						<CardHeader className="kpi-card-header">
							<h3>Hémisphère</h3>
						</CardHeader>
						<CardContent className="kpi-card-content">
							<p className="cardinal-points">🧭</p>
							<p className="card-content-text">Nord :
								<span> { northernHemisphereCount.toLocaleString("fr-FR") }
									<span className="emoji"> ☄️</span>
								</span>
							</p>
							<p className="card-content-text">Sud :
								<span> { southernHemisphereCount.toLocaleString("fr-FR") }
									<span className="emoji"> ☄️</span>
								</span>
							</p>
						</CardContent>
					</Card>

					<Card className={ `kpi-card ${ styles.flipX }` } style={{ display: visibleCards[12] ? "block" : "none" }}>
						<CardHeader className="kpi-card-header">
							<h3>Types de météorites</h3>
						</CardHeader>
						<CardContent className="kpi-card-content">
							{Object.entries(typeStats).map(([type, stats]) => (
								<div className="type-meteorite" key={ type }>
									<p><strong style={{ color: colorMeteoriteType[type] }}>{ capitalizeWords(type) }</strong></p>
									<p className="card-content-text">Chutes :
										<span> { stats.count.toLocaleString("fr-FR") }</span>
									</p>
									<p className="card-content-text">Masse cumulée :
										<span> { formatMass(stats.totalMass) }</span>
									</p>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</>
		);
	};

	return (
		<div>
			<KPI_Cards
				yearMaxCount={ yearMaxCount }
				maxCount={ maxCount }
				yearMaxMass={ yearMaxMass }
				maxMass={ maxMass }
			/>
		</div>
	);
}
