import bcrypt from  'bcryptjs';
import { NextResponse } from 'next/server';
import User from  '../../../../../models/users';


import connectToDatabase from '../../../../../lib/mongodb';

export async function POST(request: Request) {
    const {name,email,password,confirmPassword} =await request.json();

    const isValidEmail =(email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    if(!name || !email  || !password || !confirmPassword){
        return NextResponse.json({message: "All field are required"},{status:400})
    }
    if(!isValidEmail(email)){
        return NextResponse.json({message: "Invalid email"},{status:400})
    }
    if(confirmPassword !==password){
        return  NextResponse.json({message: "Password and confirm password must be same Ahsan"},{status:400})
    }
    if(password.length<6){
        return NextResponse.json({message: "Password must be at least 6 characters"},{status:400})
    }

    try {
        await connectToDatabase();
const existingUser=await User.findOne({ email });
if(existingUser){
    return NextResponse.json({message: "User already exist"},{status:400})
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
    email,
    name,
    password: hashedPassword,
    });
    await  newUser.save();
    return  NextResponse.json({message: "User created successfully"},{status:201})

}catch(error) {
return  NextResponse.json({message: "Error creating user"},{status:500})
    }
}

