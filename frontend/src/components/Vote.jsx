import { useEffect, useState } from "react";
import useContract from "../hooks/useContract";
import { Rings } from "react-loader-spinner";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { Bounce, ToastContainer, toast } from "react-toastify";
import SmoothPageTransition from "./SmoothTransitionPage";

const Vote = () => {
  const contract = useContract();
  const [data, setData] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const [description, setDescription] = useState({
    description: null,
    index: null,
  });
  const [isElection, setIsElection] = useState(true);
  const [voted, setVoted] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [winner, setWinner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (contract) {
      const getData = async () => {
        try {
          const numOfCandidates = await contract.getNumOfCandidates();

          const electionDone = await contract.status();
          console.log(electionDone);
          setIsElection(electionDone);
          if (!electionDone) {
            const winner = await contract.getWinner();
            if (winner[2] !== "") {
              setWinner(winner[2]);
            } else {
              setWinner(winner[0]);
            }
          } else {
            setWinner(null);
          }

          const isVoted = await contract.isVoted(user?.user_id);

          setVoted(isVoted);

          const candidates = await Promise.all(
            Array.from({ length: numOfCandidates }, (_, index) => index).map(
              (cand) => contract.getCandidate(cand),
            ),
          );
          const formatedCandidates = candidates.map((candidate) => ({
            name: candidate[0],
            description: candidate[1],
            image: candidate[2],
          }));

          setData(formatedCandidates);
        } catch (err) {
          setTransactionError(
            "transaction execution failed due to your wallet address",
          );
        } finally {
          setIsLoading(false);
        }
      };

      getData();
    }
  }, [contract]);

  const handleDescription = (description, i) => () => {
    setDescription({ description, index: i });
  };

  const castVote = (i) => async () => {
    try {
      if (isElection) {
        const vote = await contract.vote(i, user.user_id);
        vote.wait();
        setVoted(true);
        toast("You casted your vote" || err.message, {
          type: "success",
          closeOnClick: true,
          transition: Bounce,
          position: "top-right",
          autoClose: 5000,
          pauseOnHover: true,
          className: "cursor-pointer",
        });
      } else {
        throw new Error("Election already Ended");
      }
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
    }
  };

  if (!data && isLoading) {
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
    <div className="p-12 sm:pt-20">
      <SmoothPageTransition>
        <div className="my-6  flex w-full flex-col items-center decoration-slice  text-xl font-semibold  text-primary">
          {winner && (
            <div>
              {winner === "IT'S A TIE!" ? "" : "🥇 Winner is "}
              <span className="ml-2  uppercase text-secondary">{winner}</span>
              🎉
            </div>
          )}
          {voted && !winner && (
            <div>
              You have
              <span className="ml-2   text-secondary">Voted</span>
            </div>
          )}
        </div>
        {data && !isLoading && (
          <div className="mx-auto grid  h-fit w-fit origin-right justify-items-center gap-8 place-self-center bg-inherit  sm:grid-cols-3 sm:grid-rows-2 ">
            {data.map((candidate, i) => (
              <div
                className=" relative  h-80 w-80   rounded-b-sm rounded-t-xl bg-primary-light drop-shadow-lg"
                key={candidate["name"]}
              >
                <div className=" overflow-hidden rounded-t-xl  bg-inherit">
                  <div
                    className={` group relative    h-60 cursor-pointer bg-inherit  bg-cover bg-center bg-no-repeat   transition-transform  hover:scale-110 hover:bg-blend-screen `}
                    style={{ backgroundImage: `url("${candidate["image"]}")` }}
                  >
                    <div className="absolute inset-0  hidden items-start  justify-end bg-transparent p-4 text-white transition-transform  group-hover:flex">
                      <ExclamationCircleIcon
                        onMouseLeave={handleDescription(null, null)}
                        className=" h-8 w-8 bg-inherit text-inherit transition-transform hover:text-secondary"
                        onMouseEnter={handleDescription(
                          candidate["description"],
                          i,
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className=" flex h-20 items-center  justify-between rounded-b-sm rounded-t-md border-2 border-solid border-primary-light bg-transparent bg-gradient-to-b  from-primary via-primary to-slate-600 px-4 ">
                  <div className="bg-inherit  text-lg  font-semibold text-white">
                    {candidate["name"]}
                  </div>
                  <div className="  bg-inherit ">
                    <button
                      disabled={voted}
                      className={`field w-fit cursor-pointer border-secondary  bg-secondary  text-base text-white focus:outline-4 focus:outline-primary-light disabled:cursor-not-allowed ${!isElection && "border-none opacity-40"} disabled:border-none disabled:opacity-40 `}
                      onClick={castVote(i)}
                    >
                      {isElection ? "Vote me" : "Ended"}
                    </button>
                  </div>
                </div>
                {description?.index === i && (
                  <div className="text-semibold absolute right-10 top-10 z-10  h-fit  p-4 text-sm text-primary-dark opacity-60 ">
                    {description.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {transactionError && <div>{transactionError}</div>}
        <ToastContainer
          limit={5}
          className=" cursor-pointer bg-transparent font-open_sans text-sm font-[600] tracking-wide text-primary"
        />
      </SmoothPageTransition>
    </div>
  );
};

export default Vote;
