class RoleResponse {
    constructor(id, name, description, status, permissions) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.permissionByFeature = permissions;
    }
}

module.exports = RoleResponse;
