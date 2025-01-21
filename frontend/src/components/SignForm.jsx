import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { login, reset } from "../features/auth/authSlice";
import { ThreeDots } from "react-loader-spinner";

const SignForm = ({ select = false }) => {
  const [selection, setSelection] = useState(select);
  const username = useRef("");
  const password = useRef("");

  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);

  // console.log(state);

  useEffect(() => {
    document.querySelector("form").reset();
    if (status === "success") {
      console.log("success");
    }
    dispatch(reset());
  }, [selection, user]);

  const handleForm = (e) => {
    e.preventDefault();
    const data = {
      username: username.current?.value.trim(),
      password: password.current?.value.trim(),
    };

    e.target.reset();
    if (data.username && data.password) {
      dispatch(
        login({
          data,
          type: !selection ? "admin" : "voter",
        }),
      );
    } else {
      username.current.focus();
    }
  };

  if (status === "loading auth") {
    return (
      <div className="grid h-screen place-content-center bg-inherit">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#1FD08C"
          ariaLabel="three-dots-loading"
          className="bg-inherit"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className=" bg-transparent ">
      <div className="flex  w-full  text-white">
        <div
          onClick={() => selection && setSelection(!selection)}
          className={`w-full cursor-pointer rounded-br-md rounded-tl-md border-t-4 border-solid border-secondary/30 p-3 text-center text-xl font-semibold uppercase
          ${!selection ? "selection border-r-0 border-l-primary/10" : " border-transparent bg-secondary/30"}   `}
        >
          Committee
        </div>
        <div
          onClick={() => !selection && setSelection(!selection)}
          className={`w-full cursor-pointer rounded-bl-md rounded-tr-md border-t-4 border-solid border-secondary/30 p-3 text-center text-xl font-semibold uppercase
            ${selection ? "selection border-l-0 border-r-primary/10" : " border-transparent bg-secondary/30"}`}
        >
          Voter
        </div>
      </div>
      <div
        className={` mb-6 max-h-fit min-h-[21rem] rounded-b-lg border-[2px]  border-t-0 border-solid border-primary/20 px-9 pb-6 pt-8 text-base text-primary-light/80 shadow-lg `}
      >
        <form onSubmit={handleForm}>
          <div className="mb-4 flex min-w-80 flex-col space-y-1 px-2">
            <label
              htmlFor=""
              className='capitalize after:ml-0.5 after:text-red-400 after:content-["*"]'
            >
              {selection ? "user  id" : "username"}
            </label>
            <input
              type="text"
              autoComplete="true"
              ref={username}
              spellCheck="false"
              className="field bg-slate-100/50 required:border-red-400"
              placeholder="user name"
            />
            {status === "failed" && (error.username || error.user_id) && (
              <strong className="pl-2 text-sm font-semibold text-red-400">
                {selection ? error.user_id : error.username}
              </strong>
            )}
          </div>
          <div className="flex flex-col space-y-1 px-2 pb-10">
            <label
              htmlFor=""
              className='capitalize after:ml-0.5 after:text-red-400 after:content-["*"]'
            >
              password
            </label>
            <input
              ref={password}
              type="password"
              autoComplete="true"
              spellCheck="false"
              className="field bg-slate-100/50 required:border-red-400"
              placeholder="password"
            />
            {status === "failed" && error.password && (
              <strong className="pl-2 text-sm font-semibold text-red-400">
                {error.password}
              </strong>
            )}
          </div>

          <div className="flex justify-center">
            <button className="button block justify-self-center border-none bg-secondary/70 px-8 py-2 text-center text-lg font-semibold text-neutral shadow-sm hover:bg-secondary/90 focus:outline-none focus:ring-4 focus:ring-secondary/20">
              Log In
            </button>
          </div>

          {!selection && (
            <div className="field border-none pt-7 text-center shadow-none">
              <span>Not registered Yet ? </span>
              <Link className="" to="/register">
                click here{" "}
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignForm;
