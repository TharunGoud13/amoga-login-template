import { NextRequest, NextResponse } from "next/server";

const TWO_FACTOR_API_KEY = process.env.TWO_FACTOR_API_KEY as string;
const BASE_URL = "https://2factor.in/API/V1/";

export async function POST(req:NextRequest) {
    
    const {mobile} = await req.json();

    if(!mobile){
        return NextResponse.json({message: "Mobile number is required"}, {status:400})
    }

    const url = `${BASE_URL}${TWO_FACTOR_API_KEY}/SMS/${mobile}/AUTOGEN`;


    try{
        const response = await fetch(url);
        const data = await response.json();

        if(data.Status === "Success"){
            return NextResponse.json({sessionId: data.Details}, {status: 200})
        } else {
            return NextResponse.json({message: "Failed to send verification code"}, {status: 500})
        }
    }
    catch(error){
        return NextResponse.json({message: "Something went wrong, please try again"}, {status: 500})
    }
}