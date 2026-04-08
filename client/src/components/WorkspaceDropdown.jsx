import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace, fetchWorkspaces } from "../features/workspaceSlice";
import { useNavigate } from "react-router-dom";
import { useClerk, useOrganizationList, useAuth } from "@clerk/clerk-react";
import api from "../configs/api";

function WorkspaceDropdown() {

    const { setActive, userMemberships, isLoaded } =
        useOrganizationList({ userMemberships: true });

    const { openCreateOrganization } = useClerk();

    const { getToken } = useAuth();

    const { workspaces } = useSelector((state) => state.workspace);

    const currentWorkspace =
        useSelector((state) => state.workspace?.currentWorkspace);

    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef(null);

    const dispatch = useDispatch();

    const navigate = useNavigate();


    // SELECT WORKSPACE
    const onSelectWorkspace = (organizationId) => {

        setActive({ organization: organizationId });

        dispatch(setCurrentWorkspace(organizationId));

        navigate("/");

        setIsOpen(false);

    };


    // SAVE WORKSPACE IN DATABASE
    const saveWorkspaceToDB = async (org) => {

        try {

            const token = await getToken();

            await api.post(
                "/api/workspaces",
                {
                    id: org.id,
                    name: org.name,
                    image_url: org.imageUrl,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // reload workspaces from DB
            dispatch(fetchWorkspaces({ getToken }));

        } catch (error) {

            console.log("DB workspace error:", error);

        }

    };


    // CREATE WORKSPACE BUTTON
    const handleCreateWorkspace = async () => {

        const org = await openCreateOrganization();

        if (org) {

            await saveWorkspaceToDB(org);

        }

    };


    // close dropdown when clicking outside
    useEffect(() => {

        function handleClickOutside(event) {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {

                setIsOpen(false);

            }

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);

    }, []);


    // set active workspace
    useEffect(() => {

        if (currentWorkspace && isLoaded) {

            setActive({ organization: currentWorkspace.id });

        }

    }, [currentWorkspace, isLoaded]);


    return (

        <div ref={dropdownRef} className="relative m-4">

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
            >

                <div className="flex items-center gap-3">

                    <img
                        src={currentWorkspace?.image_url}
                        className="w-8 h-8 rounded"
                    />

                    <div>

                        <p className="text-sm font-semibold">

                            {currentWorkspace?.name || "Select Workspace"}

                        </p>

                        <p className="text-xs text-gray-500">

                            {workspaces.length} workspace

                        </p>

                    </div>

                </div>

                <ChevronDown size={16} />

            </button>


            {isOpen && (

                <div className="absolute w-64 bg-white dark:bg-zinc-900 shadow rounded border mt-2">

                    {userMemberships.data.map(({ organization }) => (

                        <div
                            key={organization.id}
                            onClick={() =>
                                onSelectWorkspace(organization.id)
                            }
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                        >

                            <img
                                src={organization.imageUrl}
                                className="w-6 h-6 rounded"
                            />

                            <span>{organization.name}</span>

                        </div>

                    ))}


                    <div
                        onClick={handleCreateWorkspace}
                        className="flex items-center gap-2 p-2 text-blue-600 cursor-pointer hover:bg-gray-100"
                    >

                        <Plus size={14} />

                        Create Workspace

                    </div>

                </div>

            )}

        </div>

    );

}

export default WorkspaceDropdown;