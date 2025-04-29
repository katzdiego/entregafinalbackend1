io.on('connection', async (socket) => {
    console.log('Cliente conectado con WebSocket');

    const products = await productManager.getProducts();
    socket.emit('productsUpdated', products);

    socket.on('newProduct', async (product) => {
        console.log("Nuevo producto recibido:", product);
        await productManager.save(product);
        const products = await productManager.getProducts();
        io.emit('productsUpdated', products);
    });

    socket.on('deleteProduct', async (productId) => {
        console.log("Producto eliminado:", productId);
        await productManager.delete(productId);
        const products = await productManager.getProducts();
        io.emit('productsUpdated', products);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});