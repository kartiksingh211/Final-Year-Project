import prisma from "../configs/prisma.js";

/* GET USER WORKSPACES */
export const getUserWorkspaces = async (req, res) => {

    try {

        const { userId } = await req.auth();

        const workspaces = await prisma.workspace.findMany({

            where: {

                members: {
                    some: {
                        userId: userId
                    }
                }

            },

            include: {

                members: {
                    include: {
                        user: true
                    }
                },

                projects: {

                    include: {

                        tasks: {
                            include: {
                                assignee: true,
                                comments: {
                                    include: {
                                        user: true
                                    }
                                }
                            }
                        },

                        members: {
                            include: {
                                user: true
                            }
                        }

                    }

                },

                owner: true

            }

        });

        res.json({
            workspaces
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.code || error.message
        });

    }

};


/* CREATE WORKSPACE FROM CLERK ORG */
export const createWorkspace = async (req, res) => {

    try {

        const { userId } = await req.auth();

        const { id, name, image_url } = req.body;


        /* create workspace */

        const workspace = await prisma.workspace.upsert({

            where: {
                id
            },

            update: {},

            create: {

                id,

                name,

                image_url,

                ownerId: userId,

                members: {

                    create: [

                        {
                            userId: userId,
                            role: "OWNER"
                        }

                    ]

                }

            }

        });


        res.json({
            workspace
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};