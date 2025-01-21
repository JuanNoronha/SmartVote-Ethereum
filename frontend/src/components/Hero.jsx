import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextPlugin } from "gsap/all";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

gsap.registerPlugin(TextPlugin);

const Hero = () => {
  useGSAP(() => {
    gsap.to(".typewriter", {
      text: "E-voting",
      duration: 2,
      ease: "power2.inOut",
      stagger: 0.02,
    });
  });

  return (
    <div className="group grid grid-cols-1 place-content-stretch bg-inherit p-2 px-4 sm:px-4 lg:grid-cols-2">
      <div className="m-auto   mt-4 flex h-full flex-col items-start justify-end bg-inherit leading-6 tracking-tight md:mt-0 md:p-6 lg:p-0">
        <h1 className="mb-4 text-wrap bg-inherit  py-2 text-4xl font-semibold leading-tight tracking-tighter md:tracking-tight ">
          <p>Revolutionize Democracy</p> with Secure{" "}
          <span className="typewriter a border-0  border-r-2 border-solid px-2 text-secondary underline"></span>
        </h1>
        <p className="mb-4   text-wrap bg-inherit text-primary-light">
          Experience Transparent, Tamper-Proof Voting with Blockchain Technology
        </p>
        <HashLink
          className="button mb-4 mt-3 border-[3px] border-solid border-secondary bg-secondary py-2 text-xl font-medium tracking-tight  text-neutral no-underline outline-none hover:border-solid hover:bg-neutral hover:text-secondary "
          to="#get-started"
          smooth
        >
          {" "}
          Get Started &rarr;
        </HashLink>
      </div>
      <div className=" relative mr-6 flex scale-90 items-center justify-center bg-transparent sm:scale-100 sm:justify-end">
        <div className="absolute top-4 z-10 h-[26rem] w-[26rem] rounded-full   bg-gradient-to-tr  from-secondary to-primary opacity-60 blur-[3px] sm:right-16"></div>
        <div className="absolute top-12 z-10 h-[22rem] w-[22rem] rounded-full   bg-gradient-to-tr  from-secondary opacity-45 blur-[1px] sm:right-24"></div>
        <img
          src="voting-isometric.svg"
          alt="voting isometric image"
          className="  z-20 h-[24rem] w-[34rem] bg-inherit object-cover"
        />
      </div>
    </div>
  );
};

export default Hero;
