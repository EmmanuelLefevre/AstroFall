import { Meteorite } from "@/lib/interfaces/meteorite-interface";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Cell,
	Legend,
	LegendProps,
	PieChart,
	Pie,
	ResponsiveContainer,
	Tooltip
} from "recharts";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { useGenericColorsHook } from "@/lib/utils/use-generic-colors-hook";

export default function ChartFallsByHemisphere({ meteorites }: { meteorites: Meteorite[] }) {
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

  // Construct data for Recharts
  const rechartsData = [
    { name: "Nord", value: northernHemisphereCount },
    { name: "Sud", value: southernHemisphereCount },
  ];

  // Get generic colors
	const { northColor, southColor } = useGenericColorsHook();

	// Tooltip
	const cursorStyle = true;

	// Legend
	const CustomLegend: React.FC<LegendProps> = ({ payload }) => {
		if (!payload) return null;

		return (
			<div id="chart-hemisphere-legend">
				{payload.map((entry, index) => {
					const isNorth = entry.value === "Nord";
					const emoji = isNorth ? "🧊" : "🔥";
        	const color = isNorth ? northColor : southColor;
					return (
						<div key={index} className="hemisphere-item">
							<span className="hemisphere-emoji">{ emoji }</span>
							<span className="hemisphere-text" style={{ color }}>{ entry.value }</span>
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<Card id="chart-fall-by-hemisphere" className="charts-card">
			<CardHeader className="charts-card-header">
				<h3>Chutes de météorites par hémisphère</h3>
			</CardHeader>
			<CardContent id="chart-content-fall-by-hemisphere">
				<ResponsiveContainer height={400}>
					<PieChart>
						<Pie data={ rechartsData }
								dataKey="value"
								nameKey="type"
								cx="50%"
								cy="50%"
								outerRadius={150}
								label
								paddingAngle={7}>
              <Cell fill={ northColor } />
              <Cell fill={ southColor } />
						</Pie>
						<Tooltip
							content={({ payload, active }) => {
								if (active && payload && payload.length) {
									const hemisphere = payload[0].payload.name;
									const color = hemisphere === "Nord" ? northColor : southColor;
									return (
										<CustomTooltip
											active={ active }
											label={ hemisphere }
											labelText=""
											labelColorType={ hemisphere }
											payload={ payload }
											formatter={ (value) => `${ value.toLocaleString() } ☄️` }
											labelColor={ color } /> );
								}
								return null;
							}}
							cursor={ cursorStyle ? { width: '100%' } : {} } />
						<Legend content={ <CustomLegend /> } />
					</PieChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}