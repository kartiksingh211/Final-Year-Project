import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import api from "../configs/api";
import toast from "react-hot-toast";
import { addProject } from "../features/workspaceSlice";

const CreateProjectDialog = ({
  isDialogOpen,
  setIsDialogOpen
}) => {

  const dispatch = useDispatch();

  const { getToken } = useAuth();

  const { currentWorkspace } =
    useSelector((state) => state.workspace);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleCreateProject = async () => {

    try {

      if (!currentWorkspace) {

        toast.error("Workspace not loaded");

        return;

      }

      setLoading(true);

      const token = await getToken();

      const { data } = await api.post(

        "/api/projects",

        {

          name: name,

          description: description,

          workspaceId: currentWorkspace.id

        },

        {

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }

      );


      dispatch(addProject(data.project));

      toast.success("Project created");

      setIsDialogOpen(false);

      setName("");

      setDescription("");

    } catch (error) {

      console.log(error);

      toast.error(

        error?.response?.data?.message ||

        "Project failed"

      );

    } finally {

      setLoading(false);

    }

  };


  if (!isDialogOpen) return null;


  return (

    <div className="fixed inset-0 flex items-center justify-center bg-black/30">

      <div className="bg-white p-6 rounded w-96">

        <h2 className="text-lg font-semibold mb-3">

          Create Project

        </h2>


        <input
          placeholder="Project name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="border p-2 w-full mb-2"
        />


        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="border p-2 w-full mb-3"
        />


        <button

          onClick={handleCreateProject}

          disabled={loading}

          className="bg-blue-500 text-white px-4 py-2 rounded w-full"

        >

          {

            loading

              ? "Creating..."

              : "Create Project"

          }

        </button>

      </div>

    </div>

  );

};

export default CreateProjectDialog;