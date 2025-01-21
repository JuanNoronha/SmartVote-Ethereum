import { forwardRef, useImperativeHandle, useState } from "react";
import Candidate from "./Candidate";
import Table from "./Table";

const CandidateForm = ({ formData, candidates }, ref) => {
  const [modal, setModal] = useState(false);
  const [candidate, setCandidate] = useState(formData);

  const handleModal = (e) => {
    e.preventDefault();
    setModal(!modal);
  };

  const handleCandidate = (data) => {
    setCandidate((prevState) => [...prevState, data]);
  };

  const handleDelete = (index) => () => {
    console.log(index, candidate);
    const element = candidate.filter((_, i) => index !== i);
    setCandidate(element);
  };

  useImperativeHandle(ref, () => ({
    getData: () => candidate,
  }));

  return (
    <section className=" flex h-[26rem]  flex-col  items-center overflow-auto rounded-t-lg border-2 border-solid border-slate-200   p-4 pt-6 text-sm shadow-sm  sm:h-[30rem] sm:px-14 sm:pt-12 sm:text-base">
      <h2 className=" mb-4 bg-transparent pb-4 font-semibold text-primary sm:mb-6 sm:pb-2">
        Candidate Details
      </h2>
      <div
        className={` absolute right-3 top-40 h-[28rem] w-2/6 min-w-[24rem]   overflow-y-scroll rounded-lg border-2 border-solid border-slate-200 text-base  sm:right-64 ${modal ? "opacity-1  translate-x-0 transition-all duration-500 ease-in-out " : "  hidden -translate-y-80 opacity-0  "}`}
      >
        {modal && (
          <Candidate
            handleModal={handleModal}
            handleTask={handleCandidate}
            candidates={candidate}
          />
        )}
      </div>
      <button
        className="field w-fit cursor-pointer self-start disabled:cursor-not-allowed disabled:bg-slate-200"
        disabled={candidate.length === candidates}
        onClick={handleModal}
      >
        Add Candidate
      </button>

      {candidate.length > 0 && (
        <div className=" mt-6 w-full rounded-lg bg-white   text-primary">
          <Table
            data={candidate}
            handleDelete={handleDelete}
            parameter={["name", "email"]}
          />
        </div>
      )}
    </section>
  );
};

export default forwardRef(CandidateForm);
