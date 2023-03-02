const { guardRoleId } = require("../config.json")

module.exports = {
    isGuardCheck(message) {
        console.log(message)
        try {
            if (message.member && message.roles.includes(guardRoleId)) {
                return true
            }
        } catch (error) {
            return false
        }
    }
}