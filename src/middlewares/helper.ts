import { Url } from '../URL/UrlModel';
import crypto from 'crypto'; 

export const generateShortUrl = (length: number = 6): string => {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  };
  
  // Helper function to validate URL format
  export const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  // Helper function to check and handle unique short URL generation
  export const getUniqueShortUrl = async (): Promise<string> => {
    let shortUrl = generateShortUrl();
    while (await Url.findOne({ shortUrl })) {
      shortUrl = generateShortUrl();
    }
    return shortUrl;
  };


export const appendQueryParamsToUrl = (originalUrl: string, queryParams: Record<string, any>): string => {
  const url = new URL(originalUrl);
  const originalParams = new URLSearchParams(url.search);

  for (const [key, value] of Object.entries(queryParams)) {
    if (Array.isArray(value)) {
      // Set the key to the last value if it's an array
      originalParams.set(key, value[value.length - 1] as string);
    } else {
      originalParams.set(key, value as string); // Replace if exists, or add if it doesn't
    }
  }

  // Update the search parameters of the URL object
  url.search = originalParams.toString();
  return url.toString();
};
