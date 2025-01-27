import ImageUploader from "../../modules/imageModule.js";
import Product from "../../modules/productModule.js";
import Cart from "../../modules/cartModule.js";
import { submitCustomer, updateCustomer, sessionValidationOfCustomerSide, id, role } from '../base.js';
sessionValidationOfCustomerSide();
updateCustomer();
submitCustomer();
// Validate the user session
sessionValidationOfCustomerSide();

const cartTable = document.querySelector('tbody');
//closed =true

// Function to create the cart table
function createCartTable() {
    const carts = Cart.getClosedCartsbyUser(id, role);
    console.log(carts);
    if (carts) {
        cartTable.innerHTML = ''; // Clear the table
        carts.forEach(function(cart) {
            console.log(cart);
            const cartProducts = cart.products;
            for (let key in cartProducts) {
                console.log(key);
                createCartRow(cart, Product.getProductById(key), cartProducts[key]);
            }
        });
    }
}

// Function to create a cart row
function createCartRow(cart, product, count) {
    // Create the main row element
    const rowTr = document.createElement('tr');
    rowTr.dataset.id = product.id;

    // Create the first column with the image
    const col1Td = document.createElement('td');
    const img = ImageUploader.getImagesByProductId(product.id);
    img.className = 'img-fluid ';
    img.style.width = "100px"
    col1Td.appendChild(img);

    // Create the second column with the product name
    const col2Td = document.createElement('td');
    col2Td.textContent = product.name;

    // Create the third column with the price
    const col3Td = document.createElement('td');
    col3Td.textContent = `${product.price} $`;

    // Create the fourth column with the product count
    const col4Td = document.createElement('td');
    const btnNumber = document.createElement('span');
    btnNumber.textContent = count;
    col4Td.appendChild(btnNumber);
    //create the fifth column with the product data added
    const col5Td = document.createElement('td');
    col5Td.textContent = cart.date;



    // Append all columns to the main row element
    rowTr.appendChild(col1Td);
    rowTr.appendChild(col2Td);
    rowTr.appendChild(col3Td);
    rowTr.appendChild(col4Td);
    rowTr.appendChild(col5Td);

    // Append the main row element to the table body
    cartTable.appendChild(rowTr);
}

// Call the createCartTable function to initialize the table
createCartTable();