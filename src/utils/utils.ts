import FileSaver from 'file-saver';
import { surpriseMePrompts } from '../constants';
import { toastService } from '../services';

export const getRandomPrompt = (prompt: string): string => {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  if (randomPrompt === prompt) {
    return getRandomPrompt(prompt);
  }

  return randomPrompt;
};

export const downloadImage = async (desc: string, photo: string, username: string) => {
  const id = generateIdFromString(desc);
  FileSaver.saveAs(photo, `${username}-${id}.png`);
  toastService.success('Image downloaded successfully!', 2500);
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
