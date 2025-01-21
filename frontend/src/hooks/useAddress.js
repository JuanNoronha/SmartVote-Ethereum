import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { setAccount, setAccountLoaded } from "../features/contract/contractSlice";
import { useEffect, useLayoutEffect } from "react";

const useAddress = () => {
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth);
    

    useLayoutEffect(() => {
      if(user) {
        getAccountDetails();
      }
    },[user]);

    

    const getAccountDetails = async () => {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          if (typeof window.ethereum !== "undefined") {
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const balance = await signer.getBalance();
    
            dispatch(
              setAccount({
                address,
                balance: ethers.utils.formatEther(balance),
              }),
            );
    
            // setChange(false);
          } else {
            console.log("install metamask to connect");
          }
        } catch (err) {
          console.log(err);
        } finally {
          dispatch(setAccountLoaded(true));
        }
      };

     
}

export default useAddress