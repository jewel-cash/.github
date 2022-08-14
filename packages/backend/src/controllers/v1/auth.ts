import { Body, Delete, Get, Path, Post, Route, Security, Response, SuccessResponse, Request } from "tsoa";
import { v4 as uuid } from "uuid";
import { ApiKey } from "../../entities/apikey.js";
import { createApiKey } from "../../modules/auth.js";
import { HttpError } from "../../modules/error.js";

interface INewKeyResponse {
    payload: IKeyResponse
    key: string
}

interface IKeyResponse {
    id: string,
    name: string,
    expires: number
}

@Route("/v1/auth")
@Security("token")
export class AuthController {
    @Get("/key")
    public async getKeys(@Request() req: any): Promise<Array<IKeyResponse>> {
        const userId = req.user.userId;
        console.log(userId);
        //TODO: get from db
        return [];
    }

    @Get("/key/:id")
    @Response("404")
    public async getKey(@Request() req: any, @Path() id: string): Promise<IKeyResponse> {
        //TODO: get from DB
        const userId = req.user.userId;
        throw new HttpError(404, `Key with id ${id} for user ${userId} does not exist.`);
    }

    @Post("/key")
    @SuccessResponse("201")
    public async createKey(@Request() req: any, @Body() name: string): Promise<INewKeyResponse> {

        const payload = new ApiKey({
            keyId: uuid(),
            userId: req.user.userId,
            name: name
        });

        const key = createApiKey(payload);

        console.log(payload);

        await payload.save();

        return {
            payload: {
                id: "acb",
                name: "acb",
                expires: 101
            },
            key: key
        };
    }

    @Delete("/key/:id")
    @SuccessResponse("204")
    @Response("404")
    public async deleteKey(@Request() req: any, @Path() id: string): Promise<void> {
        const userId = req.user.userId;
        //TODO: Delete from db
        throw new HttpError(404, `Key with id ${id} for user ${userId} does not exist.`);
    }
}