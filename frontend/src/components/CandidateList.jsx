import React, { useEffect, useState } from "react";
import List from "./List";
import useContract from "../hooks/useContract";
import { Rings } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SmoothPageTransition from "./SmoothTransitionPage";

const CandidateList = () => {
  const contract = useContract();
  const [data, setData] = useState(null);
  const { address } = useSelector((state) => state.auth.user);
  const { account } = useSelector((state) => state.contract);
  const [loading, setLoading] = useState(true);
  const [transactionError, setTransactionError] = useState(null);

  useEffect(() => {
    if (contract) {
      const getData = async () => {
        try {
          const numOfCandidates = await contract.getNumOfCandidates();

          const candidates = await Promise.all(
            Array.from({ length: numOfCandidates }, (_, index) => index).map(
              (cand) => contract.getCandidate(cand),
            ),
          );
          console.log(candidates);
          const formatedCandidates = candidates.map((candidate) => ({
            name: candidate[0],
            email: candidate[3],
            description: candidate[1],
            image: candidate[2],
          }));
          setData(formatedCandidates);
          setTransactionError(null);
        } catch (err) {
          setTransactionError(
            "transaction execution failed due to your wallet address",
          );
        } finally {
          setLoading(false);
        }
      };

      getData();
    } else {
      if (!account) {
        setTransactionError("error idk whatever");
        setLoading(false);
      }
    }
  }, [contract]);

  // const data = [
  //   { name: "BJP", email: "bjp@gmail.com", description: "newone get this" },
  //   { name: "BJP", email: "bjp@gmail.com", description: "newone get this" },
  //   { name: "BJP", email: "bjp@gmail.com", description: "newone get this" },
  // ];

  if (!address && !transactionError) {
    return (
      <div className="flex w-full justify-center text-lg text-primary">
        No Candidates here{"    "}
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
  if ((!data && !transactionError) || loading) {
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
    <div className="mx-auto  bg-inherit p-6   pt-12 ">
      <SmoothPageTransition>
        {console.log(contract)}
        {data && (
          <>
            <h2 className="my-2  w-fit bg-inherit p-4 font-semibold text-primary">
              Candidates
            </h2>
            <List data={data} />
          </>
        )}
        {transactionError && (
          <div className="text-red-300">{transactionError}</div>
        )}
      </SmoothPageTransition>
    </div>
  );
};

export default CandidateList;
