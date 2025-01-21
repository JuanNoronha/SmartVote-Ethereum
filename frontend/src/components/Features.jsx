import { FeaturesDes } from "../assets/Links";
import Tilt from "react-parallax-tilt";

const Features = () => {
  return (
    <div className="my-[7rem] flex flex-col items-center">
      {/* features are transparency, immutability, decentralization, accessibility */}
      <h2 className="font-medium  text-primary-light">Features</h2>

      <div className="mt-8 flex  flex-wrap justify-center gap-6  ">
        {FeaturesDes.map(({ name, link }) => (
          <Tilt key={name}>
            <div className="duration-600 align-center group relative  flex min-w-40 cursor-pointer  flex-col  items-center justify-center gap-1 overflow-hidden rounded-lg  p-4  text-center shadow-sm transition-colors hover:bg-secondary/90 hover:text-center">
              <img
                src={link}
                className="duration-400 relative h-14 w-14 bg-transparent transition-all 
               group-hover:rotate-12 group-hover:scale-125 group-hover:text-neutral"
                alt={`${name} icon`}
              />
              <p className="duration-400   mt-2 block translate-y-10 bg-transparent text-lg font-bold opacity-0 transition-all group-hover:translate-y-0 group-hover:text-neutral group-hover:opacity-100">
                {name}
              </p>
            </div>
          </Tilt>
        ))}
      </div>
    </div>
  );
};

export default Features;
