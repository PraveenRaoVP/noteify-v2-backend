const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Note = require("./note");

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

userSchema.virtual("notes",{
    ref: "Note",
    localField: "_id",
    foreignField: "owner",
});

userSchema.methods.toJSON = () => {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.generateAuthToken = async () =>{
    const user = this;
    const token = jwt.sign({_id: user.id.toString()}, process.env.NOTEIFY_JTW_SECRET);

    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
}

userSchema.statics.findTheUser = async(username,passwd) => {
    const user = await User.findOne({username});
    if(!user) {
        throw new Error("User not found!");
    }

    const isMatch = await bcrypt.compare(passwd, user.password);
    if(!isMatch) {
        throw new Error("Unable to login.");
    }
    return user;
}

userSchema.pre('save', async (next) => {
    const user = this;
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;
