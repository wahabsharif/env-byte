export const sanitizeDateTime = (dateString: string): string => {
  if (!dateString) return "--"; // Return 'N/A' if no date is provided

  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  // Format date to a human-readable string without time (e.g., "Dec 2, 2024")
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return date.toLocaleString("en-US", options);
};
