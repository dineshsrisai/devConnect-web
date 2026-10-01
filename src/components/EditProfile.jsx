import { useState } from "react";
import UserCard from "../components/UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age);
  const [about, setAbout] = useState(user.about);
  const [error, setError] = useState("");

  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError("");
    try {
      const payload = { firstName, lastName, photoUrl, about };
      if (age !== "" && age !== null && age !== undefined) {
        const numericAge = Number(age);
        if (!Number.isNaN(numericAge)) {
          payload.age = numericAge;
        }
      }

      const res = await axios.patch(BASE_URL + "/profile/edit", payload, {
        withCredentials: true,
      });
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (e) {
      if (!e.response) {
        setError(
          "Could not reach the server. Is the backend running, and does BASE_URL point to the right address?",
        );
      } else {
        setError(
          e.response.data?.message ||
            (typeof e.response.data === "string" ? e.response.data : null) ||
            `Server returned an error (status ${e.response.status}).`,
        );
      }
    }
  };

  return (
    <>
      <div className="flex justify-center items-stretch gap-10 my-10">
        <div className="py-4">
          <div className="card bg-base-300 w-96 shadow-sm h-full flex flex-col">
            <div className="card-body py-5">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div className="form-control">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">FirstName</legend>
                  <input
                    type="text"
                    className="input input-info rounded-lg"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>
              </div>
              <div className="form-control">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">LastName</legend>
                  <input
                    type="text"
                    className="input input-info rounded-lg"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">PhotoUrl</legend>
                  <input
                    type="text"
                    className="input input-info rounded-lg"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </fieldset>
              </div>
              <div className="form-control">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Age</legend>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    className="input input-info rounded-lg"
                    value={age || ""}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </fieldset>
              </div>
              <div className="form-control">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">About</legend>
                  <input
                    type="text"
                    className="input input-info rounded-lg"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </fieldset>
              </div>
              <p className="text-red-500">{error}</p>
              <div className="card-actions justify-center mt-auto pt-4">
                <button
                  className="btn btn-info rounded-lg"
                  onClick={saveProfile}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4 w-96">
          <UserCard
            user={{ firstName, lastName, photoUrl, age, about }}
            className="h-full w-full"
            hideActions
          />
        </div>
      </div>
      {showToast && (
        <div className="toast toast-top toast-center my-5">
          <div className="alert alert-info">
            <span>Profile saved successfully</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
