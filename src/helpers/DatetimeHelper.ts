import * as chrono from "chrono-node";

export const parseDateFromString = (dateString: string) => {
    // Handle null/empty values
    if (!dateString || dateString.toLowerCase() === 'null' || dateString.trim() === '') {
        return new Date();
    }

    const cleanDateString = dateString.replace(/['"]/g, '').trim();
    const parsedDate = chrono.parseDate(cleanDateString);

    if (parsedDate && !isNaN(parsedDate.getTime())) {
        return parsedDate;
    }

    // Fallback to current date if parsing fails
    console.warn(`Could not parse date: "${dateString}". Using current date as fallback.`);
    return new Date();
};