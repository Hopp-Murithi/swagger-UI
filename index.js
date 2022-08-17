import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { Low, JSONFile } from 'lowdb';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { join } from 'path';
import {
    router as books_router
} from './routes.js/books.js'

const __dirname = dirname(fileURLToPath(
    import.meta.url));

const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

const port = process.env.PORT || 4000

if (db.data === null) {
    db.data = { Books: [] };
    db.write();
}

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "A simple express library API"
        },
        servers: [{
            url: "http://localhost:4000"
        }]
    },
    apis: ["/routes/*.js"]
}
const specs = swaggerJsdoc(options);

const app = express();
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan('devs'));

app.use('/books', books_router);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})