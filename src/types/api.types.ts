export interface ApiResponseArray<T> {
    status: number | boolean;
    message?: string;
    data: {
        data: T[];
        total: number
    }
}
export interface ApiResponseSingle<T> {
    status: number | boolean;
    message?: string;
    data: T;
}