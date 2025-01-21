import Voter from '../model/voter.js';
import csvToObject from './csvHandler.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import 'dotenv/config';
import Admin from '../model/admin.js';
import axios from 'axios';

console.log(process.env.USER,process.env.PASS);
let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
})


function createPassword(length = 10) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}
// fetching contract details
export const contractCredentials = async (req,res) => {
    const module = await import('../Ethereum/artifacts/contracts/Election.sol/ElectionFact.json',{
        assert: { type: 'json' } // Import assertion for JSON type
      });

      const module1 = await import('../Ethereum/artifacts/contracts/Election.sol/Election.json',{
        assert: { type: 'json' } // Import assertion for JSON type
      });
    const jsonObj = module.default;
    const jsonObj1 = module1.default;
    const { abi ,bytecode} = jsonObj;
    const {abi : abiContract} = jsonObj1;

    return res.status(200).send({abi,abiContract,bytecode});
}

const getAddressCheck = async (req,res) => {
  const {address} = req.body;
  try {
    const user = await Admin.findOne({address})
    if(!user) {
      res.status(200).json({msg: "address checked"});
    } else {
      res.status(200).json({msg: "address already present"});
    }

  } catch(err) {
    res.status(403).json({error: err.message});
  }
}
// converting csv files

const convertToObject = async (req,res) => {
  const csv = req.file;
  const {allowDuplicates} = req.body;
  try {
    if(!csv) {
      throw new Error('Please upload a file');
    }
  
    if(csv.mimetype !== 'text/csv' && csv.mimetype !== 'application/vnd.ms-excel') {
     throw new Error('Only csv files are allowed');
    }
    const data =  await csvToObject(csv.buffer,allowDuplicates === "true");
    res.status(200).json({name: csv.originalname,data});
  } catch(err) {
    console.log(err);
    res.status(403).json({error: err.message});
  }
}

const addVoter = async(obj) => {
  const {user_id, email ,contract,electionName} = obj;
    try {
      const user = await Voter.findOne({user_id});
      const tempPassword = createPassword(12);
    
      if(user) {
        if(email !== user.email) {
          await Voter.findOneAndUpdate({user_id},{email});
        }
        await Voter.findOneAndUpdate({user_id},{$push: {elections: contract}},{new: true});
        await Voter.findOneAndUpdate({user_id},{$set: {password: tempPassword}},{ new: true, runValidators: true, context: 'query' } );
      } else {
        await Voter.create({user_id,email,password: tempPassword,elections: [contract]});
      }


      console.log(user_id,tempPassword);

      sendMail({user_id,email,password:tempPassword,electionName},true);
    } catch(err) {
      throw new Error(err.message);
    }
}

// adding voters to database
const addVoters = async(req,res) => {
  const {data} = req.body;
  try {
    const promises = data.map((obj) => addVoter(obj));
    await Promise.all(promises);
    res.status(200).json({message: "Voter's added and mail sent"});
  } catch(err) {
    res.status(500).json({message:err.message});
  }
}


const configureMailResult = (data) => {
  const {name,email,electionName} = data;

  const mailOptions = {
    from: process.env.USER,
    to: `${email}`,
    subject: `Winner of ${electionName}`,
    html: `<!DOCTYPE html>
<html>
<head>
    <title>Congratulations! You are the winner 🎉</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9fdff; /* Background color */
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 30px;
            background-color: #ffffff; /* Container background color */
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
            text-align: center;
            color: #fff; /* Heading color */
            margin-bottom: 20px;
            font-size: 28px;
        }
        p {
            margin-bottom: 15px;
            line-height: 1.6;
            color: #1f546a; /* Text color */
        }
        .highlight {
            color: #1fd08c; /* Highlight color */
            font-weight: bold;
        }
        .emoji {
            font-size: 24px;
            margin-right: 5px;
        }
        .header {
            background-color: #1f546a; /* Header background color */
            color: #ffffff;
            text-align: center;
            padding: 20px;
            border-radius: 10px 10px 0 0;
        }
        .content {
            padding: 20px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #666666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Congratulations! You are the winner <span class="emoji">🎉</span></h2>
        </div>
        <div class="content">
            <p>Hello <span class="highlight">${name}</span> <span class="emoji">👋</span>,</p>
            <p>Congratulations on your victory in the election for the position of <span class="highlight">${electionName}</span>! You have made it through your hard work, dedication, and the support of the voters. <span class="emoji">🥳</span></p>
            <p>We believe that your leadership qualities and vision will contribute significantly to our community. Your victory is a testament to your capabilities and the trust that the electorate has placed in you. <span class="emoji">👍</span></p>
            <p>As you embark on this new journey, we encourage you to continue striving for excellence and serving with integrity. Together, we can achieve great things for our community. <span class="emoji">🌟</span></p>
            <p>Thank you for your commitment and willingness to make a difference. We look forward to seeing the positive impact you will make in your new role. <span class="emoji">🙏</span></p>
            <p>Best regards,</p>
            <p>The Election Committee</p>
        </div>
        <div class="footer">
            <p>The Election Committee.📋</p>
        </div>
    </div>
</body>
</html>`
  }

  return mailOptions;
}


