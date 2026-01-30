/**
 * Formats a date string or Date object to DD-MM-YYYY format.
 * @param date - The date to format.
 * @returns The formatted date string or "N/A" if invalid.
 */
export const formatDateStandard = (date: string | Date | undefined | null): string => {
    if (!date) return "N/A";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
};
