import connectDb from "@/db";

async function handler(req, res) {
  try {
    const db = await connectDb;
    console.log("Database connected successfully!");
  } catch (error) {
    console.log("Error connecting to database", error);
    res.status(500).json({
      status:500,
      message: "Error connecting to database"
    });
  }
}

export default handler;
