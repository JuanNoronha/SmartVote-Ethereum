import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import validator from 'validator';

const Salt_rounds = 10;
const adminSchema = new Schema({
    username :{
        type: String,
        required: [true,'Please enter username'],
        unique: true
    }, 
    password : {
        type: String,
        required: [true,'Please enter password'],
        minlength: [6,'Please enter password of atleast 6 characters']
    },
    email: {
        type: String,
        unique: true,
        required: [true,'Please enter email'],
        validate: [validator.isEmail,'Please enter a valid email']
    },
    elections: [
        {
            type: String,
            unique: true
        }
    ],
    address: {
        type: String,
        unique: true
    }
})

adminSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(Salt_rounds);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    } catch(err) {
        next(err);
    }
})


adminSchema.statics.signup = async function(data) {
    const {username,email} = data;

    const emailExists = await this.findOne({email});
    const usernameExists = await this.findOne({username});

    if(emailExists) {
        throw new Error('email already exists');
    }

    if(usernameExists) {
        throw new Error('username already taken');
    }

    return this.create(data);
} 


adminSchema.statics.login = async function(data) {
    const {username, password} = data;
    
    const user = await this.findOne({username});

    if(!user) {
        throw new Error('incorrect username');
    }

    const isPassword = await bcrypt.compare(password,user.password);
    if(!isPassword) {
        throw new Error('incorrect password');
    }

    return user;
}

const Admin = mongoose.model('Admin',adminSchema);

export default Admin;