import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Card from "./Card";

const List = ({ data }) => {
  const [modal, setModal] = useState(false);
  const [voter, setIsVoter] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const keys = Object.keys(data[0]);
  const list = data.map((d) => ({
    [keys[0]]: d[keys[0]],
    [keys[1]]: d[keys[1]],
  }));

  useEffect(() => {
    const type = getType();
    setIsVoter(type);
  }, []);

  const getType = () => {
    if (keys[0] === "name") {
      return false;
    } else {
      return true;
    }
  };

  const getModal = (candidate) => () => {
    setSelectedCandidate(candidate);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };
  return (
    <div className={` relative w-fit bg-inherit text-primary`}>
      <div
        className={`flex  items-center  rounded-sm  rounded-b-none  border-2 border-solid border-slate-100 border-b-slate-200  px-4 py-3  text-sm font-semibold`}
      >
        {Object.keys(list[0]).map((heading) => (
          <h3
            className={` mr-4  w-fit min-w-16 rounded-sm capitalize sm:m-0 ${heading === "name" || heading === "user_id" ? "sm:w-[14rem]" : "sm:w-[24rem]"} `}
            key={heading}
          >
            {heading === "user_id" ? "Voter ID" : heading}
          </h3>
        ))}
      </div>
      <div className=" rounded-sm rounded-t-none border-0 border-x-2 border-solid border-slate-100 bg-slate-200">
        {list.map((d, i) => (
          <div
            className={`text-md flex  items-center rounded-sm  border-0 border-b-[1px] border-solid  border-slate-200 px-4 ${voter ? "py-4" : "py-2"} font-semibold `}
            key={d["email"]}
          >
            {Object.keys(d).map((key) => (
              <p
                key={d[key]}
                className={` mr-4  min-w-16 sm:m-0 ${key === "name" || key === "user_id" ? "  sm:w-[14rem]" : " sm:w-[20rem]"} `}
              >
                {d[key]}
              </p>
            ))}

            {d["name"] && (
              <div className="ml-auto h-full self-end border-slate-200 sm:m-0 sm:w-[6rem]">
                <button
                  className="field  w-fit cursor-pointer "
                  onClick={getModal(data[i])}
                >
                  View
                </button>
              </div>
            )}
          </div>
        ))}
        {modal && (
          <Modal>
            <Card handleModal={closeModal} details={selectedCandidate} />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default List;
