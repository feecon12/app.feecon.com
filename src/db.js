import mongoose from "mongoose";

async function connectDb(){
  await mongoose.connect(process.env.DB_URL),
    then(() => {
      console.log("Connection Successful to DB! ");
    }).catch((error) => {
      console.log("Database Connection Failed",error);
    });
};

export default connectDb;
