import { Outlet } from "react-router";
import { VoterMenuLinks } from "../assets/Links";
import Sidebar from "./Sidebar";
import Dropdown from "./Dropdown";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getContract,
  setContractAddress,
} from "../features/contract/contractSlice";
import SmoothPageTransition from "./SmoothTransitionPage";

const Voter = () => {
  const [documentTitle, setDocumentTitle] = useDocumentTitle("Voter Page");
  const { user } = useSelector((state) => state.auth);
  const [election, setElection] = useState(user?.elections[0]);
  const { contracts } = useSelector((state) => state.contract);
  const dispatch = useDispatch();

  useEffect(() => {
    if (election) {
      dispatch(setContractAddress(election));
    }
    if (!contracts.contract.abi) {
      console.log("fetching details");
      dispatch(getContract({ type: user.role }));
    }
  }, [election]);

  return (
    <SmoothPageTransition>
      <div className="flex bg-inherit p-1 text-sm">
        <Sidebar links={VoterMenuLinks} />

        <div className="relative mx-auto  my-3  grid w-full bg-inherit opacity-[80%]">
          <Outlet />
          <div className="absolute left-10 top-5 text-primary">
            <Dropdown
              selectOption={(val) => setElection(val)}
              election={election}
            />
          </div>
        </div>
      </div>
    </SmoothPageTransition>
  );
};

export default Voter;
