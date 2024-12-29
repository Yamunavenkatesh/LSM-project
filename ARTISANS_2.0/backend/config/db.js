const mongoose=require("mongoose");


const uri = "mongodb+srv://inayath2410:5VI8hKdvOyihjKxM@cluster0.sdncs.mongodb.net/artisians?retryWrites=true&w=majority";

const connectDB = async (cb) => {
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connect");

    if (cb) cb(); 
  } catch (error) {
    console.error("MongoDB connect error: " + error);
    process.exit(1);
  }
};



module.exports=connectDB;