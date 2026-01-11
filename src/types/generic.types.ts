export type GenericDataType<
	T extends Record<string, unknown> | null = Record<string, any>
> = T;

// export type ApiResponse<T = unknown> =
// 	| { success: T; error?: undefined }
// 	| { success?: undefined; error: Record<string, any> };

export type ApiResponse<T> = {
	success: T | null;
	error: object | string | null;
};

// THIS ALLOW FOR BOTH NEXTED AND NON-NEXTED OBJECTS (FLAT OR NESTED)
// // e.g., { data: { name: "John" }, meta: { page: 1 } }
// // e.g., { message: "Success", code: 200 }
export type ObjectType =
	// | Record<string, string | number | boolean | Date | File>
	Record<string, string | number | boolean | Date | File | null | undefined>;
export type FormObjectPayloaddType = Record<
	string,
	string | number | boolean | Date | File | Blob | null | undefined
>;

// export type Params = Promise<{ slug: string }>;
// export type SearchParams = Promise<{ query?: string }>;
export type QueryParams = Promise<{ query?: string; page?: string }>;

// types/page-props.ts
export type RouteParams<T extends string = string> = Promise<{
	[key in T]: string;
}>;

export type SearchParams = Promise<{
	[key: string]: string | string[] | undefined;
}>;
export type PagePropsType<T extends string = string> = {
	params: RouteParams<T>;
	searchParams?: SearchParams;
};
export type PagePropsWithId = {
	params: RouteParams<"id">;
	searchParams?: SearchParams;
};
