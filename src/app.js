require("dotenv").config();
const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
const connectDB = require("./config/db");

const app = express();
const httpServer = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(httpServer);

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views", "layouts"),
  })
);
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

io.on("connection", (socket) => {
  console.log("Cliente conectado vía WebSocket");

  socket.on("newProduct", (product) => {
    console.log("🆕 Producto recibido:", product);
    io.emit("productsUpdated", product);
  });

  socket.on("deleteProduct", (productId) => {
    console.log("Producto eliminado:", productId);
    io.emit("productsUpdated", productId);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

const PORT = process.env.PORT || 8080;

const initServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
  }
};

initServer();