import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const connectDB = async () => {

    try{
        await mongoose.connect("mongodb+srv://Sanjayan_V:zk3ZRT2BqQrUlkTX@fullstack-progress.oyzsz.mongodb.net/");
        console.log("Mongo connected");
    }
    catch(error)
    {
        console.log(`Error in connecting db:${error}`);
        process.exit(1);
    }
}
export default connectDB;