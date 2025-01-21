import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage";
import Sign from "./components/Sign";
import Register from "./components/Register";
import About from "./components/About";
import Navbar from "./components/Navbar";
import { NavLinks } from "./assets/Links";
import { useSelector } from "react-redux";
import Admin from "./components/Admin";
import StepperPage from "./components/StepperPage";
import Dashboard from "./components/Dashboard";
import CandidateList from "./components/CandidateList";
import VoterList from "./components/VoterList";
import Vote from "./components/Vote";
import useAuth from "./hooks/useAuth";
import Voter from "./components/Voter";
import { Bars } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const App = () => {
  useAuth();
  const { user, status } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const { account } = useSelector((state) => state.contract);

  if (account) {
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });
  }

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout();
  }, []);

  if (status === "loading" || isLoading) {
    return (
      <div className="grid h-screen w-full place-content-center">
        <Bars
          height="80"
          width="80"
          color="#356579"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className=" text-primary_dark font-open_sans text-base">
      <Routes>
        {user && (
          <>
            {user?.role === "admin" && (
              <Route path="admin" element={<Admin />}>
                <Route index element={<Dashboard />} />
                <Route path="create-election" element={<StepperPage />} />
                <Route path="candidate-list" element={<CandidateList />} />
                <Route path="voter-list" element={<VoterList />} />
              </Route>
            )}

            {user?.role === "voter" && (
              <Route path="voter" element={<Voter />}>
                <Route index element={<Vote />} />
                <Route path="help" element={<About />} />
              </Route>
            )}
          </>
        )}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={`/${user.role}`} />
            ) : (
              <Navbar elements={NavLinks} />
            )
          }
        >
          <Route index element={<Homepage />} />
          <Route path="about" element={<About />} />
        </Route>
        <Route
          path="login"
          element={user ? <Navigate to={`/${user.role}`} /> : <Sign />}
        />
        <Route
          path="register"
          element={user ? <Navigate to={`/${user.role}`} /> : <Register />}
        />

        {!user && (
          <>
            <Route
              path={"/admin/*"}
              element={
                <h3>
                  Login to get access !!! <Link to={"/login"}>Login</Link>
                </h3>
              }
            />
            <Route
              path={"/voter/*"}
              element={
                <h3>
                  Login to get access !!! <Link to={"/login"}>Login</Link>
                </h3>
              }
            />
          </>
        )}
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </div>
  );
};

export default App;
