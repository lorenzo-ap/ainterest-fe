import FileSaver from 'file-saver';

import { surpriseMePrompts } from '../constants';

const getRandomPrompt = (prompt: string) => {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  if (randomPrompt === prompt) {
    return getRandomPrompt(prompt);
  }

  return randomPrompt;
};

const downloadImage = async (_id: string, photo: string) => {
  FileSaver.saveAs(photo, `download-${_id}.jpg`);
};

const getRapidApiHeaders = (host: string) => {
  return {
    'x-rapidapi-key': import.meta.env.VITE_X_RAPIDAPI_KEY,
    'x-rapidapi-host': host,
    'Content-Type': 'application/json'
  };
};

export { getRandomPrompt, downloadImage, getRapidApiHeaders };
