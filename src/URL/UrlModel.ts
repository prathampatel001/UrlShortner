import mongoose, {Document, Schema } from "mongoose";

export interface UrlInterface extends Document{
    originalUrl: string;
    shortUrl:string;
    userId:mongoose.Types.ObjectId;
    advanceOptions: {
        passwordProtection: boolean;
        password?: string;
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
        required: true,
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
    }
},{timestamps:true}

);

export const Url = mongoose.model<UrlInterface>('Url',urlSchema);
  
