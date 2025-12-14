import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Meteorite } from "@/lib/interfaces/meteorite-interface";
import {
  CartesianGrid,
  DotProps,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { getMonthNameInFrench } from "@/lib/utils/translate-month-in-french";
import { useGenericColorsHook } from "@/lib/utils/use-generic-colors-hook";


export default function ChartCountFindByMonth({ meteorites }: { meteorites: Meteorite[] }) {
  const monthCounts: Record<string, number> = {};

  meteorites.forEach((meteorite) => {
    if (meteorite.ff === "Find" && meteorite.Month) {
      const month = meteorite.Month.trim();
      const normalizedMonth = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
      monthCounts[normalizedMonth] = (monthCounts[normalizedMonth] || 0) + 1;
    }
  });

  const topMonths = Object.entries(monthCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([month]) => month);

  const monthsOrder = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  // Construct data for Recharts
  const chartData = monthsOrder.map((month) => {
    const count = monthCounts[month] || 0;
    return { month, find: count };
  });

  const sortedChartData = chartData.sort((a, b) => {
    return monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month);
  });

  // Get generic colors
  const { accentColor, bronzeColor, goldColor, primaryColor, secondaryColor, silverColor } = useGenericColorsHook();

  // Dots fonctions
  const getPointColor = (month: string) => {
    if (month === topMonths[0]) return goldColor;
    if (month === topMonths[1]) return silverColor;
    if (month === topMonths[2]) return bronzeColor;
    return accentColor;
  };

  const getEmojiForMonth = (month: string) => {
    if (month === topMonths[0]) return "🥇";
    if (month === topMonths[1]) return "🥈";
    if (month === topMonths[2]) return "🥉";
    return "";
  };

  const renderCustomDot = (props: DotProps & { payload?: { month?: string } }) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy || !payload) return <></>;

    const emoji = getEmojiForMonth(payload.month ?? "");

    if (emoji) {
      return (
        <text key={ payload.month } x={cx - 11} y={cy + 3} fill="white" fontSize={16} fontWeight="bold">
          { emoji }
        </text>
      );
    }

    const pointColor = getPointColor(payload.month ?? "");
    return <circle key={ payload.month } cx={cx} cy={cy} r={6} fill={ pointColor } stroke="white" />;
  };

  const renderActiveDot = (props: DotProps & { payload?: { month?: string } }) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy || !payload?.month) return <></>;

    let activeColor = secondaryColor;

    if (payload.month === topMonths[0]) {
      activeColor = goldColor;
    }
    else if (payload.month === topMonths[1]) {
      activeColor = silverColor;
    }
    else if (payload.month === topMonths[2]) {
      activeColor = bronzeColor;
    }

    const emoji = getEmojiForMonth(payload.month ?? "");

    if (emoji) {
      return (
        <text x={cx - 13} y={cy + 4} fill="white" fontSize={20} fontWeight="bold">
          { emoji }
        </text>
      );
    }

    return <circle cx={cx} cy={cy} r={8} fill={ activeColor } stroke="white" />;
  };


  return (
    <Card className="charts-card">
      <CardHeader className="charts-card-header">
        <h3>Nombre de découvertes de météorites par mois</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={ sortedChartData } margin={{ right: 30 }}>
            <CartesianGrid vertical={ false } strokeDasharray="1 1" />
            <XAxis
              dataKey="month"
              tick={({ x, y, payload }) => (
                <text key={ payload.value }
                      x={ x }
                      y={ y + 15 }
                      fill={ accentColor }
                      fontWeight="bold"
                      fontSize={11}
                      textAnchor="middle">
                  { getMonthNameInFrench(payload.value) }
                </text> )}
              interval={0} />
            <YAxis
              dataKey="find"
              tick={({ x, y, payload }) => (
                <text key={ payload.value }
                      x={ x - 5 }
                      y={ y }
                      fill={ accentColor }
                      fontWeight="bold"
                      fontSize={13}
                      textAnchor="end"
                      dominantBaseline="middle">
                  { payload.value }
                </text> )}
              domain={[0, 400]} />
            <Tooltip
							content={( { label, payload, active }  ) => {
								const monthName = getMonthNameInFrench(label);
								return (
									<CustomTooltip
										label={ monthName }
										payload={ payload }
										active={ active }
										labelText="Découvertes : " /> );
							}} />
            <Line
              type="monotone"
              dataKey="find"
              stroke={ primaryColor }
              strokeWidth={2}
              dot={ renderCustomDot }
              activeDot={ renderActiveDot } />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
