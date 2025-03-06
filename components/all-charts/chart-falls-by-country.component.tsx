import { Meteorite } from "@/lib/interfaces/meteorite-interface";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getCountryNameInFrench } from '@/lib/utils/translate-country-in-french';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { useGenericColorsHook } from "@/lib/utils/use-generic-colors-hook";


export default function ChartFallsByCountry({
  meteorites,
}: {
  meteorites: Meteorite[];
}) {
	// Count meteorites by country (country wich are null are ignored)
	const counts: Record<string, number> = {};
	meteorites.forEach((meteorite) => {
		const country = meteorite.Country?.trim();
		if (country) {
			counts[country] = (counts[country] || 0) + 1;
		}
	});

	// Transform object in table (keep only country with more than 100 meteorites/ascend filtering)
	const data = Object.entries(counts)
		.map(([country, count]) => ({ country, count }))
		.filter((entry) => entry.count > 100)
		.sort((a, b) => b.count - a.count);

	// HSL color generator
	const getColor = (index: number, total: number): string => {
		const hue = (index * 360) / total;
		return `hsl(${hue}, 70%, 50%)`;
	};

	// Get color for y axis
  const colorMap = data.reduce((acc, entry, index) => {
    acc[entry.country] = getColor(index, data.length);
    return acc;
  }, {} as Record<string, string>);

	// Get generic colors
	const { accentColor } = useGenericColorsHook();

	// Tooltip
	const cursorStyle = true;

	return (
		<Card id="chart-meteorite-country-counter" className="charts-card">
			<CardHeader className="charts-card-header">
				<h3>Chutes de météorites par pays</h3>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={450}>
					<BarChart
						data={ data }
						layout="vertical"
						margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
						<CartesianGrid horizontal={ false } strokeDasharray="1 1" />
						<XAxis
							type="number"
							tick={({ x, y, payload }) => (
								<text x={ x }
											y={ y + 15 }
											fill={ accentColor }
											fontWeight="bold"
											fontSize={13}
											textAnchor="middle">
									{ payload.value }
								</text> )} />
						<YAxis
              dataKey="country"
              type="category"
              tick={({ x, y, payload }) => (
                <text x={ x -10 }
											y={ y }
											fill={ colorMap[payload.value] }
											fontWeight="bold"
											fontSize={13}
											textAnchor="end"
											dominantBaseline="middle">
									{getCountryNameInFrench(payload.value)}
                </text>
              )} />
						<Tooltip
							cursor={ cursorStyle ? { width: '100%' } : {} }
							content={( { label, payload, active }  ) => {
								const countryName = getCountryNameInFrench(label);
								const countryColor = colorMap[label];
								return (
									<CustomTooltip
										label={ countryName }
										payload={ payload }
										active={ active }
										labelText=""
										formatter={ (value) => `${ value.toLocaleString() } ☄️` }
										cursorStyle={{ color: countryColor }}
										labelColorType="country" /> );
							}} />
						<Bar dataKey="count"
								name="Météorites"
								activeBar={{ fill: accentColor }}>
							{data.map((_entry, index) => (
								<Cell key={`cell-${_entry.country}-${index}`}
											fill={ colorMap[_entry.country] } />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
