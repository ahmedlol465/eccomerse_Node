import { systemRoles } from "../../uitils/system.role.js";

export const endPointsRoles = {
    ADD_REVIEW: [systemRoles.USER, systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
}