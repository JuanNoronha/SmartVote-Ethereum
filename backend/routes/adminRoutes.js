import { Router } from "express";
import 'dotenv/config';
import {getAdminDetails, login, logout, register} from "../controllers/auth.js";
import { access } from "../middleware/authVerify.js";
import { addVoters, contractCredentials, convertToObject, getAddressCheck, getContract, getImageUpload, getVoters, mailToCandidate, updateContract } from "../controllers/actions.js";
import multer from "multer";


const storage = multer.memoryStorage();
const upload = multer({storage});


const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/getDetails',access('admin'),contractCredentials);
router.post('/setContract',access('admin'),updateContract);
router.post('/getContract',access('admin'),getContract);
router.post('/uploadImage',access('admin'),upload.single('image'),getImageUpload);
router.post('/getVoters',access('admin'),getVoters);
router.post('/sendMail',access('admin'),mailToCandidate);
router.post('/getAddress',access('admin'),getAddressCheck);
router.post("/addvoter",access('admin'),addVoters);
router.post("/convertCsv",access('admin'),upload.single('csv'),convertToObject);
router.get("/getInfo",access('admin'),getAdminDetails);
router.post("/logout", logout);

export default router;