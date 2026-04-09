import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace } from "../features/workspaceSlice";
import { useOrganizationList } from "@clerk/clerk-react";
import api from "../configs/api";

const WorkspaceDropdown = () => {

  const dispatch = useDispatch();

  const { setActive } = useOrganizationList({
    userMemberships: true,
  });

  const { workspaces, currentWorkspace } =
    useSelector((state) => state.workspace);

  const handleSelect = async (org) => {

    try {

      /* set active org in Clerk */

      await setActive({
        organization: org.id
      });

      /* ensure workspace exists in database */

      await api.post("/api/workspaces", {

        id: org.id,
        name: org.name,
        image_url: org.imageUrl || ""

      });

      dispatch(setCurrentWorkspace(org.id));

    }

    catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="p-3">

      <p className="text-sm text-gray-500 mb-2">

        Select Workspace

      </p>

      {

        workspaces.map((workspace) => (

          <div

            key={workspace.id}

            onClick={() => handleSelect(workspace)}

            className={`p-2 rounded cursor-pointer mb-1 ${
              currentWorkspace?.id === workspace.id
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}

          >

            {workspace.name}

          </div>

        ))

      }

    </div>

  );

};

export default WorkspaceDropdown;