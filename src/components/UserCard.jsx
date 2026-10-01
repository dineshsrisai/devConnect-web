import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeFeed } from "../utils/feedSlice";

// FIX: added `className` and `hideActions` props. Previously this component
// was built only for the Feed use case (a swipeable card with working
// Ignore/Interested buttons) and EditProfile.jsx reused it as a read-only
// preview without either of these — so the preview showed two buttons that
// made no sense on your own profile (and silently failed if clicked, since
// there's no _id on the preview object), and a `className` EditProfile
// passed in to size the card was being silently dropped.
const UserCard = ({ user, className = "", hideActions = false }) => {
  const dispatch = useDispatch();
  if (!user) return null;

  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send" + "/" + status + "/" + userId,
        {},
        { withCredentials: true },
      );
      dispatch(removeFeed(userId));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={`card bg-base-300 w-96 shadow-sm ${className}`}>
      <figure>
        <img src={photoUrl} alt="photo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        {age && gender && <p>{age + ", " + gender}</p>}
        <p>{about}</p>
        {!hideActions && (
          <div className="card-actions justify-center my-4">
            <button
              className="btn btn-soft btn-error"
              onClick={() => handleSendRequest("ignored", _id)}
            >
              Ignore
            </button>
            <button
              className="btn btn-soft btn-info"
              onClick={() => handleSendRequest("interested", _id)}
            >
              Interested
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
