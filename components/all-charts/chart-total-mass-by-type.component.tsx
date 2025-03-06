import { Meteorite } from "@/lib/interfaces/meteorite-interface";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Bar,
    BarChart,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { useGenericColorsHook } from "@/lib/utils/use-generic-colors-hook";


// Assume "Recovered weight" field is already in kg
function parseMassInKg(mass: string | number | null | undefined): number {
	if (mass == null) {
		return 0;
	}

	if (typeof mass === "number") {
		return mass;
	}

	// Otherwise simply parse string by number (kg)
	const parsed = parseFloat(mass.trim());
	return isNaN(parsed) ? 0 : parsed;
}

export default function ChartTotalMassByType({ meteorites }: { meteorites: Meteorite[] }) {
	// Store total mass (kg) for each of categories
	const typeMass = {
		Stone: 0,
		Iron: 0,
		"Stony-Iron": 0,
		null: 0,
	};

	// Browse meteorites to accumulate mass by type
	meteorites.forEach((meteorite) => {
		const weight = parseMassInKg(meteorite["Recovered weight"]);
		const typeKey = meteorite.Type === null ? null : meteorite.Type.trim();

		// Répartition par type
		if (typeKey === "Stone") {
			typeMass.Stone += weight;
		}
		else if (typeKey === "Iron") {
			typeMass.Iron += weight;
		}
		else if (typeKey === "Stony-Iron") {
			typeMass["Stony-Iron"] += weight;
		}
		else {
			typeMass.null += weight;
		}
	});

	// Construct data for Recharts
	const data = [
		{ type: "Stone", value: Math.ceil((typeMass.Stone / 1000) * 10) / 10 },
		{ type: "Iron", value: Math.ceil((typeMass.Iron / 1000) * 10) / 10 },
		{ type: "Stony-Iron", value: Math.ceil((typeMass["Stony-Iron"] / 1000) * 10) / 10 },
		{ type: "Sans Type", value: Math.ceil((typeMass.null / 1000) * 10) / 10 },
	];

	// Get generic colors
  const { accentColor, colorMeteoriteType } = useGenericColorsHook();

	// Tooltip
	const cursorStyle = true;

	return (
		<Card id="chart-meteorite-mass-by-type" className="charts-card">
			<CardHeader className="charts-card-header">
				<h3>Masse totale par type de météorites</h3>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={400}>
					<BarChart data={ data }>
						<XAxis
							dataKey="type"
							tick={({ x, y, payload }) => {
								const color = colorMeteoriteType[payload.value] || "#000";
								return (
									<text x={ x }
												y={ y + 15 }
												fill={ color }
												fontWeight="bold"
												fontSize={13}
												textAnchor="middle">
										{ payload.value }
									</text> ); }} />
						<YAxis
							tick={({ x, y, payload }) => (
								<text x={ x - 5 }
											y={ y }
											fill={ accentColor }
											fontWeight="bold"
											fontSize={13}
											textAnchor="end"
											dominantBaseline="middle">
									{ payload.value + " t" }
								</text> )} />
						<Tooltip
							content={ <CustomTooltip labelText="" labelColorType="type" /> }
							cursor={ cursorStyle ? { width: '100%' } : {} }
							formatter={ (value) => `${ value.toLocaleString() } t` }/>
						<Bar dataKey="value">
							{data.map((entry) => (
								<Cell key={ entry.type }
											fill={ colorMeteoriteType[entry.type] } />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
