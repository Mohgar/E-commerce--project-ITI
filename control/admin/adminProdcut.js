import {User} from '../../modules/base/userModule.js';
import ImageUploader from "../../modules/imageModule.js";
import Product from "../../modules/productModule.js";
import {successMassage, failurMessage,adminOrSellerSessionValidation, id, role} from '../../control/base.js';

adminOrSellerSessionValidation();

const userSession = User.getUserSession();
let allProduct = [];
let updateProductId;

Product.categoriesList().forEach((category) => {
     // Log the category to the console 
     console.log(category); 
     let option=document.createElement('option');
     option.value=category;
     option.textContent=category;
     $('select').append(option);
     });

function getProductByUser() {
    console.log(userSession);
    console.log(userSession.id, userSession.role);
    if (userSession.role == 'admin') {
        allProduct = Product.getAllProducts();
    } else if (userSession.role == 'seller') {
        allProduct = Product.getAllProductsBySeller(userSession.id);
    }
}

const productNameRegex = /^[a-zA-Z\s]+$/;
const categoryRegex = /^[a-zA-Z\s]+$/;

function addProduct(product) {
    const newRow = `
        <tr data-id="${product.id}" data-addby="${product.fk_addBy}" data-role="${product.role}">
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.category}</td>
            <td>${product.quantity}</td>
            <td class="text-truncate d-inline-block" style="overflow: hidden; text-overflow: ellipsis; max-width:120px;white-space:nowrap;">${product.description}</td>
            <td>
                <button class="btn btn-sm btn-warning editProductBtn" data-bs-toggle="modal" data-bs-target="#editProductModal" data-productId="${product.id}">Edit</button>
                <button class="btn btn-sm btn-danger deleteProductBtn" data-productId="${product.id}">Delete</button>
            </td>
        </tr>`;
    $("#productTableBody").append(newRow);
}

function createProductTable() {
    console.log("all", allProduct);
    getProductByUser();
    $("#productTableBody").html('');
    allProduct.forEach(addProduct);
    addEventListeners();
}

function addEventListeners() {
    $('.editProductBtn').on('click', function(event) {
        event.preventDefault();
        const row = $(this).closest('tr');
        const productId = row.data('id');
        const product = Product.getProductById(productId);
        updateProductId = productId;

        document.querySelector('#editProductForm [name=productName]').value = product.name;
        document.querySelector('#editProductForm [name=price]').value = product.price;
        document.querySelector('#editProductForm [name=quantity]').value = product.quantity;
        document.querySelector('#editProductForm [name=category]').value = product.category;
        document.querySelector('#editProductForm [name=description]').value = product.description;

        $("#editProductModal").modal("show");
    });

    $('.deleteProductBtn').on('click', function(event) {
        event.preventDefault();
        const row = $(this).closest('tr');
        const productId = row.data('id');
        if (confirm('Are you sure you want to delete this product?')) {
            if (Product.removeProduct(productId)) {
                ImageUploader.deleteImage(productId);
                createProductTable();
                successMassage();
            } else {
                failurMessage();
            }
        }
    });
}

document.getElementById('addProductForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.querySelector('#addProductForm [name=productName]').value;
    const price = document.querySelector('#addProductForm [name=price]').value;
    const quantity = document.querySelector('#addProductForm [name=quantity]').value;
    const category = document.querySelector('#addProductForm [name=category]').value;
    const description = document.querySelector('#addProductForm [name=description]').value;
    const image = document.querySelector('#addProductForm [type=file]').files[0];

    if (!productNameRegex.test(name)) {
        failurMessage("Product name must only contain letters and spaces.");
        return;
    }
    if (!categoryRegex.test(category)) {
        failurMessage("Product category must only contain letters and spaces.");
        return;
    }

    Product.addProduct(name, price, quantity, category, description,userSession.id, userSession.role);
    const id = Product.getAllProducts().pop().id;
    ImageUploader.saveImage(id, image);
    $("#addProductForm")[0].reset();
    $("#addProductModal").modal("hide");

    createProductTable();
    successMassage('Product added successfully!');
});

document.getElementById('editProductForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.querySelector('#editProductForm [name=productName]').value;
    const price = document.querySelector('#editProductForm [name=price]').value;
    const quantity = document.querySelector('#editProductForm [name=quantity]').value;
    const category = document.querySelector('#editProductForm [name=category]').value;
    const description = document.querySelector('#editProductForm [name=description]').value;
    const image = document.querySelector('#editProductForm [type=file]').files[0];

    if (!productNameRegex.test(name)) {
        failurMessage("Product name must only contain letters and spaces.");
        return;
    }
    if (!categoryRegex.test(category)) {
        failurMessage("Product category must only contain letters and spaces.");
        return;
    }

    if (Product.updateProduct(updateProductId, name, price, quantity, category, description,userSession.id, userSession.role)) {
        if (image) {
            ImageUploader.updateImage(updateProductId, image);
        }
        $("#editProductForm")[0].reset();
        $("#editProductModal").modal("hide");

        createProductTable();
        successMassage();
    } else {
        throw "Error updating product. Please try again.";
    }
});

createProductTable();
  