import { User } from '../../modules/base/userModule.js';
import Admin from "../../modules/adminModule.js";
import Product from "../../modules/productModule.js";
import Customer from "../../modules/customerModule.js";
import ImageUploader from "../../modules/imageModule.js";
import Seller from "../../modules/sellerModule.js";
import { successMassage, failurMessage, adminOrSellerSessionValidation, id, role } from '../../control/base.js';

adminOrSellerSessionValidation();

// import {successMassage, failurMessage, sessionValidation, id, role} from '../../control/base.js';
// sessionValidation();

const userSession = User.getUserSession();
let allSeller = Seller.getAll();
let updateSellerId;
const successMessage = document.getElementById('successMessage');
const failureMessage = document.getElementById('failureMessage');

function addSeller(seller) {
    const newRow = `<tr data-id="${seller.id}">
                    <td>${seller.name}</td>
                    <td id="user-name">${seller.email}</td>
                    <td>${seller.date}</td>
                    <td>${seller.age}</td>
                    <td class="${seller.blocked?"text-danger":"text-success"} ">${seller.blocked?"blocked":"active"}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-info editSellerBtn" data-bs-toggle="modal" data-bs-target="#editSellerModal" data-sellerId="${seller.id}">Edit</button>
                        <button class="btn btn-sm btn-danger deleteSellerBtn" data-sellerId="${seller.id}">Delete</button>   
                        <button class="btn btn-sm btn-${seller.blocked?"success":"warning"} me-1 ${seller.blocked?"activateSeller-btn":"blockSeller-btn"}" data-bs-toggle="modal" data-bs-target="#blockSellerModal" data-sellerId="${seller.id}">${seller.blocked?"activate":"block"}</button>
                    </td>
                  </tr>`;
    $("#sellerTableBody").append(newRow);
}

function createSellerTable() {
    $("#sellerTableBody").html('');
    allSeller.forEach(addSeller);
    addEventListeners();
}

function addEventListeners() {
    $('.editSellerBtn').on('click', function(event) {
        event.preventDefault();
        const row = $(this).closest('tr');
        const sellerId = row.data('id');
        const seller = Seller.getById(sellerId);
        updateSellerId = sellerId;

        const editForm = document.querySelector('#editSellerForm');
        if (editForm) {
            editForm.querySelector('[name=name]').value = seller.name;
            editForm.querySelector('[name=phone]').value = seller.phone;
            editForm.querySelector('[name=address]').value = seller.address;
            editForm.querySelector('[name=age]').value = seller.age;
            editForm.querySelector('[name=email]').value = seller.email;
            editForm.querySelector('[name=password]').value = seller.password;
        }

        $("#editSellerModal").modal("show");
    });

    document.getElementById('editSellerForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.querySelector('#editSellerForm [name=name]').value;
        const address = document.querySelector('#editSellerForm [name=address]').value;
        const phone = document.querySelector('#editSellerForm [name=phone]').value;
        const age = document.querySelector('#editSellerForm [name=age]').value;
        const email = document.querySelector('#editSellerForm [name=email]').value;
        const password = document.querySelector('#editSellerForm [name=password]').value;

        const validation = [
            User.nameValidation(name),
            User.addressValidation(address),
            User.phoneValidation(phone),
            User.ageValidation(age),
            User.passwordValidation(password)
        ];
        const seller = Seller.getById(updateSellerId);
        seller.name = name;
        seller.address = address;
        seller.phone = phone;
        seller.age = age;
        seller.email = email;
        seller.password = password;

        if (validation.every(Boolean)) {
            if (Seller.update(seller)) {
                document.getElementById('editSellerForm').reset();
                $("#editSellerModal").modal("hide");
                createSellerTable();
                showSuccessMessage();
            } else {
                console.log("not updated");
                showFailureMessage();
            }
        } else {
            console.log("Validation failed");
            showFailureMessage();
        }
    });

    $('.deleteSellerBtn').on('click', function(event) {
        event.preventDefault();
        const row = $(this).closest('tr');
        const sellerId = row.data('id');
        if (confirm('Are you sure you want to delete this seller?')) {
            if (Seller.delete(sellerId)) {
                row.remove();
                showSuccessMessage();
            } else {
                showFailureMessage();
            }
        }
    });
    $('.activateSeller-btn').click(function(e) {
        console.log('activateSeller')
        e.preventDefault();
        const row = $(this).closest('tr');
        const sellerId = row.data('id');
        if (Seller.activateSeller(sellerId)) {
            createSellerTable();
            showSuccessMessage();
        } else {
            showFailureMessage();
        }

    })
    $('.blockSeller-btn').click(function(e) {
        console.log('blockSeller')
        e.preventDefault();
        const row = $(this).closest('tr');
        const sellerId = row.data('id');
        if (Seller.blockSeller(sellerId)) {
            createSellerTable();
            showSuccessMessage();
            location.reload();
        } else {
            showFailureMessage();

        }
    });

    // filter ********************************

    $('.filter-btns .all').click(function(e) {
        e.preventDefault();
        allSeller = Seller.getAll();
        createSellerTable();
        $(this).parent().children().removeClass('active');
        $(this).addClass('active');
    });

    $('.filter-btns .activated').click(function(e) {
        e.preventDefault();
        allSeller = Seller.getAciveSellers();
        createSellerTable();
        $(this).parent().children().removeClass('active');
        $(this).addClass('active');
    });

    $('.filter-btns .blocked').click(function(e) {
        e.preventDefault();
        allSeller = Seller.getBlockedSellers();
        createSellerTable();
        $(this).parent().children().removeClass('active');
        $(this).addClass('active');
    });
}

function showSuccessMessage() {
    successMessage.style.display = 'block';
    setTimeout(() => successMessage.style.display = 'none', 3000);
}

function showFailureMessage() {
    failureMessage.style.display = 'block';
    setTimeout(() => failureMessage.style.display = 'none', 3000);
}

createSellerTable();

document.getElementById('addSellerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.querySelector('#addSellerForm [name=name]').value;
    const address = document.querySelector('#addSellerForm [name=address]').value;
    const phone = document.querySelector('#addSellerForm [name=phone]').value;
    const age = document.querySelector('#addSellerForm [name=age]').value;
    const email = document.querySelector('#addSellerForm [name=email]').value;
    const password = document.querySelector('#addSellerForm [name=password]').value;

    const seller = Seller.create(name, age, email, phone, address, password);
    document.getElementById('addSellerForm').reset();
    $("#addSellerModal").modal("hide");
    location.reload();
    successMassage('Seller added successfully!');
});