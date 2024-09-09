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
    const clickCount = await Session.countDocuments({ url_id: urlDoc._id ,expired:false });

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
      {
        $facet: {
          urlData: [
            { $match: {} } // To allow for additional filtering if needed in the future
          ],
          totalCount: [
            { $count: 'totalDocuments' } // Count the total number of documents in the pipeline
          ],
        },
      },
    ]);

    // Extract data from the facet result
    const { urlData, totalCount } = urlClickData[0] || { urlData: [], totalCount: [] };

    res.status(200).json({
      message: 'All URLs and their click counts',
      data: urlData,
      totalCount: totalCount.length > 0 ? totalCount[0].totalDocuments : 0, // Get the total document count
    });
  } catch (error) {
    console.error('Error fetching all URLs and their click counts:', error);
    next(error);
  }
};



// GeoData
export const getGeoData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shortCode } = req.params;

    // Find the corresponding Url document using the shortUrl
    const urlDoc = await Url.findOne({ shortUrl: shortCode });

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


// ************* Filter *****************
// export const filterAnalyticsByTime= async(req:Request, res:Response, next:NextFunction) =>{
//   try {
//     const { startDate: startDateParam, endDate: endDateParam } = req.query; 

//     if (!startDateParam || !endDateParam) {
//             return res.status(400).json({ message: 'startDate and endDate are required' });
//     }

//     const startDate = new Date(startDateParam as string)
//     const endDate = new Date(endDateParam as string);

//     if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate < startDate) {
//       return res.status(400).json({ message: 'Invalid or inconsistent date range provided' });
//     }
//           // Find sessions within the specified custom date range
//           const sessions = await Session.find({
//             createdAt: { $gte: startDate, $lte: endDate },
//           });
      
//           res.status(200).json({
//             message: 'Filtered sessions by custom date range',
//             data: sessions,
//           });
//  }catch (error) {
//     console.error('Error filtering sessions by custom date range:', error);
//     next(error);
//   }
// };

export const filterAnalyticsByDeviceGeoInfoAndTimeStamp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { country, os, state,browser, startDate: startDateParam, endDate: endDateParam,  deviceType} = req.query; // Accept country, OS, startDate, and endDate as query parameters

    const filter: any = {};

    if (country) {
      filter['geoData.country'] = country;
    }
    if (state) {
      filter['geoData.state'] = state;
    }

    if (os) {
      filter['deviceInfo.os'] = os;
    }

    if (deviceType) {
      filter['deviceInfo.deviceType'] = deviceType;
    }

    if (browser) {
      filter['deviceInfo.browser'] = 
      browser;
    }

    // Handle date range filtering
    if (startDateParam && endDateParam) {
      const startDate = new Date(Number(startDateParam));
      const endDate = new Date(Number(endDateParam));

      // Validate that the startDate and endDate are valid dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate < startDate) {
        return res.status(400).json({ message: 'Invalid or inconsistent date range provided' });
      }

      // Add date range filter to the query
      filter['createdAt'] = { $gte: startDate, $lte: endDate };
    }

    // Find sessions that match the provided filters
    const sessions = await Session.find(filter);

    res.status(200).json({
      message: 'Filtered sessions by country, OS, and date range',
      data: sessions,
    });
  } catch (error) {
    console.error('Error filtering sessions by country, OS, or date range:', error);
    next(error);
  }
};

// export const filterAnalyticsByDeviceGeoInfoAndDate = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { country, os, state, browser, startDate: startDateParam, endDate: endDateParam, deviceType } = req.query; // Accept country, OS, state, browser, startDate, and endDate as query parameters

//     const filter: any = {};

//     if (country) {
//       filter['geoData.country'] = country;
//     }
//     if (state) {
//       filter['geoData.state'] = state;
//     }

//     if (os) {
//       filter['deviceInfo.os'] = os;
//     }

//     if (deviceType) {
//       filter['deviceInfo.deviceType'] = deviceType;
//     }

//     if (browser) {
//       filter['deviceInfo.browser'] = browser;
//     }

//     // Handle date range filtering with string input
//     if (startDateParam && endDateParam) {
//       const startDate = new Date(startDateParam as string);
//       const endDate = new Date(endDateParam as string);

//       // Validate that the startDate and endDate are valid dates
//       if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate < startDate) {
//         return res.status(400).json({ message: 'Invalid or inconsistent date range provided' });
//       }

//       // Add date range filter to the query
//       filter['createdAt'] = { $gte: startDate, $lte: endDate };
//     } else {
//       return res.status(400).json({ message: 'startDate and endDate are required as valid date strings' });
//     }

//     // Find sessions that match the provided filters
//     const sessions = await Session.find(filter);

//     res.status(200).json({
//       message: 'Filtered sessions by country, OS, device type, browser, and date range',
//       data: sessions,
//     });
//   } catch (error) {
//     console.error('Error filtering sessions by device, geographic information, or date range:', error);
//     next(error);
//   }
// };


