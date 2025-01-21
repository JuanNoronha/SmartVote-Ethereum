import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router";

const Navbar = ({ elements }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, []);

  return (
    <div>
      <nav className=" z-10  flex   items-center justify-center rounded-b-md border-0  border-b-2 border-solid border-gray-100 bg-neutral px-4 py-2 opacity-100">
        <div className="ml-2 w-[5%] bg-inherit px-1 text-center">
          <img
            src="logo.svg"
            alt="voting application"
            className="h-8 scale-150 bg-inherit object-cover "
          />
        </div>
        <div className="ml-12 flex w-[75%] justify-center gap-4 bg-inherit text-base font-semibold tracking-tight focus:outline-none sm:w-[85%]">
          {elements.map(({ name, link }) => (
            <a
              key={name}
              className="bg-inherit capitalize text-primary-light no-underline  transition-colors duration-100 hover:text-primary-light/80"
              href={link}
            >
              {name}
            </a>
          ))}
        </div>
        <div className="w-24 bg-inherit text-center sm:w-[10%]">
          <button
            className="button border-solid border-secondary bg-inherit py-1  text-secondary hover:bg-secondary hover:bg-secondary/90 hover:text-neutral focus:ring focus:ring-secondary/45 "
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default Navbar;
