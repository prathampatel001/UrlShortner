import { Request, Response, NextFunction } from 'express';
import { Url } from '../URL/UrlModel'; // Adjust the path to your model as necessary
import mongoose from 'mongoose';
import {UserDocument} from "../auth/authModel"
import crypto from 'crypto'; // We'll use this to generate a unique short URL code
import { AuthenticatedRequest } from '../middlewares/auth';


// Function to generate a unique short URL code
const generateShortUrl = (length: number = 6): string => {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  };

export const createShortUrl = async (req:Request, res: Response, next: NextFunction) => {
    try {

         // Retrieve the originalUrl from the request body
    const { originalUrl,userId} = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: 'Original URL is required' });
    }
  
      // Generate a unique short URL code
      let shortUrl = generateShortUrl();
  
      // Ensure the generated short URL is unique
      let existingUrl = await Url.findOne({ shortUrl });
      while (existingUrl) {
        shortUrl = generateShortUrl();
        existingUrl = await Url.findOne({ shortUrl });
      }
  
      // Create and save the new URL
      const newUrl = new Url({
        originalUrl,
        shortUrl,
        userId
      });
  
      await newUrl.save();
  
      res.status(201).json({
        message: 'Short URL created successfully',
        data: newUrl,
      });
    } catch (error) {
      console.error('Error creating short URL:', error);
      next(error);
    }
  };

export const deleteShortUrlById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
  
      // Find and delete the URL document by its ID
      const deletedUrl = await Url.findByIdAndDelete(id);
  
      if (!deletedUrl) {
        return res.status(404).json({ message: 'Short URL not found' });
      }
  
      res.status(200).json({
        message: 'Short URL deleted successfully'

      });
    } catch (error) {
      console.error('Error deleting short URL:', error);
      next(error);
    }
  };

// export const updateUrlById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     try {
//       const { id } = req.params;
//       const { OriginalUrl } = req.body;
  
//       if (!OriginalUrl) {
//         return res.status(400).json({ message: 'New original URL is required' });
//       }
  
//       // Find and update the URL document by its ID
//       const updatedUrl = await Url.findByIdAndUpdate(
//         id,
//         { originalUrl: OriginalUrl },
//         { new: true }
//       );
  
//       if (!updatedUrl) {
//         return res.status(404).json({ message: 'Short URL not found' });
//       }
  
//       res.status(200).json({
//         message: 'Short URL updated successfully',
//         data: updatedUrl,
//       });
//     } catch (error) {
//       console.error('Error updating short URL:', error);
//       next(error);
//     }
//   };
  

export const updateUrlById = async (req:Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { originalUrl } = req.body; // Ensure this matches your request payload
  
      if (!originalUrl) {
        return res.status(400).json({ message: 'New original URL is required' });
      }
  
      // Find and update the URL document by its ID
      const updatedUrl = await Url.findByIdAndUpdate(
        id,
        { originalUrl}, // Use lowercase `originalUrl`
        { new: true }
      );
  
      if (!updatedUrl) {
        return res.status(404).json({ message: 'Short URL not found' });
      }
  
      res.status(200).json({
        message: 'Short URL updated successfully',
        data:updatedUrl
      });
    } catch (error) {
      console.error('Error updating short URL:', error);
      next(error);
    }
  };
  
  
  