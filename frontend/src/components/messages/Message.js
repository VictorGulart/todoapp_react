import { connect } from "react-redux";
import { hideFormRelatedErrors } from "../../redux/action_creators/errors_actions";

const Message = ({ type, value, cleanError }) => {
  let classes = "flex p-2 w-screen absolute top-0 left-0";
  return (
    <div
      className={
        type === "SUCCESS"
          ? classes + " bg-green-100"
          : type === "FAIL"
          ? classes + " bg-red-100"
          : type === "WARNING"
          ? classes + " bg-yellow-100"
          : classes + " bg-gray-100"
      }
    >
      <span className="grow text-xs text-center text-slate-800 flex items-center justify-center">
        {value}
      </span>
      <div className="self-end">
        <i
          className="text-slate-800 fa-solid fa-x cursor-pointer"
          onClick={() => {
            cleanError();
          }}
        ></i>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    cleanError: () => {
      dispatch(hideFormRelatedErrors());
    },
  };
};

export default connect(null, mapDispatchToProps)(Message);
