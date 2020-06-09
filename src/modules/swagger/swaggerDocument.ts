import * as pkg from '../../../package.json';

export const swaggerDocument = {
    swaggerDefinition: {
        openapi: '3.0.1',

        info: {
            version: pkg.version,
            title: pkg.name,
            description: 'Social network PeoCon',
            contact: {
                name: 'Bohdan Bodnarenko',
                url: 'https://github.com/bohdanbodnarenko',
                email: 'bodya.bodnarenko@gmail.com',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        host: process.env.API_BASE,
        servers: [{ url: process.env.API_BASE, description: 'Local server' }],
        basePath: '/',
        consumes: ['application/json', 'multipart/form-data'],
        produces: ['application/json', 'multipart/form-data'],
    },
    apis: ['./src/**/*.routes.ts', './src/entity/**/*.ts', './src/modules/shared/constants/interfaces.ts'],
};
