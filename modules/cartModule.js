import StorageManager from './base/storageModule.js';
import Product from './productModule.js';

class ShoppingCartFields {
    constructor(id, user, role) {
        this.id = id;
        this.products = {};
        this.date = new Date().toLocaleDateString();
        this.user = user;
        this.closed = false;
        this.role = role;
    }
}

export default class ShoppingCart {
    constructor() {
        if (new.target === ShoppingCart) {
            throw new Error("Cannot instantiate abstract class");
        }
    }

    static getCartByUser(userId, role) {
        return StorageManager.load('carts').find(cart => cart.user === userId && cart.role === role && !cart.closed);
    }
    static getClosedCartsbyUser(userId, role) {
        return StorageManager.load('carts').filter(cart => cart.user === userId && cart.role === role && cart.closed);
    }

    static getCart(cartId) {
        return StorageManager.load('carts').find(cart => cart.id === cartId);
    }

    static getAllCarts() {
        return StorageManager.load('carts') || [];
    }

    static addProduct(user, role, productId) {
        const carts = ShoppingCart.getAllCarts();
        let cart = carts.find(cart => cart.user === user && cart.role === role && !cart.closed);

        if (!cart) {
            const id = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
            cart = new ShoppingCartFields(id, user, role);
            cart.products[productId] = 1;
            carts.push(cart);
        } else {
            if (!cart.products[productId]) {
                cart.products[productId] = 1;
            } else {
                if (cart.products[productId] < Product.getProductById(productId).quantity) {
                    cart.products[productId]++;
                }
            }
        }
        StorageManager.save('carts', carts);
        console.log('Product added to cart:', cart);
    }

    static removeProduct(user, role, productId) {
        const carts = ShoppingCart.getAllCarts();
        const cart = carts.find(cart => cart.user === user && cart.role === role && !cart.closed);
        if (cart && cart.products[productId]) {
            delete cart.products[productId];
            StorageManager.save('carts', carts);
        }
    }

    static decreaseProduct(user, role, productId) {
        const carts = ShoppingCart.getAllCarts();
        const cart = carts.find(cart => cart.user === user && cart.role === role && !cart.closed);
        if (cart && cart.products[productId]) {
            cart.products[productId]--;
            if (cart.products[productId] === 0) {
                delete cart.products[productId];
            }
            StorageManager.save('carts', carts);
        }
    }

    static totalPrice(user, role) {
        const cart = ShoppingCart.getCartByUser(user, role);
        let total = 0;
        if (cart) {
            for (const productId in cart.products) {
                const product = Product.getProductById(productId);
                if (product) {
                    total += cart.products[productId] * product.price;
                }
            }
        }
        return total;
    }

    static updateAllProductQuantity(cart) {
        if (cart) {
            for (const productId in cart.products) {
                Product.changeQuantity(productId, -cart.products[productId]);
            }
        }
    }

    static checkout(user, role) {
        const carts = ShoppingCart.getAllCarts();
        const cart = carts.find(cart => cart.user === user && cart.role === role && !cart.closed);
        if (cart) {
            ShoppingCart.updateAllProductQuantity(cart);
            cart.closed = true;
            StorageManager.save('carts', carts);
            console.log('Cart checked out:', cart);
        }
    }

    static allCartByUser(user, role) {
        return ShoppingCart.getAllCarts().filter(cart => cart.user === user && cart.role === role && cart.closed);
    }

    static calculateTotalOrderPrice() {
        let total = 0;
        ShoppingCart.getAllCarts().forEach(cart => {
            if (cart.closed) {
                for (const productId in cart.products) {
                    const product = Product.getProductById(productId);
                    if (product) {
                        total += parseInt(cart.products[productId]) * parseInt(product.price);
                        console.log(total);
                    }
                }
            }
        });
        console.log(total);
        return total;
    }

    static calculateTotalOrderCount() {
        let total = 0;
        ShoppingCart.getAllCarts().forEach(cart => {
            for (const productId in cart.products) {
                total += cart.products[productId];
            }
        });
        return total;
    }


    static calculateAverageOfCarts() {
        const totalOrderPrice = ShoppingCart.calculateTotalOrderPrice() || 0;
        const totalOrderCount = ShoppingCart.calculateTotalOrderCount() || 0;
        return totalOrderCount > 0 ? totalOrderPrice / totalOrderCount : 0;
    }

    static calculateTotalOrderPricePerMonth() {
        const carts = ShoppingCart.getAllCarts();
        const result = [];
        for (let i = 4; i >= 0; i--) {
            const currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() - i);
            const month = currentDate.getMonth();
            let total = 0;
            carts.forEach(cart => {
                if (cart.closed && new Date(cart.date).getMonth() === month) {
                    total += Object.entries(cart.products).reduce((sum, [productId, quantity]) => {
                        const product = Product.getProductById(productId);
                        return product ? sum + (quantity * product.price) : sum;
                    }, 0);
                }
            });
            result.push({
                month: currentDate.toLocaleString('default', { month: 'long' }),
                total
            });
        }
        return result.reverse();
    }

    static getCartProductCount(user, role) {
        const carts = ShoppingCart.getAllCarts(); // get all carts
        const cart = carts.find(cart => cart.user === user && cart.role === role && !cart.closed);
        return cart && cart.products ? Object.keys(cart.products).length : 0;
    }
}