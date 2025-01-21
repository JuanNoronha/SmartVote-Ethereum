import { useGSAP } from "@gsap/react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useLocation, useNavigate } from "react-router";
gsap.registerPlugin(ScrollTrigger);

const Medium = () => {
  const navigate = useNavigate();

  useGSAP(() => {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".joining",
        start: "top center+=50",
        end: "bottom bottom",
        scrub: false,
        duration: 2,
        // markers: true,
        snap: true,
        toggleActions: "play none none reset",
      },
      defaults: {
        ease: "power4.inOut",
        duration: 2,
      },
    });

    tl.from(".image", {
      opacity: 0,
      scale: 0.5,
    })
      .from(
        ".text_case-1",
        {
          xPercent: 50,
          opacity: 0,
        },
        "-=0.5",
      )
      .from(
        ".signin",
        {
          opacity: 0.5,
          stagger: 0.1,
        },
        "<",
      )
      .from(
        ".text_case-2",
        {
          xPercent: -50,
          opacity: 0,
        },
        "-=1",
      );

    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  });

  return (
    <div
      id="get-started"
      className="joining mx-10 block h-full place-content-stretch place-items-stretch gap-10  overflow-hidden bg-transparent p-6 sm:grid  sm:grid-rows-2"
    >
      {/* committee login */}
      <div className="image w-full place-self-center bg-inherit pl-20">
        <img
          src="committee.svg"
          alt="voting committee"
          className="w-[100%]  bg-inherit object-contain opacity-80  sm:w-[75%]"
        />
      </div>
      <div className="mt-6 bg-inherit">
        <div className="text_case-1 w-fit rounded-t-3xl rounded-br-3xl bg-gradient-to-br  from-secondary to-primary-light/80  px-4 py-4 text-neutral">
          <h1 className="bg-transparent text-2xl font-semibold ">
            Ready to conduct elections ?{" "}
          </h1>
          <p className="bg-transparent text-sm font-medium">
            Join as Voting Committee{" "}
          </p>
        </div>
        <div className="relative mt-10  h-fit  w-fit items-center justify-center rounded-lg bg-gradient-to-br  from-primary to-primary-dark/80 px-10 py-3 text-center  text-base text-neutral shadow-lg">
          <div className="signin flex flex-col  space-y-6 bg-transparent">
            <p className="bg-transparent text-xs font-extralight">
              <span className="bg-inherit text-center text-lg font-medium uppercase text-secondary">
                Sign Up
              </span>{" "}
              <br />
              as Voting Committee
            </p>
            <div className=" bg-transparent">
              <button
                className="field cursor-pointer rounded-xl  border-solid border-primary bg-neutral px-4 py-2 text-base font-bold tracking-tight text-primary transition-colors hover:bg-primary-light hover:text-neutral  focus:ring-2 focus:ring-primary"
                onClick={() => navigate("/register")}
              >
                Create Account
              </button>
              {/* <button className="button ">Sign In</button> */}
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute -left-4 -top-4 h-12 w-12 rounded-full bg-neutral/90 p-2 text-primary"
          >
            <path
              fillRule="evenodd"
              d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
              clipRule="evenodd"
            />
            <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
          </svg>
        </div>
      </div>
      <div className="image col-start-2 row-start-2  place-self-start bg-inherit sm:m-0">
        <img
          src="user.svg"
          alt="voter"
          className=" w-full bg-inherit opacity-80 sm:w-[70%]"
        />
      </div>
      <div className="justify-self-center bg-inherit">
        <div className="text_case-2 w-fit rounded-t-3xl rounded-bl-3xl bg-secondary bg-gradient-to-bl from-secondary to-primary-light/80 px-4 py-4 text-neutral">
          <h1 className="bg-transparent text-2xl font-semibold">
            Already part of the voter registry ?
          </h1>
          <p className="bg-transparent text-sm font-medium "> Log in here</p>
        </div>
        <div className="relative ml-auto mt-14  h-fit w-fit items-center justify-center rounded-lg bg-gradient-to-br  from-primary to-primary-dark/80 px-10 py-3 text-center  text-base text-neutral shadow-lg">
          <div className="signin flex flex-col space-y-5 bg-transparent">
            <p className="bg-transparent text-xs font-extralight">
              <span className="bg-inherit text-center text-lg font-medium uppercase text-secondary">
                Sign In
              </span>{" "}
              <br />
              as Voter
            </p>
            <div className=" bg-transparent">
              <button
                className="field cursor-pointer rounded-xl  border-solid border-primary px-7 py-2 text-base font-bold tracking-tight text-primary transition-colors hover:bg-primary-light hover:text-neutral focus:ring-2 focus:ring-primary "
                onClick={() => navigate("/login", { state: { voter: true } })}
              >
                Log In
              </button>
              {/* <button className="button ">Sign In</button> */}
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute -left-4 -top-4 h-12 w-12 rounded-full bg-neutral p-2 text-primary"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* user login */}
    </div>
  );
};

export default Medium;
