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

export const downloadImage = async (_id: string, photo: string) => {
  FileSaver.saveAs(photo, `AInterest-${_id}.jpg`);
};

export const getRapidApiHeaders = (host: string) => {
  return {
    'x-rapidapi-key': import.meta.env.VITE_X_RAPIDAPI_KEY,
    'x-rapidapi-host': host,
    'Content-Type': 'application/json'
  };
};

export const getColorSchemeFromLocalStorage = () => {
  const scheme = localStorage.getItem('mantine-color-scheme-value');
  return scheme === 'dark' || scheme === 'light' ? scheme : 'light';
};
