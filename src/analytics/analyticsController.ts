import express, { Request, Response, NextFunction } from 'express';
import { Url } from '../URL/UrlModel';
import { Session } from '../session/sessionModel';



 export  const singleUrlCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const urlDoc = await Url.findOne({ shortUrl: id });

    if (!urlDoc) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    // Get the number of sessions (clicks) associated with this URL
    const clickCount = await Session.countDocuments({ url_id: urlDoc._id });

    res.status(200).json({
      originalUrl: urlDoc.originalUrl,
      shortUrl: urlDoc.shortUrl,
      clicks: clickCount,
    });
  } catch (error) {
    console.error('Error fetching URL clicks:', error);
    next(error);
  }
};

export const getAllUrlCounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Use aggregate to join the Url collection with the Session collection and count clicks
    const urlClickData = await Url.aggregate([
      {
        $lookup: {
          from: 'sessions', // The name of the Session collection
          let: { urlId: '$_id' }, // Define a variable for the local field to use in the pipeline
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$url_id', '$$urlId'] }, // Match the url_id with the Url _id
                    { $eq: ['$expired', false] }, // Match where expired is false
                  ],
                },
              },
            },
          ],
          as: 'sessionData', // Alias for the joined data
        },
      },
      {
        $project: {
          originalUrl: 1,
          shortUrl: 1,
          clicks: { $size: '$sessionData' }, // Count the number of non-expired sessions
        },
      },
    ]);

    res.status(200).json({
      message: 'All URLs and their click counts',
      data: urlClickData,
    });
  } catch (error) {
    console.error('Error fetching all URLs and their click counts:', error);
    next(error);
  }
};


// GeoData
export const getGeoData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Find the corresponding Url document using the shortUrl
    const urlDoc = await Url.findOne({ shortUrl: id });

    if (!urlDoc) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    // Aggregate the number of clicks by country, state, and city
    const geoData = await Session.aggregate([
      { $match: { url_id: urlDoc._id,expired: false, } },
      {
        $group: {
          _id: {
            country: '$geoData.country',
            state: '$geoData.state',
            city: '$geoData.city'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.country',
          states: {
            $push: {
              state: '$_id.state',
              city: '$_id.city',
              count: '$count'
            }
          },
          total: { $sum: '$count' }
        }
      }
    ]);

    res.status(200).json({
      originalUrl: urlDoc.originalUrl,
      shortUrl: urlDoc.shortUrl,
      geoData: geoData.map((item) => ({
        country: item._id,
        total: item.total,
        details: item.states
      })),
    });
  } catch (error) {
    console.error('Error fetching GeoData:', error);
    next(error);
  }
};

export const getDeviceData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Find the corresponding Url document using the shortUrl
    const urlDoc = await Url.findOne({ shortUrl: id });

    if (!urlDoc) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    // Aggregate the device data by country, state, and city
    const deviceData = await Session.aggregate([
      { $match: { url_id: urlDoc._id ,expired:false} },
      {
        $group: {
          _id: {
            country: '$geoData.country',
            state: '$geoData.state',
            city: '$geoData.city',
            platform: '$deviceInfo.deviceType',
            os: '$deviceInfo.os',
            browser: '$deviceInfo.browser'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: {
            country: '$_id.country',
            state: '$_id.state',
            city: '$_id.city'
          },
          total: { $sum: '$count' },
          devices: {
            $push: {
              platform: '$_id.platform',
              os: '$_id.os',
              browser: '$_id.browser',
              count: '$count'
            }
          }
        }
      },
      {
        $group: {
          _id: '$_id.country',
          states: {
            $push: {
              state: '$_id.state',
              city: '$_id.city',
              total: '$total',
              devices: '$devices'
            }
          }
        }
      }
    ]);

    res.status(200).json({
      originalUrl: urlDoc.originalUrl,
      shortUrl: urlDoc.shortUrl,
      deviceData: deviceData.map((item) => ({
        country: item._id,
        details: item.states
      })),
    });
  } catch (error) {
    console.error('Error fetching DeviceData:', error);
    next(error);
  }
};


//Redirected to our website
export const getPromotionalWebsiteVisitInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Use aggregate to join the Url collection with the Session collection and count clicks
    const urlClickData = await Url.aggregate([
      {
        $lookup: {
          from: 'sessions', // The name of the Session collection
          let: { urlId: '$_id' }, // Define a variable for the local field to use in the pipeline
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$url_id', '$$urlId'] }, // Match the url_id with the Url _id
                    { $eq: ['$expired', true] }, // Match where expired is false
                  ],
                },
              },
            },
          ],
          as: 'sessionData', // Alias for the joined data
        },
      },
      {
        $project: {
          originalUrl: 1,
          shortUrl: 1,
          clicks: { $size: '$sessionData' }, // Count the number of non-expired sessions
        },
      },
    ]);

    res.status(200).json({
      message: 'All URLs and their click counts',
      data: urlClickData,
    });
  } catch (error) {
    console.error('Error fetching all URLs and their click counts:', error);
    next(error);
  }
};
