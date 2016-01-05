var db = require("./models");
var constants = require("./constants");

function roleSuccess(role) {
    console.log("Created role: "+role.name);
}

db.role.create({
    name:constants.ROLE_SUPERUSER
}).then(roleSuccess);

db.role.create({
    name:constants.ROLE_EDITOR
}).then(roleSuccess);

db.role.create({
    name:constants.ROLE_USER
}).then(roleSuccess);
