import { forwardRef, useImperativeHandle, useRef } from "react";

const CommitteForm = ({ formData }, ref) => {
  const formRef = useRef(null);

  const handleData = () => {
    const formData = new FormData(formRef.current);
    console.log(typeof parseInt(formData.get("candidates")));
    if (
      formData.get("name").trim() === "" ||
      formData.get("description").trim() === "" ||
      formData.get("candidates").trim() === ""
    ) {
      return { error: "All fields are required" };
    }

    if (
      parseInt(formData.get("candidates")) < 2 ||
      parseInt(formData.get("candidates")) > 10
    ) {
      return { error: "Number of candidates should be from 2 and 10" };
    }
    const newData = {
      name: formData.get("name").trim(),
      description: formData.get("description").trim(),
      candidates: parseInt(formData.get("candidates").trim()),
    };
    return newData;
  };

  useImperativeHandle(ref, () => ({
    handleData,
  }));
  return (
    <section className=" flex h-[26rem]  flex-col items-center rounded-t-md  border-2 border-solid border-slate-200  p-4 pt-6 text-sm shadow-sm  sm:h-[30rem] sm:px-14 sm:pt-12 sm:text-base ">
      <h2 className="mb-6 bg-transparent pb-4 font-semibold text-primary">
        Election Details
      </h2>
      <form
        ref={formRef}
        className="flex w-full flex-col space-y-6 bg-inherit px-4 text-primary sm:px-10 lg:px-12"
      >
        <div className="flex flex-col items-start space-y-1 bg-transparent">
          <label
            className='bg-transparent after:text-red-400 after:content-["*"]'
            htmlFor="name"
          >
            Election Name
          </label>
          <input
            className='field bg-slate-50  after:ml-1 after:text-red-400 after:content-["*"]'
            name="name"
            placeholder="Enter election name"
            defaultValue={formData?.name}
            type="text"
            id="name"
          />
        </div>
        <div className="flex flex-col items-start space-y-1 bg-transparent">
          <label
            className='bg-transparent  after:ml-1 after:text-red-400 after:content-["*"]'
            htmlFor="description"
          >
            Election Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter election description"
            className="field resize-none bg-slate-50 font-open_sans text-sm font-light tracking-wide"
            defaultValue={formData?.description}
            cols="20"
            rows="4"
            maxLength="400"
          />
        </div>
        <div className="flex items-center space-x-6 bg-inherit">
          <label
            className='bg-transparent after:ml-1 after:text-red-400 after:content-["*"]'
            htmlFor="candidates"
          >
            Number of Candidates
          </label>
          <input
            id="candidates"
            className="field font-inherit w-14 bg-slate-50 p-2 "
            max="10"
            name="candidates"
            defaultValue={formData?.candidates || 2}
            min="2"
            type="number"
          />
        </div>
      </form>
    </section>
  );
};

export default forwardRef(CommitteForm);
