import StorageManager from './base/storageModule.js';

class ProductFields {
    constructor(id, name, price, quantity, category, description, fk_addBy, role) {
        this.id = id; // auto increment id
        this.name = name;
        this.price = price;
        this.date = (new Date()).getDate() + '/' + ((new Date()).getMonth() + 1) + '/' + (new Date()).getFullYear();
        this.quantity = quantity;
        this.category = category;
        this.fk_addById = fk_addBy; // current seller or admin id
        this.role = role; // role of the current user
        this.description = description; // added description
        this.stars = []; // stars in range 5 to get the average
    }
}

export default class Product {
    constructor(id, fields) {
        if (new.target === Product) {
            throw new Error("Cannot instantiate an abstract class.");
        }
    }

    static categoriesList() {
        return [
            "Sofas",
            "Chairs",
            "Tables",
            "Beds",
            "Cabinets",
            "Desks",
            "Dressers",
            "Bookshelves",
            "Benches",
            "Outdoor Furniture",
            "Office Furniture",
            "Storage Solutions",
            "Lighting",
            "Rugs",
            "Decor"
        ];
    }

    static getAllProducts() {
        return StorageManager.load('products') || [];
    }

    static getProductById(productId) {
        const products = Product.getAllProducts();
        const product = products.find(product => product.id == productId);
        return product;
    }

    static addProduct(name, price, quantity, category, description, fk_addBy, role) {
        const products = Product.getAllProducts();
        const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        const product = new ProductFields(id, name, price, quantity, category, description, fk_addBy, role);
        products.push(product);
        StorageManager.save('products', products);
        console.log('Product added:', product);
    }

    static removeProduct(productId) {
        let products = Product.getAllProducts();
        const product = Product.getProductById(productId);
        products = products.filter(product => product.id != productId);
        StorageManager.save('products', products);
        return product;
    }

    static updateProduct(productId, name = '', price = 0, quantity = 0, category = '', description = '', fk_addBy, role) {
        const oldProduct = Product.getProductById(productId);
        if (!oldProduct) {
            console.log(`Product with ID ${productId} not found.`);
            return false;
        }
        const product = new ProductFields(
            oldProduct.id,
            name || oldProduct.name,
            price || oldProduct.price,
            quantity || oldProduct.quantity,
            category || oldProduct.category,
            description || oldProduct.description,
            fk_addBy || oldProduct.fk_addBy,
            role || oldProduct.role
        );
        let products = Product.getAllProducts();
        products = products.map(p => p.id == productId ? product : p);
        StorageManager.save('products', products);
        console.log('Product updated:', product);
        return product;
    }

    static getProductsByCategory(category) {
        const products = Product.getAllProducts();
        return products.filter(product => product.category == category);
    }

    static getProductsByPriceRange(minPrice, maxPrice) {
        const products = Product.getAllProducts();
        return products.filter(product => product.price >= minPrice && product.price <= maxPrice);
    }

    static getProductByFilters(maxPrice = 0, category = '') {
        category = category == 'all' ? '' : category;
        const products = Product.getAllProducts();
        if (!maxPrice && !category) {
            return products;
        } else if (!maxPrice) {
            return Product.getProductsByCategory(category);
        } else if (!category) {
            return Product.getProductsByPriceRange(0, maxPrice);
        } else {
            return products.filter(product => product.price <= maxPrice && product.category === category);
        }
    }

    static getProductsBySearch(string) {
        const products = Product.getAllProducts();
        return products.filter(product => product.name.toLowerCase().includes(string.toLowerCase()));
    }

    static changeQuantity(productId, amount) {
        const product = Product.getProductById(productId);
        if (!product) {
            console.log(`Product with ID ${productId} not found.`);
            return false;
        }
        product.quantity = parseInt(product.quantity) + parseInt(amount);
        if (product.quantity < 0) {
            console.log('Cannot decrease quantity below zero.');
            return false;
        }
        let products = Product.getAllProducts();
        products = products.map(p => p.id == productId ? product : p);
        StorageManager.save('products', products);
        return product;
    }

    static categories() {
        const products = Product.getAllProducts();
        return [...new Set(products.map(product => product.category))];
    }

    static getAllProductsBySeller(id) {
        const products = Product.getAllProducts();
        return products.filter(product => product.fk_addBy == id && product.role == 'seller');
    }
}