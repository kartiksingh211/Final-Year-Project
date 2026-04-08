export const protect = async (req, res, next) => {

    try {

        // Clerk already attaches auth object
        const userId = req.auth?.userId;

        if (!userId) {

            return res.status(401).json({
                message: "Unauthorized"
            });

        }

        // attach userId if needed in routes
        req.userId = userId;

        next();

    } catch (error) {

        console.log(error);

        res.status(401).json({
            message: "Unauthorized"
        });

    }

};