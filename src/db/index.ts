import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        console.log(process.env.MONGO_URI )
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        throw new Error(`Error: ${(error as Error).message}`);
    }
};

export default connectDB;