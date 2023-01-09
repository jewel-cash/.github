import { Route, Security, Hidden } from "tsoa";

@Route("/v1/admin")
@Security("admin")
@Hidden()
export class AdminController {
    
}