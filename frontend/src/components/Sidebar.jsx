import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  UserCircleIcon,
  XMarkIcon,
  ArrowLeftStartOnRectangleIcon,
  Bars3BottomLeftIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Sidebar = ({ links }) => {
  const [menu, setMenu] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const [isEmail, setIsEmail] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const highlightLink = (path) => {
    if (
      location.pathname === `/${user.role}/${path}` ||
      location.pathname === `/${user.role}${path}`
    ) {
      return true;
    }
    return false;
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await dispatch(logout()).unwrap();
    navigate("/");
  };

  return (
    <div
      className={` absolute z-10 flex h-14 opacity-95 sm:sticky sm:top-1 sm:h-[98svh] sm:opacity-100 ${menu ? " absolute z-10  h-fit  w-56 sm:h-[98svh] sm:w-64" : "  w-12 "} flex-col justify-between overflow-hidden rounded-e-xl  bg-gradient-to-tr from-primary to-slate-600  text-white sm:overflow-visible`}
    >
      <div className="mb-8  flex flex-col  items-start space-y-2 bg-transparent">
        <div
          className={` mt-4 flex  w-full justify-between bg-inherit ${menu ? "px-4" : "px-2"}  text-inherit `}
        >
          <div className="flex   flex-col items-start justify-between bg-inherit text-inherit ">
            <UserCircleIcon
              className={`h-14 w-14 bg-inherit text-inherit ${!menu ? "-translate-x-32 overflow-hidden" : "block translate-x-0 transition-transform"}`}
            />

            <div
              className={`ml-1 flex  flex-col  space-y-[1px] bg-inherit px-1 py-2 pb-4 text-inherit ${!menu ? "-translate-x-60 overflow-hidden" : "block translate-x-0 transition-transform"}  cursor-pointer`}
              onMouseEnter={() => setIsEmail(user?.email)}
              onMouseLeave={() => setIsEmail(null)}
            >
              <p className=" bg-inherit text-secondary ">
                {user?.user_id || user?.username}
              </p>
              <p
                className={` relative w-36 overflow-hidden text-ellipsis bg-inherit  text-xs font-light opacity-90 ${isEmail && "text-primary"}`}
              >
                {user?.email}
              </p>
              {isEmail && (
                <div className=" absolute left-1 top-7 bg-transparent  text-xs font-light text-white">
                  {isEmail}
                </div>
              )}
            </div>
          </div>
          {menu ? (
            <div className=" bg-inherit text-inherit">
              <XMarkIcon
                className=" h-4 w-4 cursor-pointer bg-inherit text-inherit sm:m-0"
                onClick={() => setMenu(false)}
              />
            </div>
          ) : (
            <Bars3BottomLeftIcon
              className=" absolute inset-0 m-3  h-7 w-7 cursor-pointer bg-inherit text-inherit"
              onClick={() => setMenu(true)}
            />
          )}
        </div>
        {links.map((link) => (
          <Link
            to={link.link}
            key={link.name}
            className={`group w-full ${highlightLink(link.link) ? " inset-3 border-0 border-l-4 border-solid border-secondary bg-primary-light pl-3 text-secondary " : "bg-inherit text-inherit"} px-4 py-2 capitalize   no-underline transition-colors duration-100 target:text-secondary hover:text-secondary`}
          >
            <div
              className={` flex  w-2/3  items-start space-x-3  overflow-hidden bg-inherit text-inherit sm:overflow-visible`}
            >
              <div className=" h-6 bg-inherit text-inherit">{link.icon}</div>
              <div
                className={`flex items-center bg-inherit ${!menu ? " -translate-x-32  opacity-0 transition-opacity duration-150 ease-in  group-hover:ml-4 group-hover:translate-x-0 group-hover:rounded-se-sm group-hover:bg-gradient-to-tr group-hover:from-primary group-hover:to-slate-600  group-hover:px-2 group-hover:leading-loose  group-hover:opacity-90 group-hover:drop-shadow-sm" : "translate-x-0 transition-transform duration-150 ease-out"}   text-inherit`}
              >
                {link.name}
              </div>
            </div>
            {/* {highlightLink(link.link) && !menu && (
              <div className="absolute bg-red-500">{link.name}</div>
            )} */}
          </Link>
        ))}
      </div>
      <div
        onClick={handleLogout}
        className={`mb-6  mt-12 flex w-fit cursor-pointer items-center justify-start  space-x-2 bg-transparent sm:mt-0 ${menu ? "px-4" : "px-2"}  text-slate-400 hover:text-red-500`}
      >
        <ArrowLeftStartOnRectangleIcon className="h-6 w-6 bg-inherit text-inherit" />
        <div
          className={`bg-inherit text-inherit ${!menu ? "hidden overflow-hidden" : "block"}`}
        >
          Logout
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
