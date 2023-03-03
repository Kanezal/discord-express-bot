const { guardRoleId } = require("../../config.json")

module.exports = {
    isGuardCheck(message) {
        try {
            if (message.member) {
                return message.member.roles.includes(guardRoleId)
            }
        } catch (error) {
            return false
        }
    }
}