import Admin from "../model/admin.js";
import jwt from 'jsonwebtoken';
import Voter from "../model/voter.js";

const handleError = (error) => {
    const errorObj = {username:'',email:'',password:''}
    
    if(error.message === 'incorrect username'  || error.message == 'username already taken')  {
        errorObj.username = error.message;
    }

    if(error.message === 'email already exists') {
        errorObj.email = error.message;
    }

    if(error.message === 'incorrect password') {
        errorObj.password = error.message;
    }

    if(error.message.includes('Admin validation failed')) {
        Object.values(error.errors).forEach(({properties}) => {
            errorObj[properties.path] = properties.message;
        })
    }

    return errorObj;
}

const handleErrorVoter = (error) => {
    const errorObj = {user_id:"",password:""};

    if(error.message === 'incorrect id') {
        errorObj.user_id = error.message;
    }

    if(error.message === 'incorrect password') {
        errorObj.password = error.message;
    }

    return errorObj;
}


const login = async (req,res) => {
    try {
        const data = req.body;
        const user = await Admin.login(data);

        const accessToken = jwt.sign({id: user._id,role: 'admin'},process.env.JWT_ACCESS_SECRET,{expiresIn: '30m'});
        const refreshToken = jwt.sign({id: user._id,role: 'admin'},process.env.JWT_REFRESH_SECRET,{expiresIn: '1d'});
        res.cookie('jwt',refreshToken,{
            httpOnly: true,
            maxAge: 24 *60* 60 * 1000
        })
        res.status(200).json({accessToken,role:'admin'});
    } catch(err) {
        const errors = handleError(err);
        res.status(403).json(errors);
    }
}


const verify = (req,res) => {
    // console.log(req.cookies);
    const refreshToken = req.cookies?.jwt;
    
    if(!refreshToken) {
        res.status(403).json({msg: 'Access Denied'});
        return;
    } 

    try {

        jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET, async (err,decoded) => {
            if(err) {
                res.status(401).json({message:"Unauthorized"});
                return;
            }   
                const accessToken = jwt.sign(
                {id: decoded.id,role: decoded.role}
                ,process.env.JWT_ACCESS_SECRET,
                {expiresIn: '30m'});
                console.log("success");
        
                res.status(200).json({accessToken});
        })
    } catch (err) {
        res.status(401).json({message:"Unauthorized"});
    }
        
}


const loginVoter = async (req,res) => {
    try {
        const data = req.body;
        console.log(data);
        const user = await Voter.login(data); 

        const accessToken = jwt.sign({id: user._id,role:'voter'},process.env.JWT_ACCESS_SECRET,{expiresIn: '30m'});
        const refreshToken = jwt.sign({id: user._id,role: 'voter'},process.env.JWT_REFRESH_SECRET,{expiresIn: '1d'});
        res.cookie('jwt',refreshToken,{
            httpOnly: true,
            maxAge: 24 *60 *60 * 1000
        })
        res.status(200).json({accessToken,role:'voter'});
    } catch(err) {
        const errors = handleErrorVoter(err);
        res.status(403).json(errors);
    }
}


const register = async (req,res) => {
    try {
        const data = req.body;
        const user = await Admin.signup(data);
        const accessToken = jwt.sign({id: user._id,role:'admin'},process.env.JWT_ACCESS_SECRET,{expiresIn: '30m'});
        const refreshToken = jwt.sign({id: user._id,role: 'admin'},process.env.JWT_REFRESH_SECRET,{expiresIn: '1d'});
        res.cookie('jwt',refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        res.status(200).json({accessToken,role:'admin'});
    } catch(err) {
        const errors = handleError(err);
        res.status(500).json(errors);
    }
    
}


const logout = async (req,res) => {
   res.cookie('jwt','',{
    httpOnly: true,
    expires: new Date(0)
   })
   res.status(200).json({message: "Logged out successfully"});
}

const getVoterDetails = async (req,res) => {
    const userId = req.userId;
    const role = req.role;
    try {
        const user = await Voter.findById(userId,'-password');
        return res.status(200).json({...user._doc, role});
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}

const getAdminDetails = async (req,res) => {
    const userId = req.userId;
    const role = req.role;
    try {
        const user = await Admin.findById(userId,'-password');
        
        return res.status(200).json({...user._doc,role});
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}



export {login ,loginVoter, register,verify,logout,getAdminDetails,getVoterDetails};