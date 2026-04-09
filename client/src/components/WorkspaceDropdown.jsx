import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace } from "../features/workspaceSlice";

const WorkspaceDropdown = ({ closeDropdown }) => {

  const dispatch = useDispatch();

  const { workspaces, currentWorkspace } = useSelector(
    (state) => state.workspace
  );

  const handleSelect = (workspace) => {

    dispatch(setCurrentWorkspace(workspace.id));

    /* optional: close dropdown */
    if (closeDropdown) closeDropdown();

  };

  return (

    <div className="bg-white dark:bg-zinc-900 shadow-lg rounded-lg p-2 w-56">

      {workspaces.length === 0 && (
        <p className="p-2 text-sm text-gray-500">
          No workspace found
        </p>
      )}

      {workspaces.map((workspace) => (

        <div
          key={workspace.id}

          onClick={() => handleSelect(workspace)}

          className={`
            px-3 py-2 rounded-md cursor-pointer text-sm
            ${
              currentWorkspace?.id === workspace.id
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-zinc-800"
            }
          `}
        >

          {workspace.name}

        </div>

      ))}

      <div className="border-t mt-2 pt-2">

        <button
          className="text-blue-500 text-sm px-2"
        >
          + Create Workspace
        </button>

      </div>

    </div>

  );

};

export default WorkspaceDropdown;