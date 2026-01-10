import mongoose from 'mongoose'; // Change from 'require' to 'import'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Error: ${error.message}`);
    process.exit(1); 
  }
};

export default connectDB; // Change from 'module.exports' to 'export default'c