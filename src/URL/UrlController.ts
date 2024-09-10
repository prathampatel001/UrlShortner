import { Request, Response, NextFunction } from 'express';
import { Url } from '../URL/UrlModel'; // Adjust the path to your model as necessary
import bcrypt from 'bcrypt'; 
import { getUniqueShortUrl, isValidUrl ,generateShortUrl, appendQueryParamsToUrl} from '../middlewares/helper';

const SALT_ROUNDS = 10; 

export const createShortUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { originalUrl, userId, advanceOptions } = req.body;
  
      if (!originalUrl || !isValidUrl(originalUrl)) {
        return res.status(400).json({ message: 'Invalid or missing original URL' });
      }
  
      const shortUrl = await getUniqueShortUrl();
      const options: any = { passwordProtection: advanceOptions?.passwordProtection || false };
  
      if (advanceOptions?.passwordProtection) {
        if (!advanceOptions.password) {
          return res.status(400).json({ message: 'Password is required' });
        }
        options.password = await bcrypt.hash(advanceOptions.password, SALT_ROUNDS);
      }
  
      if (advanceOptions?.expiresIn) {
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + advanceOptions.expiresIn);
        options.expiresIn = expiryDate;
      }

      if(advanceOptions?.iosAndroidTargeting?.enabled){
        if(!advanceOptions.iosAndroidTargeting.androidLink || !advanceOptions.iosAndroidTargeting.iosLink){
          return res.status(400).json({
            message:"Android and IOS both links are required"
          });
        }

       
        options.iosAndroidTargeting = {
        enabled: true,
        androidLink: advanceOptions.iosAndroidTargeting.androidLink,
        iosLink: advanceOptions.iosAndroidTargeting.iosLink,
      };
      }
  
      const newUrl = new Url({ originalUrl, shortUrl, userId, advanceOptions: options });
      await newUrl.save();
  
      res.status(201).json({ message: 'Short URL created successfully', data: newUrl });
    } catch (error) {
      console.error('Error creating short URL:', error);
      next(error);
    }
  };

