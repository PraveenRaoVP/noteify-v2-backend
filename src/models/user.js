const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ]
},
    {
        timestamps: true
    }
);

userSchema.methods.generateAuthToken = async () =>{
    const user = this;
    const token = jwt.sign({_id: user.id.toString()}, process.env.NOTEIFY_JTW_SECRET);

    user.tokens = users.tokens.concat({token});
    await user.save();

    return token;
}

userSchema.statics.findTheUser = async(username,passwd) => {
    const user = await User.findOne({username});
    if(!user) {
        throw new Error("User not found!");
    }
    return user;
}


const User = mongoose.model("User", userSchema);

module.exports = User;
