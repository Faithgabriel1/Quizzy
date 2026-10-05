const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Parking Management System API",
            version: "1.0.0",
            description:
                "REST API for managing parking spaces, vehicles, parking sessions and payments."
        },

        servers: [
            {
                url: "http://localhost:5000"
            }
        ]
    },

    apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;