import { JSX } from "react";

export const transformStringValuePipe = (value: string | undefined, transformationMap: { [key: string]: JSX.Element | string }
): JSX.Element | string => {
  if (!value) return "NC";

  const lowerCaseValue = value.toLowerCase();

  if (transformationMap[lowerCaseValue]) {
    return transformationMap[lowerCaseValue];
  }

  return "NC";
};
