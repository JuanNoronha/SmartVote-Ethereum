import React, { useEffect, useState } from "react";

const SmoothPageTransition = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // When the component mounts, we set isMounted to true to trigger the transition
    setIsMounted(true);
  }, []);

  return (
    <div
      className={`bg-inherit transition-opacity duration-700 ease-in ${
        isMounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

export default SmoothPageTransition;
