import React from "react";
import RegisterForm from "./RegisterForm";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Link } from "react-router-dom";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

const Register = () => {
  const [documentTitle, setDocumentTitle] = useDocumentTitle("Register");

  return (
    <div className=" grid h-screen place-content-stretch sm:grid-cols-2">
      {/* image */}
      <div className="flex justify-center border-0 border-r-[2px] border-solid border-primary-light bg-primary-light/95 px-10 ">
        <img
          src="register.svg"
          alt=""
          className="w-60 bg-transparent object-contain opacity-90 sm:w-fit"
        />
      </div>
      {/* form */}
      <div className="flex flex-col items-center justify-center bg-primary-light/95 sm:m-0 sm:bg-inherit ">
        <div className="bg-transparent">
          <RegisterForm />
        </div>
        <Link
          to="/"
          className="group mx-0 my-2 mt-4 flex w-fit cursor-pointer items-center space-x-2 rounded-3xl border-2  border-solid border-slate-50  p-1 px-2 text-base font-semibold capitalize text-secondary no-underline drop-shadow-sm transition-colors duration-200  "
        >
          {" "}
          <ArrowUturnLeftIcon className="h-10 w-10 rounded-full bg-transparent stroke-2 p-2 group-hover:bg-secondary group-hover:text-white group-hover:opacity-100" />
          <p className=" bg-inherit group-hover:opacity-50">Back to Home</p>
        </Link>
      </div>
    </div>
  );
};

export default Register;
