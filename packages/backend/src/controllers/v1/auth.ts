import { Body, Delete, Get, Path, Post, Route, Security, Response, SuccessResponse, Request } from "tsoa";
import { ApiKey } from "../../entities/apikey.js";
import { createApiKey } from "../../modules/auth.js";
import { HttpError } from "../../modules/error.js";

interface ICreateKeyResponse {
    payload: IKeyResponse;
    key: string;
}

interface IKeyResponse {
    id: string;
    name: string;
    expires: number;
}

interface ICreateKeyRequest {
    name: string;
}

@Route("/v1/auth")
@Security("token")
export class AuthController {
    @Get("/key")
    public async getKeys(@Request() req: any): Promise<Array<IKeyResponse>> {
        const keys = await ApiKey.find({ uid: req.user.userId }).exec();
        return keys.map(x => {
            return {
                id: x.kid ?? "",
                name: x.cid ?? "",
                expires: x.exp ?? 0
            };
        });
    }

    @Get("/key/:id")
    @Response("404")
    public async getKey(@Request() req: any, @Path() id: string): Promise<IKeyResponse> {
        const userId = req.user.userId;
        const key = await ApiKey.findOne({ uid: userId }).exec();
        if (key == null) { throw new HttpError(404, `Key with id ${id} for user ${userId} does not exist.`); }
        return {
            id: key.kid ?? "",
            name: key.cid ?? "",
            expires: key.exp ?? 0
        }; 
    }

    @Post("/key")
    @SuccessResponse("201")
    public async createKey(@Request() req: any, @Body() body: ICreateKeyRequest): Promise<ICreateKeyResponse> {
        //TODO: max 5
        const { payload, key } = createApiKey(req.user.userId, body.name);

        const apiKey = new ApiKey(payload);
        await apiKey.save();

        return {
            payload: {
                id: payload.kid ?? "",
                name: payload.cid ?? "",
                expires: payload.exp ?? 0
            },
            key: key
        };
    }

    @Delete("/key/:id")
    @SuccessResponse("204")
    @Response("404")
    public async deleteKey(@Request() req: any, @Path() id: string): Promise<void> {
        const userId = req.user.userId;
        const key = await ApiKey.findOneAndDelete({ uid: userId }).exec();
        if (key == null) { throw new HttpError(404, `Key with id ${id} for user ${userId} does not exist.`); }
    }
}