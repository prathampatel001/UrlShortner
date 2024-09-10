import mongoose, {Document, Schema } from "mongoose";

export interface UrlInterface extends Document{
    originalUrl: string;
    shortUrl:string;
    userId:mongoose.Types.ObjectId;
    advanceOptions: {
        passwordProtection: boolean;
        password?: string;
        expiresIn?: Date;//Enter no. of hrs Example- 1
        iosAndroidTargeting?: {
            enabled: boolean; // Indicates if iOS/Android targeting is enabled
            androidLink?: string; // URL for Android devices
            iosLink?: string; // URL for iOS devices
          };
    };
    
}

const urlSchema= new Schema<UrlInterface>({
    originalUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true,
    },
    advanceOptions: {
        passwordProtection: {
            type: Boolean,
            default: false, // Default to false (no password protection)
        },
        password: {
            type: String, // Optional field to store the password
            required: function () {
                return this.advanceOptions.passwordProtection; // Only required if password protection is enabled
            },
        },
        expiresIn: {
            type: Date,
        },
        iosAndroidTargeting: {
            enabled: {
              type: Boolean,
              default: false, // Default to false (no device targeting)
            },
            androidLink: {
              type: String, // Field to store the Android-specific URL
            },
            iosLink: {
              type: String, // Field to store the iOS-specific URL
            },
          },

    }
},{timestamps:true}

);

export const Url = mongoose.model<UrlInterface>('Url',urlSchema);
  
