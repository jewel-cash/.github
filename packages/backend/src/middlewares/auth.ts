import { Request, Response, NextFunction } from "express";
import { verifyAuthToken } from "../firebase.js";

const checkAuthorizationHeader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationToken = req.header("Authorization");
        if (!authorizationToken) { throw new Error("NoAppCheckToken"); }
        const authorizationClaim = await verifyAuthToken(authorizationToken);
        next(authorizationClaim.uid);
    } catch (err) {
        res.status(401).send("401 - Unauthorized");
    }
};

export default checkAuthorizationHeader;