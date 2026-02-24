import type { Locale } from 'date-fns/locale';
import { locales, RANDOM_PROMPTS } from '../constants';
import { toastService } from '../services';

export const getRandomPrompt = (prompt: string): string => {
	const randomIndex = Math.floor(Math.random() * RANDOM_PROMPTS.length);
	const randomPrompt = RANDOM_PROMPTS[randomIndex];

	if (randomPrompt === prompt) {
		return getRandomPrompt(prompt);
	}

	return randomPrompt;
};

export const downloadImage = async (desc: string, photo: string, username: string) => {
	const id = generateIdFromString(desc);
	const response = await fetch(photo);
	const blob = await response.blob();
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `${username}-${id}.png`;
	link.click();
	URL.revokeObjectURL(url);
	toastService.success('Image downloaded successfully!', 2500);
};

export const getLocale = (language: string): Locale => (locales as Record<string, Locale>)[language];

const generateIdFromString = (text: string) => {
	let hash = 0;
	for (let i = 0; i < text.length; i++) {
		const char = text.charCodeAt(i);
		hash = hash * 32 - hash + char;
		hash = Math.trunc(hash);
	}

	const positiveHash = Math.abs(hash);
	const fiveDigitId = positiveHash % 100_000;

	return String(fiveDigitId).padStart(5, '0');
};
