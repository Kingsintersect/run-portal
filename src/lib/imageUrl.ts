import { baseUrl, ROOT_IMAGE_URL } from "@/config";

const BASE_IMAGE_URL_DEV = baseUrl;
const BASE_IMAGE_URL_PROD = ROOT_IMAGE_URL;

export function FormatImageUrl(imagePath: string | null | undefined): string {
	if (
		!imagePath ||
		typeof imagePath !== "string" ||
		imagePath.trim() === ""
	) {
		return `${BASE_IMAGE_URL_DEV}/products/default_product_image_2.png`;
	}

	if (imagePath.startsWith("blob:")) {
		return imagePath;
	}

	if (imagePath.startsWith("http")) {
		return imagePath;
	}

	// Prevent localhost and dev fallback for production
	if (imagePath.includes("localhost") || imagePath.includes("127.0.0.1")) {
		return `${BASE_IMAGE_URL_DEV}/products/default_product_image_2.png`;
	}

	return `${BASE_IMAGE_URL_PROD}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

export interface AcademicImage {
	id: number;
	url: string;
	alt: string;
	file?: File;
	primary: boolean;
}
export function convertImageUrlsToPictures(urls: string[]): AcademicImage[] {
	return urls.map((url, index) => ({
		id: Date.now() + index,
		url,
		alt: `Image ${index + 1}`,
		primary: index === 0,
	}));
}
export function getSafeImageUrl(url: string): string {
	if (!url || url.trim() === "") {
		return `${BASE_IMAGE_URL_DEV}/products/default_product_image_2.png`;
	}

	if (url.startsWith("blob:") || url.startsWith("http")) {
		return url;
	}

	// For relative paths
	return `${BASE_IMAGE_URL_PROD}${url.startsWith("/") ? "" : "/"}${url}`;
}