

const mongooseErrors = (err , res) => {
    if (err.name === "ValidationError") {
        const errorDetails = Object.entries(err.errors).map(([field, error]) => ({
            field,
            message: error.message,
            kind: error.kind,
        }));

        return res.status(400).json({
            success: false,
            message: "Validation failed. Please check your input and try again.",
            errors: errorDetails,
        });
    }
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
}

export { mongooseErrors }