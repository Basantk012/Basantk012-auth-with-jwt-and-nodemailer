const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = process.env.secretKey;


const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    verificationCode:{
        type:String,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
})

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password =await bcrypt.hash(this.password,12);
    }
    next();
})

userSchema.methods.generateAuthToken = async function () {
    try {
        
        const token = jwt.sign({ _id: this._id }, key,{expiresIn:1*1000*60*60*24});
        this.tokens = this.tokens.concat({ token });
        await this.save();
        return token;

    } catch (error) {
        console.error("Error generating auth token:", error);
        throw new Error("Token generation failed");
    }
};

const USER = mongoose.model("USER",userSchema);

module.exports = USER;