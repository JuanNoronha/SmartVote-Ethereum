import { useDocumentTitle } from "../hooks/useDocumentTitle";
import Features from "./Features";
import Hero from "./Hero";
import Medium from "./Medium";

const Homepage = () => {
  const [documentTitle, setDocumentTitle] = useDocumentTitle("Home");
  return (
    <div>
      {/* navbar */}
      <section className="hero section lg:h-[94vh]">
        {/* election results */}

        <Hero />
        <Features />
      </section>
      <section className="my-auto h-fit bg-primary-light/95  sm:h-screen ">
        <Medium />
      </section>
    </div>
  );
};

export default Homepage;
