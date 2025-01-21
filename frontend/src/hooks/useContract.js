import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
;


const useContract = () => {
  const {contractAddress,abiContract} = useSelector(state => state.contract.contracts.contract);
  const [election,setElection] = useState(null);
  
  useEffect(() => {
    if(contractAddress && abiContract) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();  
      const elect = new ethers.Contract(contractAddress,abiContract,signer);
      console.log(elect);
        setElection(elect);
      }
    },[contractAddress,abiContract]);
  
  return election;
}

export default useContract