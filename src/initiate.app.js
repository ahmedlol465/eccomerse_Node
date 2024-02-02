import db_connection from "../DB/connection/connection.js";

import * as routers from './modules/index.routes.js'
import { globalResponse } from "./middleware/global-response.middleware.js";



export const initiateApp = (app, express) => {
  // Setting up middleware to parse JSON requests
    app.use(express.json());

  // Extracting port from environment variables
    const port = process.env.port;

  // Routing for user, company, and job modules
    app.use("/Auth", routers.AuthRouter);
    app.use("/catagory", routers.catagoryRouter);
    app.use("/subCategory", routers.subCategoryRouter);
    app.use("/Brand", routers.brandRouter);

  // Establishing database connection
    db_connection();

  // Adding global response middleware
    app.use(globalResponse);

  // Starting the server on the specified port
    app.listen(port, () => console.log("App is running on port:", port));
};

// HTTP Status Codes:
// 200 Success
// 201 Created
// 204 No success with no data

// 400 Wrong data
// 401 Unauthorized
// 409 Conflict - Already exists
// 404 Not found
// 403 Forbidden - Not allowed

// 500 Internal server error
// 502 Bad gateway
