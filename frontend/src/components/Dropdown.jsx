import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Rings } from "react-loader-spinner";
import { useSelector } from "react-redux";

const Dropdown = ({ selectOption, election }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { abiContract } = useSelector(
    (state) => state.contract.contracts.contract,
  );
  const { account } = useSelector((state) => state.contract);
  const [transactionError, setTransactionError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [electionNames, setElectionNames] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (abiContract) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log("working...");

      const getDetails = async (signer) => {
        try {
          console.log(user?.elections);
          const names = await Promise.all(
            user.elections.map((election) => getElectionName(signer, election)),
          );
          console.log(names);
          setElectionNames(names);
          setSelectedItem(names[user.elections.indexOf(election)]);
        } catch (err) {
          console.error(err.message);
          setTransactionError("error!!!");
        } finally {
          setLoading(false);
        }
      };

      getDetails(signer);
    }
  }, [abiContract, user?.elections]);

  const getElectionName = async (signer, contract) => {
    const electionContract = new ethers.Contract(contract, abiContract, signer);
    const details = await electionContract.election_name();
    console.log(details);
    return details;
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleItemClick = (value, i) => {
    setSelectedItem(electionNames[i]);
    setIsOpen(false);
    selectOption(value);
  };

  if (!selectedItem && loading) {
    return (
      <div className="grid w-full place-content-center justify-items-center">
        <Rings
          visible={true}
          height="80"
          width="80"
          color="#1FD08C"
          ariaLabel="rings-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  if (!selectedItem && transactionError) {
    return <div className="text-sm text-red-300">{transactionError}</div>;
  }

  return (
    <div className={`relative inline-block w-fit text-left `}>
      <div>
        <button
          type="button"
          className="field text inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white  text-primary  shadow-sm hover:bg-gray-50 focus:outline-none"
          id="options-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          {selectedItem}
          <svg
            className="-mr-1 ml-2 h-5 w-5  fill-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute left-0 mt-2  w-44 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {/* Mapping through options */}
            {user?.elections.map((election, i) => (
              <div
                key={election}
                className="block  cursor-pointer px-4 py-2 text-sm text-primary no-underline hover:bg-gray-100"
                role="menuitem"
                onClick={() => handleItemClick(election, i)}
              >
                {electionNames[i]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
