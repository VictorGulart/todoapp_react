import { connect } from "react-redux";
import { selectList } from "../../../redux/action_creators/lists_actions";

function SideLink({ listId, text, selectAList }) {
  const handleDragStart = (e) => {
    e.target.classList.add("dragging");
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging");
  };

  return (
    <div
      className="rounded-md p-2 hover:bg-white/[.50] hover:text-slate-800 active:bg-white/[.50] focus:bg-white/[.50]"
      id="draggable"
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => {
        selectAList(listId);
      }}
    >
      <span className="text-lg text-slate-600 pointer-events-none">{text}</span>
    </div>
  );
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
  return {
    selectAList: (list_id) => {
      dispatch(selectList(list_id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideLink);
