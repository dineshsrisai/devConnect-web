import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connections";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!connections) return;

  if (connections.length === 0)
    return (
      <h1 className="text-center my-75 font-bold text-3xl">
        No Connections Found
      </h1>
    );

  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-4xl mb-6">Connections</h1>
      <div className="flex flex-col gap-4">
        {connections.map((connection) => {
          const { firstName, lastName, photoUrl, age, about, gender } =
            connection;
          return (
            <div
              className="flex items-center p-4 rounded-lg bg-base-300 w-1/3 mx-auto"
              key={connection._id}
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
              <div className="ml-auto btn btn-primary">
                <Link to={"/chat/" + connection._id}>
                  <button>Chat</button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
