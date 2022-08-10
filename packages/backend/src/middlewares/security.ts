import { Request, Response, NextFunction } from "express";
import { verifySignatureToken } from "../firebase.js";

const checkSignatureHeader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const signatureToken = req.header("Signature");
        if (!signatureToken) { throw new Error("NoAppCheckToken"); }
        const signatureClaim = await verifySignatureToken(signatureToken);
        next(signatureClaim.appId);
    } catch (err) {
        res.status(403).send("403 - Forbidden");
    }
};

export default checkSignatureHeader;