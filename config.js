const API = {
    mongoConnectionUrl: "mongodb+srv://sarathsr55:sarathsr55@cloudnexusdev.nqsoizw.mongodb.net/?retryWrites=true&w=majority&appName=CloudNexusDev"
}

module.exports = {
    mongoConfig: {
        connectionUrl: API.mongoConnectionUrl,
        database: 'Dating_App',
        collections: {
            USERS: 'Users',
            POST: 'Post',
            ADMIN:'Admin',
            CHAT:'Chat',
            MESSAGES:'Messages'
        }
    },
    tokenSecret:'hometech_secret'
}