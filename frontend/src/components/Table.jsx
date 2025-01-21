import { TrashIcon } from "@heroicons/react/24/outline";

const Table = ({ data, handleDelete, parameter }) => {
  return (
    <div className=" flex flex-col justify-center  gap-1 rounded-lg  bg-slate-100 px-4  py-2 text-xs text-primary-dark sm:text-sm">
      {data.map((d, index) => (
        <div
          key={d[parameter[0]]}
          className=" flex  items-center justify-between border-0 border-b-[1px] border-solid bg-inherit pb-1 pt-2  "
        >
          <div className="w-[30%]  bg-transparent">{d[parameter[0]]}</div>
          <div className="w-[60%] bg-transparent">{d[parameter[1]]}</div>

          <TrashIcon
            onClick={handleDelete(index)}
            className="h-6 w-6 cursor-pointer bg-transparent text-red-400"
          />
        </div>
      ))}
    </div>
  );
};

export default Table;
