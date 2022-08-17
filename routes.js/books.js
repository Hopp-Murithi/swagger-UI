import express from 'express';
import { nanoid } from 'nanoid'
const router = express.Router();

const idLength = 8;

/**
 * @swagger
 * components:
 *   schemas:
 *      Book:
 *         type:object
 *             required: 
 *                -title
 *                -author
 *             properties:
 *            id: 
 *                type:string
 *                description: The auto-generated id of the book
 *            title: 
 *                type:string
 *                description: The book title 
 *            author: 
 *                 type:string
 *                 description: The book author
 *            example: 
 *                  id:e567_dhoy
 *                  title: Electric universe 
 *                  author:David Bodanis
 *
 */

router.get('/', (req, res) => {
    const books = req.app.db.get('books');
    res.send(books);
});

router.get('/:id', (req, res) => {
    const book = req.app.db.get('books').find({ id: req.params.id }).value;
    res.send(book);
});
router.post('/', (req, res) => {
    try {
        const book = {
            id: nanoid(idLength),
            ...req.body
        }
        req.app.db.get('books').push(book).write();
    } catch (err) {
        res.status(500).send('Failed', err)
    }
});
router.put('/:id', () => {
    try {
        req.app.db.get('books').find({ id: req.params.id }).assign(req.body).write();
        res.send(req.app.db.get('books').find({ id: req.params.id }))
    } catch (err) {
        res.status(500).send('Failed', err)
    }

});
router.delete('/:id', () => {
    req.app.db.get('books').remove({ id: req.params.id }).write();
    res.status(200).send('Deleted');
});

export { router };