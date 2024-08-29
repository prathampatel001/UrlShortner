import { Request, Response, NextFunction } from 'express';
import { Url } from '../URL/UrlModel';
import { Session } from './sessionModel';
import { Country, State } from 'country-state-city';
import bcrypt from 'bcrypt'; 


export const createSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract the shortUrl (id) from the route parameters
    const { id } = req.params;

    // Find the corresponding Url document using the shortUrl
    const urlDoc = await Url.findOne({ shortUrl: id });

    if (!urlDoc) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    // Expiry checker
    const { advanceOptions } = urlDoc;
    const PromotionalWebsiteLink = 'https://www.atomostech.com/';

    // Check if the URL has expired
    const isExpired = advanceOptions?.expiresIn && new Date() > advanceOptions.expiresIn;
    // const isExpired=true

    // Extract the session data from the request body
    const {
      ipv4,
      ipv6,
      user_ip_address,
      long_lat,
      user_country,
      user_city,
      user_region,
      user_agent,
      platform,
      device_type,
      country_time_details,
    } = req.body;

    // Use the country-state-city library to get the full country and state names
    const countryFullName = Country.getCountryByCode(user_country)?.name || user_country;
    const stateFullName = State.getStateByCodeAndCountry(user_region, user_country)?.name || user_region;

    // Check for password protection and store it
    const passwordProtectionData = advanceOptions?.passwordProtection
      ? {
          passwordProtection: true,
          password: advanceOptions.password,
        }
      : {
          passwordProtection: false,
        };

    // Create a new session document with all details
    const newSession = new Session({
      url_id: urlDoc._id,
      userIP: user_ip_address,
      ipv4: ipv4,
      ipv6: ipv6,
      geoData: {
        long_lat: long_lat,
        country: countryFullName,
        countryCode: country_time_details.timezoneData.countries[0],
        state: stateFullName,
        stateCode: user_region,
        city: user_city,
        timezone: country_time_details.timezone,
      },
      deviceInfo: {
        userAgent: user_agent,
        deviceType: device_type,
        os: platform,
        browser: user_agent.split(' ')[user_agent.split(' ').length - 1], // A basic way to extract the browser name
      },
      expired: isExpired,
      advanceOptions: {
        ...passwordProtectionData, // Spread operator to include password protection details
      },
    });

    // Save the session to the database
    await newSession.save();

    // If the URL is expired, redirect to the promotional website after saving the session
    if (isExpired) {
      return res.status(410).redirect(PromotionalWebsiteLink);
    }

    res.status(201).json({
      message: 'Session created successfully',
      sessionId: newSession._id,
    });
  } catch (error) {
    console.error('Error saving session data:', error);
    next(error);
  }
};


export const validatePassAndRedirect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    const sessionDoc = await Session.findById(id);

    if (!sessionDoc) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const urlDoc = await Url.findById(sessionDoc.url_id);

    if (!urlDoc) {
      return res.status(404).json({ message: 'Original URL not found' });
    }

    const { advanceOptions } = sessionDoc;

    // Check if password protection is enabled
    if (!advanceOptions?.passwordProtection) {
      return res.redirect(urlDoc.originalUrl);
    }

    // Compare the provided password with the hashed password stored in the session
    const isMatch = await bcrypt.compare(password, advanceOptions.password || '');
    if (!isMatch) {
      return res.status(403).json({ message: 'Incorrect password' });
    }

    // If the password is correct, redirect to the original URL
    res.redirect(urlDoc.originalUrl);
  } catch (error) {
    console.error('Error validating password and redirecting:', error);
    next(error);
  }
};

export const deleteSessionById= async (req:Request,res :Response, next: NextFunction)=>{
  try{
    const { id } = req.params;

    const deletedSession = await Session.findByIdAndDelete(id);

    if(!deletedSession){
      return res.status(404).json({message: "Session not found"});
    }

    res.status(200).json({
      message:"Session deleted Sucessfully"
    })

  }catch(error){
    console.error('Error deleting short URL:', error);
    next(error);
  }
};




