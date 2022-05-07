import { connect } from "react-redux";
import { useEffect, useRef } from "react";

function LinksContainer({ children, containerId }) {
  const container = useRef(null);
  const dragged = useRef(null);

  const getAfterElement = (container, y) => {
    // All elements that are not being dragged
    let items = [
      ...document
        .querySelector(`#${containerId}`)
        .querySelectorAll("#draggable:not(.dragging)"),
    ];

    return items.reduce(
      (closest, child) => {
        let box = child.getBoundingClientRect();
        let offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return {
            offset: offset,
            element: child,
          };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  };

  function handleDragStart(e) {
    // get the dragged list
    dragged.current = e.target;
    e.target.classList.add("opacity-50");
  }

  useEffect(() => {
    //   Setting up the event listeners
    container.current = document.querySelector(`#${containerId}`);

    document.addEventListener("dragstart", handleDragStart, false);

    document.addEventListener(
      "dragend",
      (e) => {
        // make it visible again
        dragged.current.classList.remove("opacity-50");
      },
      false
    );

    container.current.addEventListener(
      "dragover",
      (e) => {
        // prevent default to allow drop
        e.preventDefault();
        let afterElement = getAfterElement(container.current, e.clientY);

        if (afterElement == null) {
          container.current.appendChild(dragged.current);
        } else {
          container.current.insertBefore(dragged.current, afterElement);
        }
      },
      false
    );

    document.addEventListener("drop", (e) => {
      // prevent default action (open as link for some elements)
      e.preventDefault();

      // move the dragged elem to the selected spot
      if (e.target.className == "dropzone") {
        e.target.classList.remove("opacity-50");
      }
    });

    return () => {
      document.removeEventListener("dragstart", handleDragStart);
      // document.removeEventListener("dragend");
      // document.removeEventListener("dragover");
      // document.removeEventListener("drop");
    };
  }, []);

  return (
    <div id={containerId} className="dropzone w-full flex flex-col gap-y-2 p-3">
      {children}
    </div>
  );
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(LinksContainer);
