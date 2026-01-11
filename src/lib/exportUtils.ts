import { notify } from "@/contexts/ToastProvider";
import { ObjectType } from "@/types/generic.types";

/**
 * Generates a CSV string from an array of objects with selected columns.
 * @param data - Array of objects representing tabular data.
 * @param columns - Array of column keys to include in the CSV.
 * @returns A string representing the CSV content.
 */
export const generateCSVContent = (
	data: Record<string, any>[],
	columns: string[]
): string => {
	if (data.length === 0) {
		console.error("");
		throw new Error("No data available to export");
	}

	// Validate selected columns
	const headers = columns.length > 0 ? columns : Object.keys(data[0]);

	// Create the CSV header row
	const headerRow = headers.join(",").toUpperCase();

	// Map each row of data into a CSV row based on selected columns
	const rows = data
		.map((row) => {
			return headers
				.map((header) => {
					const cell = row[header] ?? ""; // Fallback to an empty string if the column doesn't exist
					return `"${String(cell).replace(/"/g, '""')}"`; // Escape special characters
				})
				.join(",");
		})
		.join("\n");

	// Combine the header row and the data rows
	return `${headerRow}\n${rows}`;
};

/**
 * Exports data to a CSV file with selected columns.
 * @param data - Array of objects to export.
 * @param fileName - Name of the output file.
 * @param columns - Array of column keys to include in the export.
 */
export const exportToExcel = async (
	data: ObjectType[],
	fileName: string,
	columns: string[] = []
) => {
	if (!data || data.length === 0) {
		notify({
			message: "No data available for export",
			variant: "error",
			timeout: 5000,
		});
		return;
	}

	// Ensure we have valid columns
	const selectedColumns =
		columns.length > 0 ? columns : Object.keys(data[0] || {});
	if (selectedColumns.length === 0) {
		notify({
			message: "No columns available for export",
			variant: "error",
			timeout: 5000,
		});
		return;
	}

	const csvContent = generateCSVContent(data, columns);
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = `${fileName}.csv`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
};
