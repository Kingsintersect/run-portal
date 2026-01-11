import { remoteApiUrl } from "@/config";
import { apiCallerBeta } from "@/lib/apiCaller";
import { GenericDataType } from "@/types/generic.types";

export async function GetAllProgram() {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/odl/categories`,
		method: "GET",
	})) as GenericDataType;
	return response;
}
