import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Usuarios y Tareas",
      version: "1.0.0",
      description: "Documentación de la API con Swagger y TypeScript"
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer"
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/docs/*.ts"]
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
