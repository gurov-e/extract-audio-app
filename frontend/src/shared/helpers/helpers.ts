export const copyToClipboard = async (text: string): Promise<void> => {
	try {
		await navigator.clipboard.writeText(text);
	} catch {
		// фоллбэк для старых браузеров
		const textarea = document.createElement("textarea");
		textarea.value = text;
		textarea.style.position = "fixed";
		textarea.style.opacity = "0";
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand("copy");
		document.body.removeChild(textarea);
	}
};

export const isVideoFile = (file: File): boolean => {
	return file.type.startsWith("video/");
};

export const isFileSizeValid = (file: File): boolean => {
	const MAX_SIZE = 10 * 1024 * 1024; // 10 МБ

	return file.size <= MAX_SIZE;
};

export const getMediaUrl = (path: string): string => {
	return `${window.location.origin}/api${path}`;
};