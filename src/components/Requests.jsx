import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addRequests, removeRequests } from "../utils/requests";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [pendingRequestId, setPendingRequestId] = useState(null);

  const reviewRequests = async (status, requestId) => {
    setError("");
    setPendingRequestId(requestId);
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequests(requestId));
    } catch (e) {
      setError(
        e.response?.data?.message ||
          (typeof e.response?.data === "string" ? e.response.data : null) ||
          "Could not complete this request. Check that the backend is running and try again.",
      );
    } finally {
      setPendingRequestId(null);
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/requests/received`, {
          withCredentials: true,
        });
        dispatch(addRequests(res?.data?.data || []));
      } catch (e) {
        console.error("Error fetching requests:", e);
      }
    };

    fetchRequests();
  }, [dispatch]);

  if (!requests || requests.length === 0)
    return (
      <div className="text-center my-20">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <h1 className="font-bold text-3xl">No Requests Found</h1>
      </div>
    );

  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-4xl mb-6">Requests</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex flex-col gap-4">
        {requests.map((request) => {
          const user = request.fromUserId;
          if (!user) return null;
          const { firstName, lastName, photoUrl, age, about, gender } = user;

          return (
            <div
              className="flex justify-between items-center p-4 rounded-lg bg-base-300 w-1/3 mx-auto"
              key={request._id}
            >
              <img
                className="w-20 h-20 rounded-full object-cover"
                alt="photo"
                src={photoUrl}
              />
              <div className="text-left mx-4">
                <h2 className="font-bold text-xl">
                  {firstName} {lastName}
                </h2>
                {age && gender && (
                  <p className="text-sm text-gray-400">{age}, {gender}</p>
                )}
                <p className="text-sm mt-1">{about}</p>
              </div>
              <div>
                <button
                  className="btn btn-soft btn-info mx-2"
                  disabled={pendingRequestId !== null}
                  onClick={() => reviewRequests("accepted", request._id)}
                >
                  {pendingRequestId === request._id ? "Accepting..." : "Accept"}
                </button>
                <button
                  className="btn btn-soft btn-error mx-2"
                  disabled={pendingRequestId !== null}
                  onClick={() => reviewRequests("rejected", request._id)}
                >
                  {pendingRequestId === request._id ? "Rejecting..." : "Reject"}
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