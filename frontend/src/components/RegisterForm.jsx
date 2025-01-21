import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register, reset } from "../features/auth/authSlice";
import { ThreeDots } from "react-loader-spinner";

const RegisterForm = () => {
  const username = useRef("");
  const password = useRef("");
  const email = useRef("");

  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  // console.log(state);

  useEffect(() => {
    if (status === "success") {
      console.log("success");
    }
    dispatch(reset());
  }, [user]);

  const handleForm = (e) => {
    e.preventDefault();

    const data = {
      username: username.current?.value.trim(),
      email: email.current?.value.trim(),
      password: password.current?.value.trim(),
    };

    e.target.reset();

    dispatch(register(data));
  };

  if (status === "loading auth") {
    return (
      <div className="grid h-screen place-content-center bg-transparent">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#1FD08C"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      <div
        className={`mb-6 h-fit rounded-lg border-[2px]  border-solid border-primary/20   px-9 pb-2 pt-8 text-base text-primary-light/80 shadow-lg sm:pb-6 `}
      >
        <form onSubmit={handleForm}>
          <div className="mb-4 flex min-w-80 flex-col space-y-1 px-2">
            <label
              htmlFor=""
              className='capitalize after:ml-0.5 after:text-red-400 after:content-["*"]'
            >
              Email
            </label>
            <input
              ref={email}
              type="text"
              spellCheck="false"
              autoComplete="true"
              className="field bg-slate-100/40 required:border-red-400"
              placeholder="email"
            />
            {status === "failed" && error.email && (
              <strong className="pl-2 text-sm font-semibold text-red-400">
                {error.email}
              </strong>
            )}
          </div>
          <div className="mb-4 flex min-w-80 flex-col space-y-1 px-2">
            <label
              htmlFor=""
              className='capitalize after:ml-0.5 after:text-red-400 after:content-["*"]'
            >
              Username
            </label>
            <input
              type="text"
              ref={username}
              autoComplete="true"
              spellCheck="false"
              className="field bg-slate-100/40 required:border-red-400"
              placeholder="user name"
            />
            {status === "failed" && error.username && (
              <strong className="pl-2 text-sm font-semibold text-red-400">
                {error.username}
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
              spellCheck="false"
              autoComplete="true"
              className="field bg-slate-100/40 required:border-red-400"
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
              Register
            </button>
          </div>
          <div className="field border-none pt-10 text-center shadow-none">
            <span>Already have an account ? </span>
            <Link className="" to="/login">
              click here{" "}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