export const createShortUrlNoLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
  
      const { originalUrl, userId, advanceOptions } = req.body;
  
      if (!originalUrl || !isValidUrl(originalUrl)) {
        return res.status(400).json({ message: 'Invalid or missing original URL' });
      }
  
      const shortUrl = await getUniqueShortUrl();
    
      // Create and save the new URL with optional password protection
      const newUrl = new Url({
        originalUrl,
        shortUrl,
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


export const getShortUrlWithPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { password } = req.body; // Retrieve password from request body if provided
  
      // Find the corresponding Url document using the shortUrl
      const urlDoc = await Url.findOne({ shortUrl: id });
  
      if (!urlDoc) {
        return res.status(404).json({ message: 'Short URL not found' });
      }
  

      const { advanceOptions } = urlDoc;
      const PromotionalWebsiteLink='https://www.atomostech.com/';

      if(advanceOptions?.expiresIn && new Date() > advanceOptions.expiresIn) {
        return res.status(410).send({message:"Url Expired...Redirecting"})
      }

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

    if (advanceOptions?.iosAndroidTargeting?.enabled) {
      if (!advanceOptions.iosAndroidTargeting.androidLink || !advanceOptions.iosAndroidTargeting.iosLink) {
        return res.status(400).json({
          message: 'Both Android and iOS links are required when iOS/Android targeting is enabled.',
        });
      }
    }

    // Detect the user's device type from the request headers
    const userAgent = req.headers['user-agent']?.toLowerCase();

    let redirectUrl = urlDoc.originalUrl; // Default to the original URL

    // Check if iOS/Android targeting is enabled and perform redirection
    if (advanceOptions?.iosAndroidTargeting?.enabled) {
      if (userAgent) {
        if (/android/.test(userAgent) && advanceOptions.iosAndroidTargeting.androidLink) {
          // Redirect to the Android-specific link if it exists
          redirectUrl = advanceOptions.iosAndroidTargeting.androidLink;
        } else if (/iphone|ipad|ipod/.test(userAgent) && advanceOptions.iosAndroidTargeting.iosLink) {
          // Redirect to the iOS-specific link if it exists
          redirectUrl = advanceOptions.iosAndroidTargeting.iosLink;
        }
      }
    }

    redirectUrl = appendQueryParamsToUrl(urlDoc.originalUrl, req.query); 
    // res.redirect(redirectUrl)
 
    res.json({redirectUrl})
    } catch (error) {
      console.error('Error retrieving short URL:', error);
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
    const PromotionalWebsiteLink = 'https://www.atomostech.com/';

    // Check if the URL is expired
    if (advanceOptions?.expiresIn && new Date() > advanceOptions.expiresIn) {
      // Send an HTML response with a message and redirect after a few seconds
      return res.status(410).send({message:"Url Expired...Redirect to the Website"})
       
    }

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

    if(advanceOptions?.iosAndroidTargeting?.enabled){
      if(!advanceOptions.iosAndroidTargeting.androidLink || !advanceOptions.iosAndroidTargeting.iosLink){
        return res.status(400).json({
          message:"Android and IOS both links are required"
        });
      }
    }

    
    // Detect the user's device type from the request headers
    const userAgent = req.headers['user-agent']?.toLowerCase();

    let redirectUrl = urlDoc.originalUrl; // Default to the original URL

    // Check if iOS/Android targeting is enabled and perform redirection
    if (advanceOptions?.iosAndroidTargeting?.enabled) {
      if (userAgent) {
        if (/android/.test(userAgent) && advanceOptions.iosAndroidTargeting.androidLink) {
          // Redirect to the Android-specific link if it exists
          redirectUrl = advanceOptions.iosAndroidTargeting.androidLink;
        } else if (/iphone|ipad|ipod/.test(userAgent) && advanceOptions.iosAndroidTargeting.iosLink) {
          // Redirect to the iOS-specific link if it exists
          redirectUrl = advanceOptions.iosAndroidTargeting.iosLink;
        }
      }
    }

    redirectUrl = appendQueryParamsToUrl(urlDoc.originalUrl, req.query); 
    res.status(201).json({
      message: 'Redirect to the Url',redirectUrl,
      advanceOptions: urlDoc.advanceOptions
    });
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

export const updateUrlById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { originalUrl, advanceOptions } = req.body;
  
      if (!originalUrl || !isValidUrl(originalUrl)) {
        return res.status(400).json({ message: 'New original URL is required and must be valid' });
      }
  
      const urlDoc = await Url.findById(id);
      if (!urlDoc) {
        return res.status(404).json({ message: 'URL not found' });
      }
  
      const updates: any = { originalUrl };
      if (advanceOptions) {
        const newAdvanceOptions: any = { ...urlDoc.advanceOptions };
        if (advanceOptions.passwordProtection !== undefined) {
          newAdvanceOptions.passwordProtection = advanceOptions.passwordProtection;
        }
  
        if (advanceOptions.password) {
          newAdvanceOptions.password = await bcrypt.hash(advanceOptions.password, SALT_ROUNDS);
        }
  
        if (advanceOptions.expiresIn) {
          const expiryDate = new Date();
          expiryDate.setHours(expiryDate.getHours() + advanceOptions.expiresIn);
          newAdvanceOptions.expiresIn = expiryDate;
        }

        // if (advanceOptions.iosAndroidTargeting) {
        //   // Validate that both links are provided if targeting is enabled
        //   if (
        //     advanceOptions.iosAndroidTargeting.enabled &&
        //     (!advanceOptions.iosAndroidTargeting.androidLink || !advanceOptions.iosAndroidTargeting.iosLink)
        //   ) {
        //     return res.status(400).json({
        //       message: 'Both Android and iOS links are required when iOS/Android targeting is enabled.',
        //     });
        //   }

        //   newAdvanceOptions.iosAndroidTargeting = {
        //     enabled: advanceOptions.iosAndroidTargeting.enabled,
        //     androidLink: advanceOptions.iosAndroidTargeting.androidLink,
        //     iosLink: advanceOptions.iosAndroidTargeting.iosLink,
        //   };
  
        // }

        if (advanceOptions.iosAndroidTargeting) {
          const { enabled, androidLink, iosLink } = advanceOptions.iosAndroidTargeting;
  
          // Validate that both links are provided if targeting is enabled
          if (enabled && (!androidLink || !iosLink)) {
            return res.status(400).json({
              message: 'Both Android and iOS links are required when iOS/Android targeting is enabled.',
            });
          }
  
          // Update targeting settings using a conditional operator
          newAdvanceOptions.iosAndroidTargeting = {
            enabled: enabled,
            androidLink: enabled ? androidLink : undefined, // set only when enabled is true
            iosLink: enabled ? iosLink : undefined,         
          };
        }
  
        updates.advanceOptions = newAdvanceOptions;
      }
  
      const updatedUrl = await Url.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedUrl) {
        return res.status(404).json({ message: 'Short URL not found' });
      }
  
      res.status(200).json({ message: 'Short URL updated successfully', data: updatedUrl });
    } catch (error) {
      console.error('Error updating short URL:', error);
      next(error);
    }
  };
  
  
  export const redirectToWebsite =async(req:Request,res:Response)=>{

    try {
      const {shortCode }=req.params
    
  
      // Find the corresponding Url document using the shortUrl
      const urlDoc = await Url.findOne({ shortUrl: shortCode });
  
      console.log(urlDoc)
  
      if (!urlDoc) {
        return res.status(404).json({ message: 'Short URL not found' });
      }
      const { advanceOptions } = urlDoc;
  
      if(advanceOptions?.expiresIn && new Date() > advanceOptions.expiresIn) {
        return res.status(410).send({message:"Url Expired...Redirecting"})
      }
      // Check if the URL is expired
      if (advanceOptions.passwordProtection===true) {
      return  res.redirect(`http://localhost:3000/password-protection/${shortCode}`)
      }
  
      const redirectUrl = appendQueryParamsToUrl(urlDoc.originalUrl, req.query); 
      // console.log(redirectUrl)
      // res.redirect(`https://pratham.com/${code}`)
      res.redirect(redirectUrl)
    } catch (error) {
      console.log("error in redirect",error);
    }
  }
  
  