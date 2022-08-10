import { ApolloServerPlugin, GraphQLRequestListener } from "apollo-server-plugin-base";
import { GraphQLRequestContextWillSendResponse } from "apollo-server-types";
import IContext from "./context";

const ignoredOperations = ["IntrospectionQuery"];

export default class Logger implements ApolloServerPlugin<IContext> {

    async requestDidStart(): Promise<GraphQLRequestListener<IContext>> {
        return {
            async  willSendResponse(ctx: GraphQLRequestContextWillSendResponse<IContext>) {
                const operation = ctx.operationName ?? "";
                if (ignoredOperations.includes(operation)) { return; }
                const time = `[${Date.now().toString()}]:`;
                const query = ctx.request.query?.replace(/\n/g," ").replace(/ +(?= )/g,"");
                const variables = Object.keys(ctx.request.variables ?? {});
                const ip = `(${ctx.context.ip})`;
                const logItems = [time,operation, query, variables, ip].filter(x => x !== "");
                console.log(...logItems);
            }
        };
    }
}
