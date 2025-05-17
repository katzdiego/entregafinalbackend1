const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true,
    };

    if (sort === "asc") options.sort = { price: 1 };
    else if (sort === "desc") options.sort = { price: -1 };

    let filter = {};

    if (query) {
      const [field, value] = query.split(":");
      if (field && value) {
        if (field === "status") {
          filter.status = value === "true";
        } else {
          filter[field] = value;
        }
      }
    }

    const result = await Product.paginate(filter, options);

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;

    const buildLink = (pageNum) => {
      let link = `${baseUrl}?page=${pageNum}&limit=${options.limit}`;
      if (sort) link += `&sort=${sort}`;
      if (query) link += `&query=${query}`;
      return link;
    };

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos", details: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    res.render("productDetail", { product, cartId: "ID_DEL_CARRITO" }); // reemplazar si es necesario
  } catch (error) {
    res.status(500).json({ error: "Error al obtener producto", details: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al crear producto", details: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Producto no encontrado" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar producto", details: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.pid);
    if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto", details: error.message });
  }
};