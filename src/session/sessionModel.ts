import mongoose, { Document, Schema } from "mongoose";

export interface SessionInterface extends Document {
    url_id: mongoose.Types.ObjectId;
    userIP:string;
    ipv4:string,
    ipv6:string,


    geoData: {
        long_lat:string;
        country: string;
        countryCode: string;
        state: string;
        stateCode: string;
        city: string;
        timezone:string;
    };
    deviceInfo: {
        userAgent:string;
        deviceType: string;//Desktop or Mobile
        os: string;
        browser: string;
    };
    expired:boolean,
    advanceOptions?: {
        passwordProtection?: boolean; 
        password?: string; 
      };
}

// Create the schema for the Session
const sessionSchema = new Schema<SessionInterface>({
    url_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Url', // Reference to the Url model
        required: true,
    },
    userIP: {
        type: String,
    },
    ipv4: {
        type: String,
    },
    ipv6: {
        type: String,
        required: false, // IPv6 may not always be available
    },
    geoData: {
        long_lat: { type: String},
        country: { type: String },
        countryCode: { type: String},
        state: { type: String},
        stateCode: { type: String},
        city: { type: String},
        timezone: { type: String},
    },
    deviceInfo: {
        userAgent: { type: String},
        deviceType: { type: String}, // e.g., Mobile, Desktop
        os: { type: String}, // e.g., Windows, macOS
        browser: { type: String }, // e.g., Chrome, Safari
    },
    expired:{
        type: Boolean,
    },
    advanceOptions: {
        passwordProtection: {
          type: Boolean, // Indicates if password protection is enabled
          default: false,
        },
        password: {
          type: String, // Optional field to store the hashed password
        },
      },
}, { timestamps: true });

export const Session = mongoose.model<SessionInterface>('Session', sessionSchema);