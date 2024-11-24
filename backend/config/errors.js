const mongooseErrors = (err, res) => {
    if (err.name === "ValidationError") {
        let errorDetails = Object.entries(err.errors).map(([field, error]) => ({
            field,
            message: error.message.replace("Path", "Field"),
            kind: error.kind,
        }));

        errorDetails.forEach((error) => {
            if (error.kind === "minlength") {
                error.message = `Value is too short.`;
            } else if (error.kind === "maxlength") {
                error.message = `Value is too long.`;
            } else if (error.kind === "ObjectId") {
                error.message = "Invalid ID format";
            }
        });
        return res.status(400).json({
            success: false,
            message: "Validation failed. Please check your input and try again.",
            errors: errorDetails,
        });
    }

    // Handle duplicate key errors (E11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `Duplicate value detected for field "${field}".`,
            errors: [
                {
                    field,
                    message: `Please use a different value.`,
                },
            ],
        });
    }

    console.error(err.name);
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
};

export { mongooseErrors };
