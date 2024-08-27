
import mongoose,{Document, Schema} from "mongoose";

export interface UserDocument extends Document{
    email:string;
    password:string;
}

const UserSchema : Schema = new Schema({
    email:{type: String, required: true,unique: true},
    password:{type: String , Required: true},
});

const User=mongoose.model<UserDocument>("User", UserSchema)
export default User;
