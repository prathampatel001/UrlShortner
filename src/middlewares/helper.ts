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