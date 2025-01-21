import axiosInstance from "../../api/axiosInstance";
import {ethers} from 'ethers';

const deployContract = async (details) => {
    const response = await axiosInstance.get(`${details.type}/getDetails`);
   
    const {abi, abiContract,bytecode } = response.data;
    if(details.signer && details.type !== "voter") {
        const contractFactory = new ethers.ContractFactory(abi,bytecode,details.signer);
        const contract = await contractFactory.deploy();
        await contract.deployTransaction.wait();
        return {address: contract.address, abi,abiContract};

    }
    
    
    return {abi,abiContract};
}


export const  contractServices = {
    deployContract
}