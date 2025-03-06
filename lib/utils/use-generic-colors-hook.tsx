import { useState, useEffect } from "react";

import "@/public/styles/hook/generic-colors.scss";


export function useGenericColorsHook() {
  const [colorMeteoriteType, setColorMeteoriteType] = useState<Record<string, string>>({
    Iron: "#ff7f0e",
    Stone: "#6e3b00",
    "Stony-Iron": "#2ca02c",
    "Sans Type": "#383838",
  });

  const [accentColor, setAccentColor] = useState<string>("#6e02c7");
  const [primaryColor, setPrimaryColor] = useState<string>("#02afac");
  const [secondaryColor, setSecondaryColor] = useState<string>("#226A90");

  const [rodColor, setRodColor] = useState<string>("#02afac");
  const [activeRodColor, setActiveRodColor] = useState<string>("#FF0000");

  const [bronzeColor, setBronzeColor] = useState<string>("#a93900");
  const [goldColor, setGoldColor] = useState<string>("#ffc400");
  const [silverColor, setSilverColor] = useState<string>("#c0c0c0");

  const [northColor, setNorthColor] = useState<string>("#4F9DFF");
  const [southColor, setSouthColor] = useState<string>("#FF6F61");

  useEffect(() => {
    setTimeout(() => {
      const rootStyles = getComputedStyle(document.documentElement);

      setAccentColor(rootStyles.getPropertyValue("--accent-color").trim());
      setPrimaryColor(rootStyles.getPropertyValue("--primary-color").trim());
      setSecondaryColor(rootStyles.getPropertyValue("--secondary-color").trim());

      setRodColor(rootStyles.getPropertyValue("--rod-color").trim());
      setActiveRodColor(rootStyles.getPropertyValue("--active-rod-color").trim());

      setBronzeColor(rootStyles.getPropertyValue("--bronze-color").trim());
      setGoldColor(rootStyles.getPropertyValue("--gold-color").trim());
      setSilverColor(rootStyles.getPropertyValue("--silver-color").trim());

      setNorthColor(rootStyles.getPropertyValue("--north-color").trim());
      setSouthColor(rootStyles.getPropertyValue("--south-color").trim());

      setColorMeteoriteType({
        Iron: rootStyles.getPropertyValue("--meteorite-type-iron").trim(),
        Stone: rootStyles.getPropertyValue("--meteorite-type-stone").trim(),
        "Stony-Iron": rootStyles.getPropertyValue("--meteorite-type-stony-iron").trim(),
        "Sans Type": rootStyles.getPropertyValue("--meteorite-type-null").trim(),
      });

    }, 100);
  }, []);

  return {  accentColor,
            activeRodColor,
            bronzeColor,
            colorMeteoriteType,
            goldColor,
            northColor,
            primaryColor,
            rodColor,
            secondaryColor,
            silverColor,
            southColor
          };
}
