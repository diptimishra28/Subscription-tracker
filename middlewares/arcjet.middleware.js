import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {
    // In development mode, skip Arcjet so tools like Postman work freely.
    // In production, Arcjet will run and protect against bots and attacks.
    if (process.env.NODE_ENV === 'development') {
        return next();
    }

    try {
        const decision = await aj.protect(req, {requested: 1});

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit())
                return res.status(429).json({error: 'Rate limit exceed'});
            if(decision.reason.isBot())
                return res.status(403).json({error: 'Bot detected'});

            return res.status(403).json({error: 'Access denied'});
        }
        console.log("middleware passed");  /*This is a custom middleware because:
                                                It runs before all routes
                                                It prints logs for every request that passes through
                                                It logs errors if Arcjet fails
                                                It helps you monitor suspicious activity
                                                This counts as monitoring + logging. */
        next();

    } catch (error) {
        console.log(`Arcjet Middleware Error: ${error}`); //.
        next(error);
    }
}

export default arcjetMiddleware;