import Customer from "../../modules/customerModule.js";
import {successMassage, failurMessage,adminOrSellerSessionValidation, id, role} from '../../control/base.js';

adminOrSellerSessionValidation();

// import { successMessage, failureMessage, sessionValidation, id, role } from '../../control/base.js';
// sessionValidation();

///////////////////////////////// unblock customer ///////////////////////////////
let unblockCustomers = Customer.getUnblockedCustomer();
let blockCustomers = Customer.getBlockedCustomer();

const successMessage = document.getElementById('successMessage');
const failureMessage = document.getElementById('failureMessage');

function createCustomerTable() {
    document.querySelector('#customers tbody').innerHTML = "";
    document.querySelector('#blocked tbody').innerHTML = "";

    unblockCustomers.forEach(function (customer) {
        let row = `
            <tr data-id="${customer.id}">
                <td class="text-truncate" style="max-width:10rem">${customer.name}</td>
                <td class="text-truncate" style="max-width:10rem">${customer.email}</td>
                <td>${customer.date}</td>
                <td>23</td>
                <td class="text-${customer.blocked ? 'danger' : 'success'}">${customer.blocked ? 'blocked' : 'active'}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-${customer.blocked ? 'success' : 'warning'} me-1 ${customer.blocked ? 'activateCustomer-btn' : 'blockCustomer-btn'}" data-bs-toggle="modal" data-bs-target="#blockCustomerModal" data-customerId="${customer.id}">${customer.blocked ? 'activate' : 'block'}</button>
                </td>
            </tr>`;
        document.querySelector('#customers tbody').innerHTML += row;
    });

    blockCustomers.forEach(function (customer) {
        let row = `
            <tr data-id="${customer.id}">
                <td class="text-truncate" style="max-width:10rem">${customer.name}</td>
                <td class="text-truncate" style="max-width:10rem">${customer.email}</td>
                <td>${customer.date}</td>
                <td>23</td>
                <td class="text-${customer.blocked ? 'danger' : 'success'}">${customer.blocked ? 'blocked' : 'active'}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-${customer.blocked ? 'success' : 'warning'} me-1 ${customer.blocked ? 'activateCustomer-btn' : 'blockCustomer-btn'}" data-bs-toggle="modal" data-bs-target="#blockCustomerModal" data-customerId="${customer.id}">${customer.blocked ? 'activate' : 'block'}</button>
                </td>
            </tr>`;
        document.querySelector('#blocked tbody').innerHTML += row;
    });

    addEventListeners();
}

createCustomerTable();

function addEventListeners() {
    $('.activateCustomer-btn').on('click', function (e) {
        e.preventDefault();
        const row = $(this).closest('tr');
        const customerId = row.data('id');
        if (Customer.unblock(customerId)) {
            createCustomerTable();
            showSuccessMessage();
        } else {
            showFailureMessage();
        }
    });

    $('.blockCustomer-btn').on('click', function (e) {
        e.preventDefault();
        const row = $(this).closest('tr');
        const customerId = row.data('id');
        if (Customer.block(customerId)) {
            createCustomerTable();
            showSuccessMessage();

            location.reload();
        } else {
            showFailureMessage();
        }
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
