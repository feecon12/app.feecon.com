import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        require:true,
    },
    email: {
        type: String,
        require: true,
    },
    phone: {
        type: Number,
        require: true,
    },
    password: {
        type: String,
        require:true,
    }
})

const User = mongoose.model("User", UserSchema);

export default User;