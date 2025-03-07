import FileSaver from 'file-saver';
import { surpriseMePrompts } from '../constants';

export const getRandomPrompt = (prompt: string): string => {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  if (randomPrompt === prompt) {
    return getRandomPrompt(prompt);
  }

  return randomPrompt;
};

export const downloadImage = async (_id: string, photo: string, username: string) => {
  FileSaver.saveAs(photo, `${username}-${_id}.jpg`);
};

export const getRapidApiHeaders = (host: string) => {
  return {
    'x-rapidapi-key': import.meta.env.VITE_X_RAPIDAPI_KEY,
    'x-rapidapi-host': host,
    'Content-Type': 'application/json'
  };
};

export const generateIdFromString = (text: string) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  const positiveHash = Math.abs(hash);
  const fiveDigitId = positiveHash % 100000;

  return String(fiveDigitId).padStart(5, '0');
};
