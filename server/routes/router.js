const {Router} = require("express");
const jwt = require('jsonwebtoken');
const bycrypt = require("bcryptjs");
const USER = require("../schema/userSchema.js");
const router = Router();
const auth = require("../middleware/authentication.js");
const validator = require('email-validator');
const { sendVerificationCode } = require("../middleware/email.js");

function validateEmail(email) {
    return validator.validate(email);
  }

  //register route

router.post('/register',async(req,res)=>{
    
    try {
        const {fname , email , password} = req.body;
     if(!fname || !email || !password){
            return res.status(401).json({message : "All fields are required"});
     }else{
        if (!validateEmail(email)) {
           return res.status(400).json({ message: 'Invalid email address' });
          }
        const currUser = await USER.findOne({email:email});
        if(currUser){
            return res.status(401).json({message : "email is alreday registered"});
        }else{

            
            const newUser = new USER({
                fname:fname,
                email:email,
                password:password,
                
            })

            const result = await newUser.save();
            
            return res.status(200).json({message : "user registeration successfull"});
            
        }
     }
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
})

//login route

router.post('/login',async(req,res)=>{
    try {
        const {email ,password} = req.body;
        
        if(!email || !password){
            return res.status(401).json({message : "All fields are required"})
        }else{
            const existingUser = await USER.findOne({email:email});
            if(!existingUser){
                return res.status(401).json({message : "Email is not registered"})
            }else{
                const validCred =await bycrypt.compare(password,existingUser.password);
                if(!validCred){
                    return res.status(401).json({message : "Enter Valid Credentails."})
                }else{
                    //generate token in database
                    const token = await existingUser.generateAuthToken();
                        //send cookie to user
                    res.cookie("angular",token,{
                        httpOnly : true,
                        maxAge : 1*1000*60*60*24 //1 day
                        })
                    
                    return res.status(200).json({
                        message : "User login successfull",
                        token,
                        user: {
                            id: existingUser._id,
                            email: existingUser.email,
                            fname: existingUser.fname
                        }
                     })
                }
            }
        }

    } catch (error) {
        console.log(`Error : ${error}` );
        return res.status(400).json({Error : error.message});
    }
})

//home route

router.get('/home', auth, async (req, res) => {
    try {
        return res.status(200).json({
            name :req.name,
            message: `Welcome ${req.name} to the dashboard! `,
            user: req.user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

//logout route

router.post('/logout',auth,async(req,res)=>{
    try {

        const indexToken = req.user.tokens.findIndex((token)=>{
              return token === req.token;
        })
            req.user.tokens.splice(indexToken,1);
        await req.user.save();
        res.clearCookie("angular");
        return res.status(200).json({message : "User logout successfull"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
})

// sending verification code to email while clicking on verify email
router.post('/vermail', auth, async (req, res) => {
    try {
  
      const user = req.user;

      if(user.isVerified){
        return res.status(200).json({ message: "Email already Verified" });
      }

      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
            
            user.verificationCode = verificationCode;
            await user.save();
            sendVerificationCode(user.email,verificationCode);
  
        return res.status(200).json({ message: "OTP Send Successfully" });
      
  
    } catch (error) {
      console.log(`OTP verification failed: ${error}`);
      return res.status(500).json({ message: "OTP verification failed" }); 
    }
  });

  //send otp to email for forget password

  router.post('/sendotp',async(req,res)=>{
    try {
        const {email} = req.body;
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
           }
        if(!email){
            return res.status(400).json({message : "Email is required"});
        }
        const user = await USER.findOne({email:email});
        if(!user){
            return res.status(400).json({message : "Email is not registered"});
        }else{
            const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
            sendVerificationCode(email,verificationCode);
            user.verificationCode = verificationCode;
            await user.save();
            
            console.log( "this is code send when click on verifyEmail  "+verificationCode);
            return res.status(200).json({message : "OTP sent successfully"});
        }
    } catch (error) {
        return res.status(400).json({message : "Internal server error"});
    }
  })

    //forget password sumit route

  router.post('/forgetPassword',async(req,res)=>{
    try {
        
        const {email ,otp ,password} = req.body;
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
           }
        if(!email || !otp || !password){
            return res.status(400).json({message : "All fields are required"});
        }
        
        const user = await USER.findOne({email:email});
        if(!user){
            return res.status(400).json({message : "Email is not registered"});
        }else{
                if(user.verificationCode === otp){
                    user.password = password;
                    user.verificationCode = undefined;
                    await user.save();
                    return res.status(200).json({message : "Password updated successfully"});
        }else{
            return res.status(400).json({message : "Invalid OTP"});
        }
    }
    } catch (error) {
        return res.status(400).json({message : "Internal server error"});
    }
  })

    //verify email route (otp verification)

  router.post('/verifyEmail', auth, async (req, res) => {
    try {
        const user = req.user;
        const otp  = req.body.otp;

        if (user.isVerified) {
            return res.status(200).json({ message: "Email already verified" });
        }

        if (!otp) {
            return res.status(400).json({ message: "OTP is required" });
        }

        if (String(user.verificationCode) !== String(otp)) {
            return res.status(400).json({ message: "Incorrect OTP" });
        }

        user.isVerified = true;
        user.verificationCode = undefined; 
        await user.save();

        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error during OTP verification:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


  

module.exports = router;