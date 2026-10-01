import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const user = useSelector((store) => store.user);
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [isSignUpForm, setIsSignUpForm] = useState(false);

  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId: emailId,
          password: password,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (error) {
      setError(error?.response?.data || "Something went wrong");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true },
      );
      dispatch(addUser(res?.data?.data));
      navigate("/profile");
    } catch (e) {
      setError(e?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center my-10">
      <div className="card bg-base-300 w-96 shadow-sm">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isSignUpForm ? "Sign Up" : "Login"}
          </h2>
          {isSignUpForm && (
            <>
              {" "}
              <div className="form-control">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">First Name</legend>
                  <input
                    type="text"
                    className="input input-info rounded-lg"
                    placeholder="firstname"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  />
                </fieldset>
              </div>
              <div className="form-control">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Last Name</legend>
                  <input
                    type="text"
                    className="input input-info rounded-lg"
                    placeholder="lastname"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  />
                </fieldset>
              </div>
            </>
          )}
          <div className="form-control">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email ID</legend>
              <input
                type="email"
                className="input input-info rounded-lg"
                placeholder="email"
                value={emailId}
                onChange={(e) => {
                  setEmailId(e.target.value);
                }}
              />
            </fieldset>
          </div>
          <div className="form-control">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input
                type="password"
                className="input input-info rounded-lg"
                placeholder="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </fieldset>
          </div>
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center pt-3">
            <button
              className="btn btn-info rounded-lg"
              onClick={isSignUpForm ? handleSignUp : handleLogin}
            >
              {isSignUpForm ? "Sign Up" : "Login"}
            </button>
          </div>
          <p
            className="cursor-pointer mx-auto py-2"
            onClick={() => setIsSignUpForm((value) => !value)}
          >
            {isSignUpForm
              ? "Existing User? Login Here"
              : "New User? SignUp Here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
