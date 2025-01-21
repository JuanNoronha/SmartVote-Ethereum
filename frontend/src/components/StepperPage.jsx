import { useEffect, useRef, useState } from "react";
import Stepper from "./Stepper";
import CommitteForm from "./CommitteForm";
import CandidateForm from "./CandidateForm";
import VoterForm from "./VoterForm";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addVoters,
  sentMail,
  setAddress,
  setDetails,
} from "../features/admin/adminSlice";
import { getContract, resetContract } from "../features/contract/contractSlice";
import { ethers } from "ethers";
import { useNavigate } from "react-router";
import { getUserDetails } from "../features/auth/authSlice";

const StepperPage = () => {
  const [current, setCurrent] = useState(0);
  const [displayError, setDisplayError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { contracts } = useSelector((state) => state.contract);
  const { user } = useSelector((state) => state.auth);
  const committeeRef = useRef();
  const candidateRef = useRef();
  const voterRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    committee: {},
    candidate: [],
    voter: {},
    error: {},
  });

  useEffect(() => {
    if (formData.error && !displayError) {
      renderError();
      setDisplayError(true);
      setFormData((formData) => ({ ...formData, error: null }));
    }
  }, [formData.error]);

  useEffect(() => {
    if (!contracts.deployed && submitted) {
      deployContract();
    }
  }, [submitted]);

  useEffect(() => {
    // console.log(contracts.contract, submitted);
    if (contracts.deployed && submitted) {
      const finishSubmit = async () => {
        try {
          await getSubmit();
        } catch (err) {
          console.error(err);
        }
      };

      const getSubmit = async () => {
        const { electionAddress, data, candidate, adminAddress } =
          await formElection();
        await setDatabase(electionAddress, data, candidate, adminAddress);
        await dispatch(getUserDetails("admin")).unwrap();
        // await dispatch(resetContract()).unwrap();
        navigate("/");
      };

      finishSubmit();
    }
  }, [contracts.deployed, submitted]);

  const elements = [
    {
      title: "Committe",
      description: (
        <CommitteForm ref={committeeRef} formData={formData.committee} />
      ),
    },
    {
      title: "Candidate",
      description: (
        <CandidateForm
          ref={candidateRef}
          formData={formData.candidate}
          candidates={formData.committee.candidates}
        />
      ),
    },
    {
      title: "Voter",
      description: <VoterForm ref={voterRef} formData={formData.voter} />,
    },
  ];

  const renderError = () => {
    toast(formData.error, {
      type: "error",
      closeOnClick: true,
      transition: Bounce,
      position: "top-right",
      autoClose: 5000,
      pauseOnHover: true,
      className: "cursor-pointer",
    });
  };

  const deployContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(signer);
    dispatch(getContract({ signer, type: "admin" }));
  };

  const setDatabase = async (election, data, candidate, adminAddress) => {
    try {
      await Promise.all(
        candidate.map((cand) =>
          dispatch(
            sentMail({
              details: {
                name: cand.name,
                email: cand.email,
                electionName: election[1],
              },
              result: false,
            }),
          ).unwrap(),
        ),
      );

      dispatch(
        setAddress({
          username: user?.username,
          details: { address: adminAddress, contract: election[0] },
        }),
      );
      dispatch(addVoters({ data }));
    } catch (err) {
      throw err;
    }
  };

  const formElection = async () => {
    // deploy the contract
    // add election details to create election method
    try {
      const { address, abi, abiContract } = contracts.contract;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const adminAddress = await signer.getAddress();
      console.log(address);
      const electionFact = new ethers.Contract(address, abi, signer);
      console.log(
        user.email,
        formData.committee.name,
        formData.committee.description,
      );
      const tx = await electionFact.createElection(
        user?.email,
        formData.committee.name,
        formData.committee.description,
      );

      await tx.wait();

      const electionAddress = await electionFact.getDeployedElection(
        user?.email,
      );
      console.log(electionAddress[0]);
      const election = new ethers.Contract(
        electionAddress[0],
        abiContract,
        signer,
      );

      const details = await election.getElectionDetails();
      console.log(details);
      // add candidates

      const election_authority = await election.election_authority();
      console.log(election_authority);

      const cand_names = formData.candidate.map((c) => String(c.name));
      const cand_description = formData.candidate.map((c) =>
        String(c.description),
      );
      const cand_imgHashes = formData.candidate.map((c) => String(c.image));
      const cand_email = formData.candidate.map((c) => String(c.email));

      console.log(cand_names, cand_description, cand_imgHashes, cand_email);

      const setCandidate = await election.addCandidate(
        cand_names,
        cand_description,
        cand_imgHashes,
        cand_email,
      );
      await setCandidate.wait();

      const numOfCandidates = Array.from(
        { length: formData.candidate.length },
        (_, index) => index,
      );
      console.log(numOfCandidates);

      for (const cand of numOfCandidates) {
        const candDetails = await election.getCandidate(cand);
        console.log(candDetails);
      }

      // add voters
      let data = [...formData.voter.data];

      data = data.map((obj) => ({
        ...obj,
        contract: electionAddress[0],
        electionName: electionAddress[1],
      }));

      return {
        electionAddress,
        data,
        candidate: formData.candidate,
        adminAddress,
      };
    } catch (err) {
      throw err;
    }

    // add voters to db and sent mail
    // sent mail to candidates

    // add admin address and contractAddress to db
  };

  const submit = async (e) => {
    e.preventDefault();
    const newData = voterRef.current.getData();
    console.log(newData);
    if (newData?.data?.length > 0) {
      setFormData((formData) => ({ ...formData, voter: newData }));
    } else {
      setFormData((formData) => ({
        ...formData,
        error: "voters file not uploaded",
      }));
      setDisplayError(false);
      return;
    }

    dispatch(setDetails(formData));
    setSubmitted(() => true);
  };

  const prev = () => {
    if (current > 0) {
      if (current === 1) {
        const newData = candidateRef.current.getData();
        setFormData((formData) => ({ ...formData, candidate: newData }));
      }

      if (current === 2) {
        const newData = voterRef.current.getData();
        setFormData((formData) => ({ ...formData, voter: newData }));
      }
      setCurrent(current - 1);
    }
  };
  const next = () => {
    if (current < elements.length - 1) {
      if (current === 0) {
        // setFormData(...formData,committee:)
        const newData = committeeRef.current.handleData();
        if (newData?.error) {
          setFormData((formData) => ({ ...formData, error: newData.error }));
          setDisplayError(false);
          return;
        }
        setFormData((formData) => ({ ...formData, committee: newData }));
      }

      if (current === 1) {
        const newData = candidateRef.current.getData();
        if (newData.length < formData.committee.candidates) {
          setFormData((formData) => ({
            ...formData,
            error: `Please add ${formData.committee.candidates} candidates`,
          }));
          setDisplayError(false);
          return;
        }

        setFormData((formData) => ({ ...formData, candidate: newData }));
      }

      if (current === 2) {
        const newData = voterRef.current.getData();
        setFormData((formData) => ({ ...formData, voter: newData }));
      }

      setCurrent(current + 1);
    }
  };

  return (
    <div className=" grid  place-self-center justify-self-center bg-transparent sm:mt-0 sm:w-fit">
      <Stepper data={elements} currentStep={current} />
      {console.log(formData)}
      <div className=" rounded-t-lg ">{elements[current].description}</div>
      <div className=" flex w-full justify-between rounded-b-md  border-2 border-t-0 border-solid border-slate-200  p-3 pt-4 shadow-sm ">
        <button
          className="field w-fit cursor-pointer  disabled:bg-slate-200 sm:w-20"
          disabled={current === 0}
          onClick={() => prev()}
        >
          previous
        </button>
        {current < elements.length - 1 && (
          <button
            className="field w-fit cursor-pointer    sm:w-20"
            onClick={() => next()}
          >
            next
          </button>
        )}
        {current === elements.length - 1 && (
          <button
            className="field w-fit cursor-pointer text-primary transition-colors hover:bg-secondary hover:text-neutral sm:w-20"
            onClick={(e) => submit(e)}
          >
            submit
          </button>
        )}
      </div>
      <ToastContainer
        limit={5}
        className=" cursor-pointer bg-transparent font-open_sans text-sm font-[600] tracking-wide text-primary"
      />
    </div>
  );
};

export default StepperPage;
