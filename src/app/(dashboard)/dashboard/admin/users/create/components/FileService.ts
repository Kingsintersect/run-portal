import * as XLSX from "xlsx";
import Papa from "papaparse";
import { UserData } from "@/hooks/useCreateUsers";

/**
 * Parse Excel or CSV file to extract user data
 */
export const parseExcelOrCSV = async (file: File): Promise<UserData[]> => {
	return new Promise((resolve, reject) => {
		// Check file extension
		const fileExtension = file.name.split(".").pop()?.toLowerCase();

		if (fileExtension === "csv") {
			// Parse CSV
			Papa.parse(file, {
				header: true,
				skipEmptyLines: true,
				complete: (results) => {
					const data = results.data as UserData[];
					resolve(validateAndFormatData(data));
				},
				error: (error) => {
					reject(error);
				},
			});
		} else if (["xls", "xlsx"].includes(fileExtension || "")) {
			// Parse Excel
			const reader = new FileReader();

			reader.onload = (e) => {
				try {
					const data = e.target?.result;
					const workbook = XLSX.read(data, { type: "array" });
					const firstSheetName = workbook.SheetNames[0];
					const worksheet = workbook.Sheets[firstSheetName];
					const jsonData = XLSX.utils.sheet_to_json(
						worksheet
					) as UserData[];

					resolve(validateAndFormatData(jsonData));
				} catch (error) {
					reject(error);
				}
			};

			reader.onerror = (error) => {
				reject(error);
			};

			reader.readAsArrayBuffer(file);
		} else {
			reject(new Error("Unsupported file format"));
		}
	});
};

/**
 * Validate and format the parsed data
 */
const validateAndFormatData = (data: UserData[]): UserData[] => {
	// Ensure all required fields are present and format data
	return data.map((row, index) => {
		// Normalize field names (handle different cases and whitespace)
		const normalizedRow: UserData = {
			...row,
			firstName: getValueByPossibleKeys(row, [
				"firstName",
				"first_name",
				"firstname",
				"first name",
			]),
			lastName: getValueByPossibleKeys(row, [
				"lastName",
				"last_name",
				"lastname",
				"last name",
			]),
			email: getValueByPossibleKeys(row, [
				"email",
				"email_address",
				"emailaddress",
				"email address",
			]),
			role: getValueByPossibleKeys(row, [
				"role",
				"user_role",
				"userrole",
				"user role",
			]),
			phoneNumber: getValueByPossibleKeys(row, [
				"phoneNumber",
				"phone_number",
				"phonenumber",
				"phone number",
				"phone",
			]),
			address: getValueByPossibleKeys(row, ["address"]),
		};

		// Validate required fields
		if (
			!normalizedRow.firstName ||
			!normalizedRow.lastName ||
			!normalizedRow.email ||
			!normalizedRow.role
		) {
			console.warn(`Row ${index + 1} has missing required fields`);
		}

		return normalizedRow;
	});
};

/**
 * Helper function to look up a value by multiple possible keys
 */
const getValueByPossibleKeys = (obj, keys: string[]): string => {
	for (const key of keys) {
		// Check with exact match
		if (obj[key] !== undefined) {
			return obj[key];
		}

		// Check with case-insensitive match
		const lowerKey = key.toLowerCase();
		for (const objKey of Object.keys(obj)) {
			if (objKey.toLowerCase() === lowerKey) {
				return obj[objKey];
			}
		}
	}

	return "";
};
