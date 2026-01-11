import { remoteApiUrl } from "@/config";
import { ObjectType, GenericDataType } from "@/types/generic.types";
import { apiCallerBeta } from "../apiCaller";
import { throwFormattedError } from "../errorsHandler";

export const CreateStudentAccount = async (
    data: ObjectType
): Promise<GenericDataType> => {
    const response = (await apiCallerBeta({
        url: `${remoteApiUrl}/application/purchase`,
        method: "POST",
        data: { ...data },
    })) as GenericDataType;
    if (response.error) {
        throwFormattedError(response.error);
    }
    return { response, user_email: data.email };
};