const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const productsRouter = require("./routes/products.routes");
const cartsRouter = require("./routes/carts.routes");
const viewsRouter = require("./routes/views.routes");

const app = express();
const httpServer = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(httpServer);

app.engine("handlebars", engine({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views", "layouts"),
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.use((err, req, res, next) => {
  console.error("Error interno del servidor:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

io.on('connection', (socket) => {
  console.log('Cliente conectado con WebSocket');

  socket.on('newProduct', (product) => {
    console.log("Nuevo producto recibido:", product);
    io.emit('productsUpdated', product);
  });

  socket.on('deleteProduct', (productId) => {
    console.log("Producto eliminado:", productId);
    io.emit('productsUpdated', productId);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en el puerto ${PORT}`);
});