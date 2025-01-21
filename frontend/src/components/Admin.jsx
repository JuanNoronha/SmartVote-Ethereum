import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Outlet, useLocation, useNavigate } from "react-router";

import { MenuLinks } from "../assets/Links";
import Sidebar from "./Sidebar";
import Dropdown from "./Dropdown";
import {
  getContract,
  setContractAddress,
} from "../features/contract/contractSlice";
import { getAddressCheck } from "../features/admin/adminSlice";
import SmoothPageTransition from "./SmoothTransitionPage";
import useAddress from "../hooks/useAddress";
import { Bars } from "react-loader-spinner";

const Admin = () => {
  useAddress();
  const [documentTitle, setDocumentTitle] = useDocumentTitle("Admin Page");
  const { user } = useSelector((state) => state.auth);
  const { account, contracts, loading } = useSelector(
    (state) => state.contract,
  );
  const { ack } = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [errorPage, setErrorPage] = useState(false);
  const [election, setElection] = useState(user?.elections[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // new user navigate to create election
    if (!user?.address) {
      navigate("create-election");
    }

    // address changed show error
    if (user?.address && account?.address && account.address !== user.address) {
      setErrorPage(true);
    }

    // if (user?.address && !account) {
    //   let timer = 0;
    // }
    if (!contracts.contract.abi) {
      console.log("fetching details");
      dispatch(getContract({ type: user.role }));
    }
    if (election) {
      dispatch(setContractAddress(election));
    }
    if (account?.address) {
      if (account.address === user?.address) {
        setErrorPage(false);
      }
      dispatch(getAddressCheck(account.address));
    }

    setIsLoading(false);
  }, [account, election, user?.elections]);

  if (errorPage) {
    return (
      <div className="flex  items-center justify-center  text-xl text-red-500">
        Please change your address to the one you logged in
      </div>
    );
  }

  if (user && !account?.address && loading) {
    return (
      <div className="flex  items-center justify-center  text-xl text-red-500">
        Please connect your metamask wallet or install metamask if not{" "}
      </div>
    );
  }

  if (!user?.address && ack.msg === "address already present") {
    return (
      <div className="flex  items-center justify-center  text-xl text-red-500">
        Please change your address as it is already used by other admin.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid h-screen w-full place-content-center">
        <Bars
          height="80"
          width="80"
          color="#356579"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  return (
    <SmoothPageTransition>
      <div className="relative  bg-slate-50 ">
        <div className="flex bg-inherit p-1 text-sm">
          <Sidebar links={MenuLinks} />
          <div className="relative mx-auto  my-3  grid  w-full  bg-inherit opacity-[80%]">
            <Outlet />
            {account?.address && election && (
              <div
                className={`absolute left-10 top-5 text-primary ${location.pathname === "/admin/create-election" && "hidden"}`}
              >
                <Dropdown
                  selectOption={(val) => setElection(val)}
                  election={election}
                />
              </div>
            )}
          </div>
          {/* <h1>{election}</h1> */}
        </div>
      </div>
    </SmoothPageTransition>
  );
};

export default Admin;
