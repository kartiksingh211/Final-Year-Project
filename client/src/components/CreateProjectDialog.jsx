import { useState } from "react";
import { XIcon } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { addProject } from "../features/workspaceSlice";
import toast from "react-hot-toast";
import api from "../configs/api";

const CreateProjectDialog = ({ isDialogOpen, setIsDialogOpen }) => {

    const dispatch = useDispatch();

    const { getToken } = useAuth();

    const { currentWorkspace } = useSelector(
        (state) => state.workspace
    );

    const [formData, setFormData] = useState({

        name: "",
        description: "",
        status: "PLANNING",
        priority: "MEDIUM",
        start_date: "",
        end_date: "",
        team_members: [],
        team_lead: "",
        progress: 0,

    });

    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (!currentWorkspace) {

                return toast.error("Select workspace first");

            }


            /* auto assign owner as team lead */

            let leadEmail = formData.team_lead;

            if (!leadEmail) {

                leadEmail =
                    currentWorkspace?.members?.[0]?.user?.email;

            }


            setIsSubmitting(true);


            const token = await getToken();


            const { data } = await api.post(

                "/api/projects",

                {

                    workspaceId: currentWorkspace.id,

                    name: formData.name,

                    description: formData.description,

                    status: formData.status,

                    priority: formData.priority,

                    start_date: formData.start_date || null,

                    end_date: formData.end_date || null,

                    team_lead: leadEmail,

                    team_members:
                        formData.team_members.length > 0
                            ? formData.team_members
                            : [leadEmail],

                    progress: 0,

                },

                {

                    headers: {

                        Authorization: `Bearer ${token}`,

                    },

                }

            );


            dispatch(addProject(data.project));


            toast.success("Project created");


            setIsDialogOpen(false);


            setFormData({

                name: "",
                description: "",
                status: "PLANNING",
                priority: "MEDIUM",
                start_date: "",
                end_date: "",
                team_members: [],
                team_lead: "",
                progress: 0,

            });

        } catch (error) {

            toast.error(

                error?.response?.data?.message ||

                error.message

            );

        } finally {

            setIsSubmitting(false);

        }

    };


    if (!isDialogOpen) return null;


    return (

        <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center z-50">

            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-lg relative">


                <button

                    className="absolute top-3 right-3"

                    onClick={() => setIsDialogOpen(false)}

                >

                    <XIcon className="size-5" />

                </button>


                <h2 className="text-xl font-medium mb-2">

                    Create New Project

                </h2>


                <p className="text-sm text-gray-500 mb-4">

                    Workspace:

                    {" "}

                    <span className="text-blue-600">

                        {currentWorkspace?.name}

                    </span>

                </p>


                <form onSubmit={handleSubmit} className="space-y-3">


                    <input

                        placeholder="Project name"

                        value={formData.name}

                        onChange={(e) =>

                            setFormData({

                                ...formData,

                                name: e.target.value,

                            })

                        }

                        required

                        className="w-full p-2 border rounded"

                    />


                    <textarea

                        placeholder="Description"

                        value={formData.description}

                        onChange={(e) =>

                            setFormData({

                                ...formData,

                                description: e.target.value,

                            })

                        }

                        className="w-full p-2 border rounded"

                    />


                    <div className="flex gap-3">


                        <select

                            value={formData.status}

                            onChange={(e) =>

                                setFormData({

                                    ...formData,

                                    status: e.target.value,

                                })

                            }

                            className="flex-1 p-2 border rounded"

                        >

                            <option value="PLANNING">

                                Planning

                            </option>

                            <option value="ACTIVE">

                                Active

                            </option>

                            <option value="COMPLETED">

                                Completed

                            </option>

                            <option value="ON_HOLD">

                                On hold

                            </option>

                        </select>


                        <select

                            value={formData.priority}

                            onChange={(e) =>

                                setFormData({

                                    ...formData,

                                    priority: e.target.value,

                                })

                            }

                            className="flex-1 p-2 border rounded"

                        >

                            <option value="LOW">

                                Low

                            </option>

                            <option value="MEDIUM">

                                Medium

                            </option>

                            <option value="HIGH">

                                High

                            </option>

                        </select>


                    </div>


                    <div className="flex gap-3">


                        <input

                            type="date"

                            value={formData.start_date}

                            onChange={(e) =>

                                setFormData({

                                    ...formData,

                                    start_date: e.target.value,

                                })

                            }

                            className="flex-1 p-2 border rounded"

                        />


                        <input

                            type="date"

                            value={formData.end_date}

                            onChange={(e) =>

                                setFormData({

                                    ...formData,

                                    end_date: e.target.value,

                                })

                            }

                            className="flex-1 p-2 border rounded"

                        />


                    </div>


                    <button

                        disabled={isSubmitting}

                        className="w-full bg-blue-600 text-white p-2 rounded"

                    >

                        {isSubmitting

                            ? "Creating..."

                            : "Create Project"}

                    </button>


                </form>


            </div>

        </div>

    );

};

export default CreateProjectDialog;