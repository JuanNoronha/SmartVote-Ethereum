import { CheckIcon } from "@heroicons/react/24/solid";

const Stepper = ({ data, currentStep }) => {
  const activeColor = (index) => currentStep >= index;
  const isFinalStep = (index) => index === data.length - 1;

  return (
    <div className="mb-3 flex  rounded-lg bg-primary  px-4 drop-shadow-md sm:px-6">
      {data.map((item, index) => (
        <div
          key={item.title}
          className="flex h-[6rem] w-full items-center justify-center gap-0 bg-transparent"
        >
          <div className="relative  bg-transparent">
            <div
              className={` relative flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-700  ease-out  ${activeColor(index) ? "bg-secondary" : "bg-slate-400"}`}
            >
              {currentStep > index ? (
                <CheckIcon
                  className={`   h-10 w-10 bg-transparent p-1 font-extrabold text-white`}
                />
              ) : (
                <p className=" bg-transparent p-1 text-white">{index + 1}</p>
              )}
            </div>
            <div
              className={`absolute -left-2 top-6 bg-inherit ${activeColor(index) ? "text-secondary" : "text-slate-400"}`}
            >
              {item.title}
            </div>
          </div>
          {isFinalStep(index) ? null : (
            <div
              className={`h-1 w-[8rem] transition-colors duration-500 ease-out sm:w-[14rem] md:w-[16rem] xl:w-[22rem] ${activeColor(index + 1) ? "bg-secondary" : "opacity-0.7 bg-slate-400"}`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
