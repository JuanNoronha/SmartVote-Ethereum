import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modifyCsv, setVoter } from "../features/admin/adminSlice";
import Table from "./Table";

const VoterForm = ({ formData }, ref) => {
  const [voters, setVoters] = useState(formData);
  const [fileDetails, setFileDetails] = useState(null);
  const { voter, ack } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [removeDuplicates, setRemoveDuplicates] = useState(true);

  useEffect(() => {
    if (voter) {
      console.log("there");
      setVoters(voter);
    } else {
      setVoters({});
    }
  }, [voter, ack.type]);

  const handleCSV = (e) => {
    e.preventDefault();
    if (!e.target?.files[0]) {
      return;
    }
    const { name, size } = e.target.files[0];
    console.log(e.target.files[0]);

    setFileDetails({
      name: name.length >= 30 ? `${name.substring(0, 30)}...` : name,
      size:
        size > 10000
          ? `${size / (1000 * 1000).toFixed(1)} mb`
          : `${(size / 1000).toFixed(1)} kB`,
    });
    dispatch(
      modifyCsv({
        file: e.target.files[0],
        value: removeDuplicates,
      }),
    );
    console.log(voter);
  };

  const handleDelete = (index) => () => {
    console.log(voters.data, index);
    const element = voters.data.filter((_, i) => index !== i);
    setVoters((voters) => ({ name: voters.name, data: element }));
    dispatch(setVoter(element));
  };

  useImperativeHandle(ref, () => ({
    getData: () => voters,
  }));

  return (
    <section className="flex h-[26rem]  flex-col items-center rounded-t-lg border-2 border-solid border-slate-200   p-4  pt-6 text-sm shadow-sm sm:h-[30rem] sm:px-14 sm:pt-12 sm:text-base ">
      {console.log(voters)}
      <h2 className="mb-4 bg-transparent pb-4 font-semibold text-primary">
        Voter Details
      </h2>
      <main className="flex w-full flex-col items-start space-y-3 bg-inherit text-primary">
        <div className="relative  flex items-center justify-center bg-inherit">
          <label className=" field w-36  bg-white pl-4 underline">
            Upload csv file
          </label>
          <input
            className="  absolute left-0 top-0 h-8 w-36 cursor-pointer text-sm font-semibold opacity-0 "
            type="file"
            accept=".csv"
            // onChange={(e) => handleCSV(e)}
            onChange={(e) => handleCSV(e)}
            onClick={(e) => (e.target.value = null)}
          />
          {(fileDetails || voter) && (
            <div className="ml-6 flex items-center justify-center gap-2 bg-inherit text-sm ">
              {voter ? (
                <p className="bg-transparent">{voter.name}</p>
              ) : (
                <p className="w-40 overflow-hidden bg-transparent sm:w-fit">
                  {fileDetails.name}
                </p>
              )}

              <p className="bg-transparent">{fileDetails?.size}</p>
            </div>
          )}
        </div>
        <div className=" ml-1 flex w-full items-center space-x-2 bg-inherit text-sm">
          <input
            type="checkbox"
            name="removeDuplicates"
            className="field w-fit cursor-pointer"
            onChange={() => setRemoveDuplicates(!removeDuplicates)}
            defaultChecked
          />
          <label htmlFor="removeDuplicates" className="bg-transparent">
            remove duplicate entries
          </label>
        </div>
        {ack.type === "error" && (
          <div className="self-center bg-transparent text-red-300">
            {ack.msg.error}
          </div>
        )}
        {voters?.data?.length > 0 && (
          <div className=" mt-6 max-h-[15rem] w-full  overflow-auto rounded-lg  bg-white text-primary">
            <Table
              data={voters.data}
              handleDelete={handleDelete}
              parameter={["user_id", "email"]}
            />
          </div>
        )}
        {voters?.data?.length > 0 && (
          <div className="ml-auto  justify-self-end bg-inherit text-sm">
            <p className="bg-inherit font-semibold">{`total entries: ${voters.data.length}`}</p>
          </div>
        )}
      </main>
    </section>
  );
};

export default forwardRef(VoterForm);
