type CountryNames = {
  [key: string]: string;
};

const countryNames: CountryNames = {
  "Algeria": "Algérie",
  "Antarctica": "Antarctique",
  "Australia": "Australie",
  "India": "Inde",
  "Libya": "Libye",
  "Namibia": "Namibie",
  "North West Africa": "Afrique Nord/Ouest",
  "Russia": "Russie",
  "USA": "Etats-Unis"
};


export const getCountryNameInFrench = (countryName: string): string => {
  return countryNames[countryName] || countryName;
};
