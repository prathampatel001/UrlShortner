import mongoose, {Document, Schema } from "mongoose";

export interface UrlInterface extends Document{
    originalUrl: string;
    shortUrl:string;
    userId:mongoose.Types.ObjectId;
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
},{timestamps:true}

);

export const Url = mongoose.model<UrlInterface>('Url',urlSchema);
  
