// Assuming you have the necessary imports and user session setup
import { User } from '../../modules/base/userModule.js'
import Admin from "../../modules/adminModule.js";
import Seller from "../../modules/sellerModule.js";
import Customer from "../../modules/customerModule.js";
import ImageUploader from "../../modules/imageModule.js";
import Product from "../../modules/productModule.js";
import Cart from "../../modules/cartModule.js";
import { successMassage, submitCustomer, updateCustomer, sessionValidationOfCustomerSide, id, role } from '../base.js';
sessionValidationOfCustomerSide();
updateCustomer();
submitCustomer();
const cartTable = document.querySelector('.cartTable');

function createCartTable() {
    const cart = Cart.getCartByUser(id, role);
    const cartProducts = cart.products;

    if (cart && Object.keys(cartProducts).length > 0) {
        const emptyCart = $('.empty').hide();
        cartTable.innerHTML = '';
        for (let key in cartProducts) {
            createCartRow(Product.getProductById(key), cartProducts[key]);
        }
    } else {
        cartTable.innerHTML = `
         <div class="empty">
                <img src="/view/img/empty-cart.png" alt="">
            </div>`;
    }
    updateCartTotal();
}

function createCartRow(product, count) {
    // Create the main div element
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row align-items-center text-center py-3 border-bottom';
    rowDiv.dataset.id = product.id;
    // Create the first column with the image
    const col1Div = document.createElement('div');
    col1Div.className = 'col-12 col-md-2';
    const img = ImageUploader.getImagesByProductId(product.id);
    img.className = 'img-fluid';
    col1Div.appendChild(img);

    // Create the second column with the text
    const col2Div = document.createElement('div');
    col2Div.className = 'col-12 col-md-3';
    col2Div.textContent = product.name;

    // Create the third column with the price
    const col3Div = document.createElement('div');
    col3Div.className = 'col-12 col-md-2';
    col3Div.textContent = product.price + '$';

    // Create the fourth column with the buttons
    const col4Div = document.createElement('div');
    col4Div.className = 'col-12 col-md-3 d-flex justify-content-center gap-2';
    const btnMinus = document.createElement('button');
    btnMinus.className = 'btn  btn-outline-dark increase';
    btnMinus.textContent = '-';

    btnMinus.addEventListener('click', () => {
        // Check if the quantity is 1, as this will lead to the product being removed
        if (count === 1) {
            const userConfirmed = confirm(`Are you sure you want to remove '${product.name}' from the cart?`);
            if (userConfirmed) {
                // If the user clicks "OK", remove the product from the cart
                Cart.decreaseProduct(id, role, product.id);
                createCartTable(); // Update the cart table
            } else {
                // If the user clicks "Cancel", don't remove the product
                console.log('Product not removed from the cart');
            }
        } else {
            // If the quantity is greater than 1, just decrease the quantity
            Cart.decreaseProduct(id, role, product.id);
            createCartTable(); // Update the cart table
        }
    });

    const btnNumber = document.createElement('span');
    btnNumber.className = 'border border-black p-2 rounded text-center';
    btnNumber.textContent = count;

    const btnPlus = document.createElement('button');
    btnPlus.className = 'btn btn-outline-dark decrease';
    btnPlus.textContent = '+';

    btnPlus.addEventListener('click', () => {
        Cart.addProduct(id, role, product.id);
        createCartTable();
    });

    col4Div.appendChild(btnMinus);
    col4Div.appendChild(btnNumber);
    col4Div.appendChild(btnPlus);

    // Create the fifth column with the total price
    const col5Div = document.createElement('div');
    col5Div.className = 'col-12 col-md-2';
    col5Div.textContent = product.price * count + '$';

    // Append all columns to the main row div
    rowDiv.appendChild(col1Div);
    rowDiv.appendChild(col2Div);
    rowDiv.appendChild(col3Div);
    rowDiv.appendChild(col4Div);
    rowDiv.appendChild(col5Div);

    // Append the main row div to the body or any other container
    cartTable.appendChild(rowDiv);
}


function updateCartTotal() {
    const pillCart = document.querySelector('.pill-cart');
    if (pillCart) pillCart.innerHTML = '';
    const tax = 5;
    const shipping = 100;
    const total = Cart.totalPrice(id, role);
    const totalPrice = total + (total * tax / 100) + shipping;
    let pill = `<div class="container pill-cart my-5 ">
            <div class="bg-secondary text-white rounded p-4 mx-auto" style="max-width: 400px;">
                <p class="fs-4 text-center mb-4">CART TOTAL</p>
                <div class="d-flex justify-content-between py-2">
                    <p class="mb-0">SUB TOTAL</p>
                    <p class="mb-0">${total}</p>
                </div>
                <div class="d-flex justify-content-between py-2">
                    <p class="mb-0">TAX</p>
                    <p class="mb-0">${tax} %</p>
                </div>
                <div class="d-flex justify-content-between py-2">
                    <p class="mb-0">SHIPPING</p>
                    <p class="mb-0">${shipping.toFixed(2)}</p>
                </div>
                <div class="d-flex justify-content-between pt-2">
                    <p class="mb-0">ORDER TOTAL</p>
                    <p class="mb-0 text-danger fw-bold">${totalPrice.toFixed(2)}</p>
                </div>
            </div>
            </div>`;
    pillCart.innerHTML = pill;

}

$('.checkout-btn').click(function() {
    console.log('Checkout button clicked');
    const cart = Cart.getCartByUser(id, role);
    console.log(cart);
    if (Object.keys(cart.products).length > 0) {
        console.log('Cart is not empty');
        Cart.checkout(id, role);
        location.href = location.origin + '/view/template/history.html';
    }
});


createCartTable();
updateCartTotal();