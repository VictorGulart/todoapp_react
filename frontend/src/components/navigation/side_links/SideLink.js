import { connect } from "react-redux";

function SideLink({ listId, text }) {
  const getList = () => {
    console.log("getting list ", text);
    console.log("the id is ", listId);
  };

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
      onClick={getList}
    >
      <span className="text-lg text-slate-600 pointer-events-none">{text}</span>
    </div>
  );
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SideLink);
