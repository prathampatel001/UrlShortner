import { Request, Response, NextFunction } from 'express';
import { Url } from '../URL/UrlModel';
import { Session } from './sessionModel';
import { Country, State } from 'country-state-city';




export const sessionInfo = async (req:Request, res: Response, next: NextFunction) => {
  try {
  // Extract the shortUrl (id) from the route parameters
  const { id } = req.params;

  // Find the corresponding Url document using the shortUrl
  const urlDoc = await Url.findOne({ shortUrl: id });

  if (!urlDoc) {
      return res.status(404).json({ message: 'Short URL not found' });
  }

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
      country_time_details
  } = req.body;
  
    // Use the country-state-city library to get the full country and state names
    const countryFullName = Country.getCountryByCode(user_country)?.name || user_country;
    const stateFullName = State.getStateByCodeAndCountry(user_region, user_country)?.name || user_region;

  // Create a new session document
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
          browser: user_agent.split(' ')[user_agent.split(' ').length - 1] // A basic way to extract the browser name
      }
  });

  // Save the session to the database
  await newSession.save();

  

  // Return a success response
  res.redirect(urlDoc.originalUrl);
} catch (error) {
  console.error('Error saving session data:', error);
  next(error);
}
};
