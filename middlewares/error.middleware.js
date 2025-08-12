//Middleware is a function that runs in between the request and the response.
const errorMiddleware = (err, req, res, next) => { //This is an Express error-handling middleware — it must have 4 arguments: error, req, res, next.
    try {
        let error = { ...err};

        error.message = err.message;

        console.error(err); //helpful for debugging in terminal.

        //Mongoose bad ObjectID
        if (err.name === 'CastError'){ //CastError: Happens when a wrong format ObjectId is passed
            const message = 'Resource not found';
            error = new Error(message);
            error.statusCode = 404;
        }

        //Mongoose duplicate key 
        if (err.code === 11000){
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.statusCode = 400;
        }

        //Mongoose validation error
        if (err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(val => val.messsage)
            error = new Error(message);
            error.statusCode = 400;
        }
        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error'});
    }   catch (error) {
        next(error); // call next middleware or route handler 
    }
};
export default errorMiddleware;