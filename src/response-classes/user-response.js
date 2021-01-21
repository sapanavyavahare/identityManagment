class UserResponse {
    constructor(
        id,
        username,
        name,
        emailId,
        enterpriseCode,
        status,
        userType,
        roleNames,
        permissionsName,
        roles
    ) {
        (this.id = id),
            (this.username = username),
            (this.name = name),
            (this.emailId = emailId),
            (this.enterpriseCode = enterpriseCode),
            (this.status = status),
            (this.userType = userType),
            (this.roleNames = roleNames),
            (this.permissionsName = permissionsName),
            (this.roles = roles);
    }
}
module.exports = UserResponse;
