import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addRequests, removeRequests } from "../utils/requests";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequests = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
      console.log("API response:", res.data);
      dispatch(removeRequests(_id));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/requests/received", {
          withCredentials: true,
        });

        dispatch(addRequests(res?.data?.data || []));
      } catch (e) {
        console.log("Error fetching requests:", e);
      }
    };

    fetchRequests();
  }, [dispatch]);

  if (!requests || requests.length === 0)
    return (
      <h1 className="text-center my-20 font-bold text-3xl">
        No Requests Found
      </h1>
    );

  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-4xl mb-6">Requests</h1>
      <div className="flex flex-col gap-4">
        {requests.map((request) => {
          const user = request.fromUserId;
          if (!user) return null;
          const { firstName, lastName, photoUrl, age, about, gender, _id } =
            request.fromUserId;

          return (
            <div
              className="flex justify-between items-center p-4 rounded-lg bg-base-300 w-1/3 mx-auto"
              key={_id}
            >
              <img
                className="w-20 h-20 rounded-full object-cover"
                alt="photo"
                src={photoUrl}
              />
              <div className="text-left mx-4">
                <h2 className="font-bold text-xl">
                  {firstName + " " + lastName}
                </h2>

                {age && gender && (
                  <p className="text-sm text-gray-400">{age + ", " + gender}</p>
                )}

                <p className="text-sm mt-1">{about}</p>
              </div>
              <div>
                <button
                  className="btn btn-soft btn-info mx-2"
                  onClick={() => {
                    reviewRequests("accepted", request._id);
                  }}
                >
                  Accept
                </button>
                <button
                  className="btn btn-soft btn-error mx-2"
                  onClick={() => {
                    reviewRequests("rejected", request._id);
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
