import { Body, Delete, Get, Path, Post, Route, Security, Response, SuccessResponse, Inject } from "tsoa";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import { HttpError } from "../../modules/error.js";

interface IKeyPayload {
    keyId: string
    userId: string
    name: string
}

interface INewKey {
    payload: IKeyPayload
    key: string
}

@Route("/v1/auth")
@Security("token")
export class AuthController {
    @Get("/key")
    public async getKeys(@Inject() userId: string): Promise<Array<IKeyPayload>> {
        //TODO: get from db
        return [];
    }

    @Get("/key/:id")
    @Response("404")
    public async getKey(@Path() id: string, @Inject() userId: string): Promise<IKeyPayload> {
        //TODO: get from DB
        throw new HttpError(404, `Key with id ${id} for user ${userId} does not exist.`);
    }

    @Post("/key")
    @SuccessResponse("201")
    public async createKey(@Body() name: string, @Inject() userId: string): Promise<INewKey> {
        const payload: IKeyPayload = {
            keyId: uuid(),
            userId: userId,
            name: name
        };

        const options: jwt.SignOptions = { 
            algorithm: "PS256",
            expiresIn: "1 year",
            notBefore: "1s",
            mutatePayload: true
        };

        const key = jwt.sign(payload, "ABC", options);

        //TODO: store in DB
        return {
            payload: payload,
            key: key
        };
    }

    @Delete("/key/:id")
    @SuccessResponse("204")
    @Response("404")
    public async deleteKey(@Path() id: string, @Inject() userId: string): Promise<void> {
        //TODO: Delete from db
        throw new HttpError(404, `Key with id ${id} for user ${userId} does not exist.`);
    }
}