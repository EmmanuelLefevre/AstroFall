import React from "react";
import { NameType, Payload, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { useGenericColorsHook } from "@/lib/utils/use-generic-colors-hook";


type LabelColorType = "accent" | "country" | "type";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Payload<ValueType, NameType>[];
  label?: string;
  cursorStyle?: React.CSSProperties;
  labelText?: string;
  formatter?: (value: number) => string;
  labelColorType?: LabelColorType;
  labelColor?: string;
}


export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  cursorStyle,
  labelText = "Chutes : ",
  formatter = (value) => value.toLocaleString(),
  labelColorType = "accent",
  labelColor = ""
}) => {
  const { accentColor, colorMeteoriteType, primaryColor, secondaryColor } = useGenericColorsHook();

  switch (labelColorType) {
    case "accent":
      labelColor = accentColor;
      break;
    case "country":
      labelColor = cursorStyle?.color || accentColor;
      break;
    case "type":
      labelColor = colorMeteoriteType[label || ""];
      break;
  }

  if (active && payload && payload.length > 0) {
    const val = payload[0].value;

    if (val == null) {
      return null;
    }
    else if (Array.isArray(val)) {
      return <div>Impossible d&apos;afficher un tableau</div>
    }

    const formattedValue = typeof val === "number" ? `${ formatter(val) }` : "N/A";

    return (
      <div style={{ background: "white", padding: "8px", ...cursorStyle }}>
        <p style={{ color: labelColor, fontWeight: "bold" }}>{ label }</p>
        <p style={{ color: secondaryColor }}>{ labelText }
          <span style={{ color: primaryColor }}>{ formattedValue }</span>
        </p>
      </div>
    );
  }

  return null;
}
