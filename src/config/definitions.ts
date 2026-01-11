export type LinkMetadata = {
	menuText: string;
	menuUrl: string;
};
export interface navMenuType {
	label?: string | undefined;
	url?: string | undefined;
}
export interface PageTypeProps {
	params: Promise<{ id: string }>;
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}
