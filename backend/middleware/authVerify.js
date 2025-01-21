import jwt from 'jsonwebtoken';
import 'dotenv/config';


const access = (role) => {
    return (req,res,next) => {
    const accessToken = req.headers?.authorization?.split(' ')[1];
    if(!accessToken) {
        res.status(403);
        throw new Error('Access Denied');
    }

    jwt.verify(accessToken,process.env.JWT_ACCESS_SECRET, (err,decoded) => {
        if(err) {
            console.log(accessToken);
            return res.status(401).json({message:"Unauthorized"});
        } 
        if(decoded.role !== role) {
            return res.status(401).json({message:"Unauthorized"});
        }
        req.userId = decoded.id;
        req.role = decoded.role;
       
        next();
    })
    }
}
export {access};