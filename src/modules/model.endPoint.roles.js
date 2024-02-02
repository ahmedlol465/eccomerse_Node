// Importing systemRoles utility for defining role-based access control
import { systemRoles } from "../uitils/system.role.js";

// Defining roles for various endpoints in the application
export const endPointsRoles = {
    USER: [systemRoles.ADMIN, systemRoles.USER],
    USER_ONLY: [systemRoles.USER],
    ADD_CATAGORY: [systemRoles.SUPER_ADMIN],
};