const configureMail = (data,isVoter) => {

    if(isVoter) {
      const {user_id,email, password,electionName} = data;
      const mailOptionsVoter = {
        from: process.env.USER,
        to: `${email}`,
        subject: `Election credentials for ${electionName}`,
        html: `<html>
        <head>
            <title>Notification of Upcoming Election</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9fdff;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 30px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    text-align: center;
                    color: #1f546a;
                }
                p {
                    margin-bottom: 15px;
                    line-height: 1.6;
                    color: #1f546a;
                }
                .highlight {
                    font-weight: bold;
                    color: #1fd08c;
                }
                .steps {
                    margin-top: 20px;
                }
                .steps h3 {
                    margin-bottom: 10px;
                    color: #1f546a;
                }
                .steps ol {
                    list-style-type: decimal;
                    margin-left: 20px;
                    padding-left: 15px;
                    color: #666666;
                }
                .steps ol li {
                    margin-bottom: 5px;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #1f546a;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                }
                .button:hover {
                    background-color: #1fd08c;
                }
                .button:focus {
                    outline: none;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    color: #666666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Notification of Upcoming Election 🗳️</h2>
                <p>Hello Voter 👋,</p>
                <p>We would like to inform you about the upcoming election. Below are the details:</p>
                <ul>
                    <li><strong>Credentials:</strong></li>
                    <ul>
                        <li><strong>Voter ID:</strong> <span class="highlight">${user_id}</span> 🔍</li>
                        <li><strong>Password:</strong> <span class="highlight">${password}</span> 🔐</li>
                    </ul>
                <div class="steps">
                    <h3>Steps to Vote:</h3>
                    <ol>
                        <li>Log in using your Voter ID and Password.</li>
                        <li>Follow the instructions on the website to cast your vote.</li>
                        <li>Verify your choices and submit your vote.</li>
                        <li>Ensure you have successfully cast your vote before the deadline.</li>
                    </ol>
                </div>
                <p>We encourage you to exercise your right to vote. Thank you for your participation! 🙏</p>
                <p class="footer">Best regards,<br>The Election Committee 📋</p>
            </div>
        </body>
        </html>`,
      }

      return mailOptionsVoter;
    } else {
      const {name,email,electionName} = data;
      const mailOptionsCandidate = {
        from: process.env.USER,
        to: email,
        subject: `You are standing as a candidate for ${electionName}`,
        html: `
        <html>
        <head>
            <title>Notification of Eligibility</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9fdff;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 30px;
                    background-color: #ffffff;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    text-align: center;
                    color: #1f546a;
                }
                p {
                    margin-bottom: 15px;
                    line-height: 1.6;
                    color: #1f546a;
                }
                .highlight {
                    font-weight: bold;
                    color: #1f546a;
                }
                .emoji {
                    font-size: 20px;
                    margin-right: 5px;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    color: #666666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Notification of Eligibility 🎉</h2>
                <p>Hello <span class="highlight">${name}</span> 👋,</p>
                <p>We are pleased to inform you that you are eligible to participate in the upcoming election for the position of <span class="highlight">${electionName}</span>. 🗳️</p>
                <p>Please make sure to review the election guidelines and deadlines provided. We look forward to your participation. 🙏</p>
                <p class="footer">Thank you, <br>The Election Committee 🗂️</p>
            </div>
        </body>
        </html>
        `,
      }

      return mailOptionsCandidate;
    }
  }

// emailing voters and candidates
const sendMail = (details,isVoter) => {
  const mailOptions = configureMail(details,isVoter);

  transporter.sendMail(mailOptions,(err,info) => {
    if(err) {
      throw new Error(err);
    } 
    console.log(`Message sent:${info.response}`); 
  })
}

const sendResultMail = (details) => {
  const mailOptions = configureMailResult(details);

  transporter.sendMail(mailOptions,(err,info) => {
    if(err) {
      throw new Error(err);
    }

    console.log(`Message Sent:${info.response}`);
  })
}



const mailToCandidate = async (req,res) => {
  const {details,isResult} = req.body;

  try {
    if(isResult) {
      sendResultMail(details);
    } else {
      sendMail(details,false);
    }
    res.status(200).json({message: "email sent successfully"});
  } catch(err) {
    res.status(500).json({message: err.message});
  }
}


// adding contract and address details 
const updateContract = async (req,res) => {
  const {username,details} = req.body;

  try {
    const {address,contract} = details;
    const user = await Admin.findOne({username});
    // const userAddress = await Admin.findOne({address});
    
    if(address && user?.address) {
      if(address !== user.address) {
        throw new Error("Address Error");
      }
    }
    if(!user?.address && address) {
      await Admin.updateOne({username},{address});
    } 
    await Admin.findOneAndUpdate({username},{$push: {elections: contract}},{new: true});

    res.status(200).json({message: "updated successfully"});
  } catch(err) {
    res.status(500).json({message:err.message});
  }
}

const getVoters = async (req,res) => {
  const {contract} = req.body;

  try {
    const voters = await Voter.find({elections: {$in: [contract]}}, { user_id: 1, email: 1, _id: 0 });
    console.log(voters);
    res.status(200).json({voters});
  } catch(err) {
    res.status(500).json({message: err.message});
  }
}
const getContract = async (req,res) => {
  const {username} = req.body;

  try {
      const {address, elections} = await Admin.findOne({username});

      if(address && elections) {
        res.status(200).json({address,elections});
      } else {
        throw new Error("Details not found");
      }

  } catch(err) {
    res.status(500).json({message:err.message});
  }
}

const getImageUpload = async (req,res) => {
  const image = req.file;

  try {
    if(!image) {
      throw new Error("image not uploaded");
    }

    const formData = new FormData();
    formData.append("image",req.file.buffer.toString('base64'));
    const response  = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMAGE_API}`,formData);
    console.log(response.data);
    res.status(200).json({url: response.data.data.url});

  } catch(err) {
    res.status(500).json({message: err.message});
  }
}

// fetching contract and address details

export  {
  addVoters,
  convertToObject,
  updateContract,
  getImageUpload,
  getContract,
  getVoters,
  mailToCandidate,
  getAddressCheck
}