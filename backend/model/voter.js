import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';

const Salt_rounds = 10;
const voterSchema = new Schema({
    user_id: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
    },
    elections: [{
        type: String,
        required: true,
        index: {partialFilterExpression: { user_id: { $exists: true } } }
    }]
})




voterSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(Salt_rounds);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    } catch(err) {
        next(err);
    }
})

voterSchema.pre('findOneAndUpdate', async function(next) {
    const update = this.getUpdate();

    if (update?.$set && update?.$set.password) {
        try {
          const salt = await bcrypt.genSalt(Salt_rounds);
          const hash = await bcrypt.hash(update.$set.password, salt);
          this.getUpdate().$set.password = hash;
        } catch (error) {
          return next(error);
        }
      }
      next();
})


voterSchema.statics.login = async function(data) {
    const {username, password} = data;
    
    const user = await this.findOne({user_id: username});
   
    if(!user) {
        throw new Error('incorrect id');
    }

    // if(password !== user.password) {
    //     throw new Error('incorrect password');
    // }
    
    const isPassword = await bcrypt.compare(password,user.password);
    if(!isPassword) {
        throw new Error('incorrect password');
    }

    return user;
}

const Voter = new mongoose.model('Voter',voterSchema);

export default Voter;