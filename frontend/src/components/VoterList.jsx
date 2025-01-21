import { useEffect } from "react";
import List from "./List";
import { getVoters } from "../features/admin/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { Rings } from "react-loader-spinner";
import { Link } from "react-router-dom";
import SmoothPageTransition from "./SmoothTransitionPage";

const VoterList = () => {
  const { address } = useSelector((state) => state.auth.user);
  const { contractAddress } = useSelector(
    (state) => state.contract.contracts.contract,
  );
  const { voter, ack } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    if (contractAddress) {
      dispatch(getVoters(contractAddress));
    }
  }, [contractAddress]);

  if (!address) {
    return (
      <div className="flex w-full justify-center text-lg text-primary">
        No Voters here{"    "}
        <span>
          <Link to="/admin/create-election" className="mx-2 text-secondary  ">
            {" "}
            click here
          </Link>
        </span>
        to create election
      </div>
    );
  }

  if (!ack.type === "loading" || !voter) {
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

  return (
    <div className="mx-auto  bg-inherit p-6   pt-12">
      <SmoothPageTransition>
        <h2 className="my-2  w-fit bg-inherit p-4 font-semibold text-primary">
          Voters
        </h2>
        {voter && <List data={voter.voters} />}
      </SmoothPageTransition>
    </div>
  );
};

export default VoterList;
