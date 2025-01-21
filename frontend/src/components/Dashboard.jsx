import { useEffect, useState } from "react";
import useContract from "../hooks/useContract";
import BarChar from "./BarChar";
import PieChar from "./PieChar";
import { ethers } from "ethers";
import { Rings } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { getVoters, sentMail } from "../features/admin/adminSlice";
import { Link } from "react-router-dom";
import SmoothPageTransition from "./SmoothTransitionPage";
import { Bounce, ToastContainer, toast } from "react-toastify";

const Dashboard = () => {
  const contract = useContract();
  const { voter } = useSelector((state) => state.admin);
  const { address, elections } = useSelector((state) => state.auth.user);
  const { contractAddress } = useSelector(
    (state) => state.contract.contracts.contract,
  );
  const { account } = useSelector((state) => state.contract);
  const [voters, setVoters] = useState(null);
  const dispatch = useDispatch();
  const [details, setDetails] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isElection, setIsElection] = useState(true);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (contractAddress) {
      dispatch(getVoters(contractAddress));
    }
  }, [contractAddress]);

  useEffect(() => {
    if (contract && voter) {
      const getData = async () => {
        try {
          const electionDone = await contract.status();

          setIsElection(electionDone);

          if (!electionDone) {
            const winner = await contract.getWinner();

            if (winner[2] !== "") {
              setWinner(winner[2]);
            } else {
              setWinner(winner[0]);
            }
            console.log(winner);
          } else {
            setWinner(null);
          }

          const numOfCandidates = await contract.getNumOfCandidates();
          const intCandidates = ethers.BigNumber.from(
            numOfCandidates._hex,
          ).toNumber();
          // const votesOfCandidate = await contract.votes(0);
          // console.log(votesOfCandidate);

          const candidates = await Promise.all(
            Array.from({ length: intCandidates }, (_, index) => index).map(
              (cand) => contract.getCandidate(cand),
            ),
          );

          const formatedCandidatePromises = candidates.map(
            async (candidate, i) => {
              const votes = await contract.votes(BigInt(i));

              return {
                name: candidate[0],
                votes: ethers.BigNumber.from(votes).toNumber(),
              };
            },
          );
          const formatedCandidates = await Promise.all(
            formatedCandidatePromises,
          );
          console.log(formatedCandidates);

          const details = await contract.getElectionDetails();
          const formatDetails = {
            name: details[0],
            description: details[1],
          };

          const numOfVoters = await contract.getNumOfVoters();

          setDetails({ ...formatDetails, candidates: formatedCandidates });
          console.log(voter);
          setVoters([
            ethers.BigNumber.from(numOfVoters._hex).toNumber(),
            voter.voters.length -
              ethers.BigNumber.from(numOfVoters._hex).toNumber(),
          ]);
        } catch (err) {
          setTransactionError(
            "transaction execution failed due to your wallet address",
          );
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      getData();
    }
  }, [contract, voter, elections]);

  if (!address && !transactionError) {
    return (
      <div className="flex w-full justify-center text-lg text-primary">
        No Elections ? {"    "}
        <span>
          <Link to="/admin/create-election" className="mx-2 text-secondary  ">
            {" "}
            click here
          </Link>
        </span>
        to create elections
      </div>
    );
  }

  const endElection = async (e) => {
    e.preventDefault();
    if (isElection) {
      try {
        const endElection = await contract.endElection();
        endElection.wait();

        const winner = await contract.getWinner();
        const candidate = await contract.getCandidate(
          ethers.BigNumber.from(winner[1]._hex).toNumber(),
        );
        const election = await contract.election_name();

        if (winner[2] !== "") {
          setWinner(winner[2]);
          console.log("mail sent");
          dispatch(
            sentMail({
              details: {
                name: candidate[0],
                email: candidate[3],
                electionName: election,
              },
              result: true,
            }),
          );
        } else {
          setWinner(winner[0]);
        }

        toast("Election Ended" || err.message, {
          type: "success",
          closeOnClick: true,
          transition: Bounce,
          position: "top-right",
          autoClose: 5000,
          pauseOnHover: true,
          className: "cursor-pointer",
        });
      } catch (err) {
        toast(err?.data?.data?.reason || err.message, {
          type: "error",
          closeOnClick: true,
          transition: Bounce,
          position: "top-right",
          autoClose: 5000,
          pauseOnHover: true,
          className: "cursor-pointer",
        });
      } finally {
        setIsElection(false);
      }
    }
  };

  if (loading) {
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
    <div className="   relative  m-0   overflow-x-hidden bg-inherit py-8 sm:w-full sm:overflow-auto sm:px-6">
      {details && voters && (
        <SmoothPageTransition>
          <div className=" mb-2 bg-inherit  px-2 text-primary sm:bg-slate-50 sm:px-4 ">
            <div className="align-center  flex  justify-end bg-transparent">
              <button
                onClick={(e) => endElection(e)}
                disabled={!isElection}
                className={`field mb-4 mr-6  w-32  min-w-fit sm:mr-0 ${!isElection && "hover:bg-red-400 "} cursor-pointer  rounded-lg bg-red-400 p-4  text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed  disabled:opacity-40`}
              >
                {isElection ? "End Election" : "Election Ended"}
              </button>
            </div>
            <div className="mx-auto w-full  p-4 sm:w-[80%] sm:p-8">
              <h2 className="mb-6 text-center text-2xl font-semibold capitalize leading-tight text-primary">
                {details["name"]}
              </h2>
              <div className="leading-wide  mb-6  flex items-start justify-center space-x-4 text-sm font-light">
                <p>
                  <strong>Description: </strong>
                </p>
                <p className="w-full sm:w-[80%]">{details["description"]}</p>
              </div>
            </div>

            <div className=" mx-auto my-2 flex  w-fit flex-wrap justify-center  px-4 text-primary  sm:space-x-6 sm:px-8 sm:py-2">
              <div className="field group m-2 flex h-20 w-32 cursor-pointer flex-col items-center justify-center space-y-1 text-center  text-sm shadow-sm drop-shadow-sm transition-all duration-150 hover:-translate-y-1 hover:translate-x-1 hover:border-secondary hover:bg-secondary hover:font-bold hover:text-white hover:drop-shadow-lg ">
                <div className="bg-inherit font-light group-hover:font-semibold">
                  Candidates
                </div>
                <div className="bg-inherit text-xl font-semibold group-hover:font-bold">
                  {details["candidates"].length}
                </div>
              </div>
              <div className="field m-2 flex h-20 w-32 cursor-pointer flex-col items-center justify-center space-y-1 text-center  text-sm shadow-sm drop-shadow-sm transition-all duration-150 hover:-translate-y-1 hover:translate-x-1 hover:border-secondary hover:bg-secondary  hover:text-white hover:drop-shadow-lg">
                <div className="bg-inherit font-light  group-hover:font-semibold">
                  Voters
                </div>
                <div className="bg-inherit text-xl font-semibold group-hover:font-bold">
                  {voters[1] + voters[0]}
                </div>
              </div>
              <div className="field m-2 flex h-20 w-32 cursor-pointer flex-col items-center justify-center space-y-1 text-center  text-sm shadow-sm drop-shadow-sm  transition-all duration-150 hover:-translate-y-1 hover:translate-x-1 hover:border-secondary hover:bg-secondary  hover:text-white hover:drop-shadow-lg">
                <div className="bg-inherit font-light  group-hover:font-semibold">
                  Votes
                </div>
                <div className="bg-inherit text-xl font-semibold group-hover:font-bold">
                  {details["candidates"].reduce((a, b) => a.votes + b.votes)}
                </div>
              </div>
            </div>
          </div>

          {winner && (
            <div className="my-4 mt-6 flex  justify-center bg-inherit decoration-slice text-lg font-semibold  text-primary">
              {winner === "IT'S A TIE!" ? "" : "🥇 Winner is "}
              <span className="ml-2 text-xl uppercase text-secondary">
                {winner}
              </span>
              🎉
            </div>
          )}
          <div className="-ml-8 flex flex-col items-center justify-around space-y-12 bg-inherit p-4 sm:ml-0 sm:flex-row sm:space-y-0 sm:bg-slate-50 md:p-8">
            <div className="relative min-h-[20rem] min-w-[20rem] max-w-[30rem] rounded-lg  p-2 sm:min-h-[22rem] sm:min-w-[30rem] md:p-4">
              <BarChar data={details["candidates"]} />
            </div>
            <div className=" flex h-[20rem] w-[20rem] items-center rounded-lg p-2 md:p-4 ">
              <PieChar
                data={[
                  {
                    name: "Voters voted",
                    voters: voters[0],
                  },
                  {
                    name: "Voters yet to vote",
                    voters: voters[1],
                  },
                ]}
              />
            </div>
          </div>
        </SmoothPageTransition>
      )}
      {transactionError && (
        <div className="flex justify-center bg-inherit text-red-300">
          {transactionError}
        </div>
      )}
      <ToastContainer
        limit={5}
        className=" cursor-pointer bg-transparent font-open_sans text-sm font-[600] tracking-wide text-primary"
      />
    </div>
  );
};

export default Dashboard;
