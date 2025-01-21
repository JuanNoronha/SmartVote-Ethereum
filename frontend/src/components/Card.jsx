import { XCircleIcon } from "@heroicons/react/24/outline";

const Card = ({ details, handleModal }) => {
  return (
    <div className="field relative grid w-fit grid-cols-1 place-content-center justify-center gap-6 rounded-md bg-inherit   p-8  py-12 text-base  text-primary drop-shadow-lg  sm:grid-cols-2">
      <div className="h-40 w-40  overflow-hidden rounded-full border-[2px] border-solid  border-slate-200 bg-slate-50 sm:h-60 sm:w-60">
        <img
          src={details["image"]}
          alt={details["name"]}
          className=" h-full w-full rounded-full object-cover object-center"
        />
      </div>
      <div className="flex flex-col justify-center  space-y-2 rounded-sm ">
        <p className="  rounded-sm border-0 border-b-[1px] border-solid border-slate-200 bg-slate-50  px-2 py-1 font-semibold leading-6 tracking-tight">
          {details["name"]}
        </p>
        <p className="  rounded-sm border-0 border-b-[1px] border-solid border-slate-200 bg-slate-50 px-2 py-1 text-sm font-semibold leading-6">
          {details["email"]}
        </p>
        <p className="  h-24 text-ellipsis rounded-sm border-0 border-b-[1px] border-solid border-slate-200 bg-slate-50  px-2 py-1 text-sm font-light tracking-tight">
          {details["description"]}
        </p>
      </div>
      <div
        className="bg-se absolute right-1 top-1 "
        onClick={() => handleModal()}
      >
        <XCircleIcon className="h-8 w-8 cursor-pointer stroke-slate-400 stroke-[2px] text-sm hover:stroke-red-400" />
      </div>
    </div>
  );
};

export default Card;
