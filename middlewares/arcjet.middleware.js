import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {requested: 1});

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit())
                return res.status(429).json({error: 'Rate limit exceed'});
            if(decision.reason.isBot())
                return res.status(403).json({error: 'Bot detected'});

            return req.status(403).json({error: 'Access denied'});
        }
        console.log("middleware passed"); // ye lagao
        next();

    } catch (error) {
        console.log(`Arcjet Middleware Error: ${error}`);
        next(error);
    }
}

export default arcjetMiddleware;