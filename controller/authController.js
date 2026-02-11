import bcrypt from "bcryptjs";
import { userModel } from "../model/userModel.js";
import { generateToken } from "../utils/token.js";

export const register = async(req,res)=>{
    try{
        const {name , email,password }=req.body;

        const existingUser= await userModel.findOne({email:email})
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"Email already registered!"
            })
        }

        const hashPassword = await bcrypt.hash(password,10)
        const userDetails = await userModel.create({
            name,
            email,
            password:hashPassword
        })
        return res.status(200).json({
            success:true,
            message:"Acoount created Succesfully",
            userDetails
        })


    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Failed to register"
        })

    }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Email not found"
      });
    }

    const decryptPassword = await bcrypt.compare(password, existingUser.password);
    if (!decryptPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect credentials"
      });
    }

    const accessToken = generateToken({
      userId: existingUser._id,
      email: existingUser.email
    });

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict"
      })
      .json({
        success: true,
        message: `Welcome back ${existingUser.name} do good`,
        user: existingUser,
        accessToken
      });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to login"
    });
  }
};
