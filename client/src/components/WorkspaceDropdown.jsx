import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace } from "../features/workspaceSlice";
import { useOrganizationList } from "@clerk/clerk-react";

const WorkspaceDropdown = () => {

  const dispatch = useDispatch();

  const { setActive } = useOrganizationList({
    userMemberships: true,
  });

  const { workspaces, currentWorkspace } = useSelector(
    (state) => state.workspace
  );

  const handleSelect = async (workspace) => {

    try {

      // set active organization in Clerk
      await setActive({
        organization: workspace.id,
      });

      // set workspace in redux
      dispatch(setCurrentWorkspace(workspace.id));

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="p-3">

      <p className="text-sm text-gray-500 mb-2">
        Select Workspace
      </p>

      {workspaces.length === 0 && (
        <p className="text-sm text-gray-400">
          No workspace found
        </p>
      )}

      {workspaces.map((workspace) => (

        <div
          key={workspace.id}

          onClick={() => handleSelect(workspace)}

          className={`
            p-2 mb-1 rounded cursor-pointer transition
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

    </div>

  );

};

export default WorkspaceDropdown;