import { Router } from "express";
import { getVoterDetails, loginVoter, logout } from "../controllers/auth.js";
import { access } from "../middleware/authVerify.js";
import { contractCredentials } from "../controllers/actions.js";



const router = Router();


router.post("/login",loginVoter);
router.get("/getInfo",access('voter'),getVoterDetails);
router.get("/getDetails",access('voter'),contractCredentials);

export default router;