// src/utils/formatDate.js
export const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (isNaN(date.getTime())) return value;

  const day = date.getDate().toString().padStart(2, "0");

  // Month short names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = months[date.getMonth()];

  const year = date.getFullYear();

  // Time
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // return `${day} ${monthName} ${year} ${hours}:${minutes}`;
  return `${day} ${monthName} ${year}`;
};
