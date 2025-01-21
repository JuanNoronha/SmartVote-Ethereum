import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../features/admin/adminSlice";

const Candidate = ({ handleModal, handleTask, candidates }) => {
  const [image, setImage] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const name = useRef("");
  const email = useRef("");
  const description = useRef("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { imageUrl, ack: imgError } = useSelector((state) => state.admin);

  const handleImage = (e) => {
    e.preventDefault();
    if (!e.target?.files[0]) {
      return;
    }
    const { name, size } = e.target.files[0];
    console.log(name);

    if (size > 1024 * 1024 * 4) {
      setError({ ...error, image: "image size should be less than 4mb" });
      setImage(null);
      setFileDetails(null);
      return;
    }
    setError(null);
    dispatch(uploadImage(e.target.files[0]));
    setImage(URL.createObjectURL(e.target.files[0]));
    setFileDetails({
      name: name.length >= 30 ? `${name.substring(0, 30)}...` : name,
      size:
        size > 10000
          ? `${(size / (1000 * 1000)).toFixed(1)} mb`
          : `${(size / 1000).toFixed(1)} kB`,
    });
  };

  const handleCandidate = (e) => {
    e.preventDefault();
    console.log(image);
    const parameters = {
      name: name.current.value.trim() === "",
      email: email.current.value.trim() === "",
      description: description.current.value.trim() === "",
      image: image === null,
    };
    if (
      name.current.value === "" ||
      email.current.value === "" ||
      description.current.value === "" ||
      image === null
    ) {
      let errObj = {};
      for (const p of Object.keys(parameters)) {
        console.log([p]);
        if (parameters[p]) {
          errObj = { ...errObj, [p]: `${p} required` };
        }
      }
      setError(errObj);
      console.log(parameters, error);
      return;
    }

    const candidate = {
      name: name.current.value.trim(),
      email: email.current.value.trim(),
      description: description.current.value.trim(),
      image: imageUrl?.url,
    };

    if (candidates.length > 0) {
      let errObj = {};
      for (const c of candidates) {
        for (const p of Object.keys(candidate)) {
          if (c[p] === candidate[p] && p !== "description" && p !== "image") {
            errObj = { ...errObj, [p]: `${p} already entered` };
          }
        }
      }
      if (Object.keys(errObj).length > 0) {
        setError(errObj);
        return;
      }
    }

    setError(null);
    handleTask(candidate);
    handleModal(e);
  };

  return (
    <div className="flex w-full  flex-col items-center overflow-auto  py-6 text-sm ">
      <h2 className="mb-10 bg-transparent pb-6 font-semibold text-primary">
        Candidate Details
      </h2>
      <main className="relative mb-6 flex w-full flex-col justify-items-center space-y-6 bg-inherit px-10  text-primary ">
        <div className="flex flex-col items-start space-y-1 bg-inherit ">
          <label className="field relative w-fit self-start bg-neutral underline ">
            Upload Symbol
          </label>
          <input
            onClick={(e) => (e.target.value = null)}
            className="absolute left-10 top-0 h-8 w-40 cursor-pointer bg-slate-50  text-sm font-semibold opacity-0 "
            type="file"
            onChange={(e) => handleImage(e)}
            accept="image/*"
          />
          {error?.image && (
            <div className="bg-transparent text-xs text-red-500">
              {error.image}
            </div>
          )}

          {image && (
            <div className="flex w-full items-center justify-center rounded-md bg-primary-light/10 p-4">
              <img
                src={image}
                className=" w-80 self-center object-contain"
                alt=""
              />
            </div>
          )}
          {fileDetails && (
            <div className="flex items-center justify-center gap-2 self-center bg-inherit text-sm text-primary-light ">
              <p className="w-40 overflow-hidden bg-transparent sm:w-fit">
                {fileDetails.name}
              </p>
              <p className="bg-transparent">{fileDetails?.size}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-start space-y-1 bg-inherit ">
          <label className="bg-transparent after:ml-1 after:text-red-400 after:content-['*']">
            Name
          </label>
          <input
            className="field bg-slate-50"
            placeholder="Enter name"
            autoComplete="true"
            spellCheck="false"
            ref={name}
            type="text"
          />
          {error?.name && (
            <div className="bg-transparent text-xs text-red-500">
              {error.name}
            </div>
          )}
        </div>
        <div className="flex flex-col items-start space-y-1 bg-inherit">
          <label className="bg-transparent after:ml-1 after:text-red-400 after:content-['*']">
            Description
          </label>
          <textarea
            className="field resize-none bg-slate-50 font-open_sans"
            cols="20"
            placeholder="Enter description"
            ref={description}
            autoComplete="true"
            rows="2"
            maxLength="400"
          />
          {error?.description && (
            <div className="bg-transparent text-xs text-red-500">
              {error.description}
            </div>
          )}
        </div>
        <div className="flex flex-col items-start space-y-1 bg-inherit ">
          <label className="bg-transparent after:ml-1 after:text-red-400 after:content-['*']">
            Email
          </label>
          <input
            className="field bg-slate-50"
            placeholder="example@gmail.com"
            autoComplete="true"
            ref={email}
            type="email"
          />
          {error?.email && (
            <div className="bg-transparent text-xs text-red-500">
              {error.email}
            </div>
          )}
        </div>
        <div className="ml-auto flex gap-4 bg-inherit">
          <button
            className=" field w-20 cursor-pointer"
            onClick={(e) => {
              handleCandidate(e);
            }}
            type="submit"
          >
            Add
          </button>
          <button
            className=" field  w-20 cursor-pointer"
            onClick={(e) => {
              handleModal(e);
            }}
            type="submit"
          >
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
};

export default Candidate;
