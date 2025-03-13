import jwt from "jsonwebtoken"


export const generateTokens = (userid, res) => {
    const token = jwt.sign({ userid }, process.env.JWT_SECRET, {
        expiresIn:"7d"
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,//ms
        httpOnly: true, // prevent xss attacks
        sameSite: "strict",//CRSF attacks
        secure:process.env.NODE_ENV !== "development"
    })
    return token
}