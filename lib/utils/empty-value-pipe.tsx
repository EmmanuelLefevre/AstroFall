export const emptyValuePipe = (value: string | number | null | undefined) => {
  if (value == null || value === "") return "-";
  return value;
};