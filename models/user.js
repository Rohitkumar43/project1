// // make a shema in this and conect woth the mongoDb and this model is for the register page 
// const { createHmac , randomBytes } = require("crypto");
// const {Schema , model} = require("mongoose");

// const userSchema = new Schema({
//     fullName: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required : true,
//     },
//     profileImageURL:{
//         type: String,
//         default: "/image/5856.jpg",
//     },
//     role: {
//         type: String,
//         enum: ["USER", "ADMIN"],// it only for the user and only for the admin 
//         default: "USER"
//     }, 
// } , 
// {timestamps: true}
// )

// const User = model('user' , userSchema);

// // used this pre --> study  it in detail as a middlewre
// // userSchema.pre('save' , function(next) {
// //     const user = this;

// //     if(!user.isModified("password") || !user.salt) return next();
// //     // genrate a new salt 
// //     const salt = 10;
// //     // Hash the password using the salt 
// //     const hassPassword =createHmac("sha256" , salt)
// //     .update(this.password)
// //     .digest("hex");

// //     // Assign the salt and the hashed password to the user 
// //     this.salt = salt;
// //     this.password =hassPassword;

// // })

// userSchema.pre('save', function(next) {
//     if (!this.isModified("password") || !this.salt) return next();

//     // Generate a new salt
//     const salt = randomBytes(16).toString('hex');
//     // Hash the password using the salt
//     const hashedPassword = createHmac("sha256", salt)
//         .update(this.password)
//         .digest("hex");

//     // Assign the salt and the hashed password to the user
//     this.salt = salt;
//     this.password = hashedPassword;
//     next();
// });
// module.exports = User;

const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String, 
    },
    profileImageURL: {
        type: String,
        default: "/image/5856.jpg",
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    try {
        // Only hash the password if it is modified or is new
        if (!this.isModified("password")) return next();
        
        // Generate a new salt only if it doesn't exist
        if (!this.salt) {
            const saltRounds = 10;
            this.salt = await bcrypt.genSalt(saltRounds);
        }
        
        // Hash the password using the salt
        const hashedPassword = await bcrypt.hash(this.password, this.salt);
        
        // Save the hashed password
        this.password = hashedPassword;
        
        next();
    } catch (error) {
        next(error);
    }
});

// WRITE A FXN TO HASH THE PASSWORD FOR THE FIVEN EMAIL , IN THE SIGNIN PAGE 

userSchema.static('matchpasswordandCreateToken' , async function(email , password){
    const user = await this.findOne({email});
    if(!user) throw new Error("User not Found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvideHash = await bcrypt.compare(password , hashedPassword);

    if ( !userProvideHash){
        throw new Error("Incorrect password");
    }
    //throw new Error("Incorrect password");

    const token = createTokenForUser(user);
    return token; 
});

const User = model('user', userSchema);
module.exports = User;