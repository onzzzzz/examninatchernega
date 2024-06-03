const productsRouter = require('express').Router();
const controller = require('../controllers/products');
const authMiddleware = require('../middlewares/auth/auth');

productsRouter.get('/', controller.getAll);
productsRouter.get('/:id', controller.getById);
productsRouter.post('/create', controller.create);
productsRouter.put('/update', controller.update);
productsRouter.delete('/delete/:id', controller.delete);


module.exports = productsRouter;