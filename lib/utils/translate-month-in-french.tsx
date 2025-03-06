type MonthNames = {
  [key: string]: string;
};

const monthNames: MonthNames = {
  "January": "Janvier",
  "February": "Février",
  "March": "Mars",
  "April": "Avril",
  "May": "Mai",
  "June": "Juin",
  "July": "Juillet",
  "August": "Août",
  "September": "Septembre",
  "October": "Octobre",
  "November": "Novembre",
  "December": "Décembre"
};


export const getMonthNameInFrench = (monthName: string): string => {
  return monthNames[monthName] || monthName;
};
