import { systemRoles } from "../../uitils/system.role.js";


export const endPointsRoles = {
    ADD_ORDER: [systemRoles.SUPER_ADMIN, systemRoles.ADMIN, systemRoles.USER],
};