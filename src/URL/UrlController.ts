import { Request, Response, NextFunction } from 'express';
import { Url } from '../URL/UrlModel'; // Adjust the path to your model as necessary
import bcrypt from 'bcrypt'; 
import crypto from 'crypto'; // We'll use this to generate a unique short URL code



// Function to generate a unique short URL code
const generateShortUrl = (length: number = 6): string => {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  };

export const createShortUrl = async (req: Request, res: Response, next: NextFunction) => {

  const SALT_ROUNDS = 10; 
  try {

    // Retrieve the originalUrl, userId, and optional fields from the request body
    const { originalUrl, userId, advanceOptions } = req.body;

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

     // Prepare the advance options data
     const options: any = {
      passwordProtection: advanceOptions?.passwordProtection || false,
    };

    if (advanceOptions?.passwordProtection) {
      if (!advanceOptions.password) {
        return res.status(400).json({ message: 'Password is required for password protection' });
      }
      const hashedPassword = await bcrypt.hash(advanceOptions.password, SALT_ROUNDS);
      options.password = hashedPassword; // Save the hashed password
    }

    // Create and save the new URL with optional password protection
    const newUrl = new Url({
      originalUrl,
      shortUrl,
      userId,
      advanceOptions:options
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

export const getShortUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { password } = req.body; // Retrieve password from request body if provided
  
      // Find the corresponding Url document using the shortUrl
      const urlDoc = await Url.findOne({ shortUrl: id });
  
      if (!urlDoc) {
        return res.status(404).json({ message: 'Short URL not found' });
      }
  

      const { advanceOptions } = urlDoc;

    // Check if password protection is enabled
    if (advanceOptions?.passwordProtection) {
      // Verify if the correct password is provided
      if (!password) {
        return res.status(403).json({ message: 'Password is required' });
      }

      // Compare the provided password with the hashed password stored in the database
      const isMatch = await bcrypt.compare(password, advanceOptions.password || '');
      if (!isMatch) {
        return res.status(403).json({ message: 'Incorrect password' });
      }
    }

      // If no password protection or correct password is provided, redirect to the original URL
      res.redirect(urlDoc.originalUrl);
    } catch (error) {
      console.error('Error retrieving short URL:', error);
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
  
  
  