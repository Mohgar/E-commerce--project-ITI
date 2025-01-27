import { User } from '../modules/base/userModule.js'
import Admin from "../modules/adminModule.js";
import Seller from "../modules/sellerModule.js";
import Customer from "../modules/customerModule.js";
import { submitCustomer, updateCustomer, successMassage, failurMessage, sessionValidationOfCustomerSide, id, role } from './base.js';
import Product from '../modules/productModule.js';
sessionValidationOfCustomerSide();
updateCustomer();
submitCustomer();
$('#signup-form').on('submit', function(event) {
    event.preventDefault();
    //to fetch data
    var name = $('#name').val();
    var address = $('#address').val();
    var phone = $('#phone').val();
    var age = $('#age').val();
    var email = $('#email').val();
    var password = $('#password').val();
    var validation = [User.nameValidation(name), User.addressValidation(address),
        User.phoneValidation(phone), User.ageValidation(age),
        User.emailValidation(email), User.emailIsUnique(email, Customer.getAll()),
        User.passwordValidation(password)
    ];
    var validation = validation.filter(function(valid) { return valid != 1 })
    if (validation.length == 0) {
        if (Customer.create(name, address, phone, age, email, password)) {
            const createdCustomer = Customer.getAll()[Customer.getAll().length - 1];
            User.setUserSession(createdCustomer.id, createdCustomer.role);
            $('#signup-form').trigger('reset');
            $('#signup').modal("hide");
            location.reload();
        } else {
            failurMessage('the account not created');
        }
    } else {
        // alert(validation.join("\n"))
        failurMessage(validation)
    }
});


$('#signin-form').on('submit', function(event) {
    event.preventDefault();
    console.log('login form');

    //to fetch data
    var email = $('#signInEmail').val();
    var password = $('#signinPassword').val();
    var customer = Customer.getAll().find(u => u.email == email);
    var admin = Admin.getAll().find(u => u.email == email);
    var seller = Seller.getAll().find(u => u.email == email);
    console.log(email, password);
    console.log(customer);
    console.log(admin);
    console.log(seller);

    function loginSuccess(id, role) {
        User.setUserSession(id, role);
        $('#signin-form').trigger('reset');
        $('#signin').modal("hide");
        location.reload();
    }


    if (customer && customer.password == password && !customer.blocked && !seller.blocked) {
        loginSuccess(customer.id, customer.role)
    } else if (admin && admin.password == password) {
        loginSuccess(admin.id, admin.role)
    } else if (seller && seller.password == password) {
        loginSuccess(seller.id, seller.role)
    } else {
        console.log("Invalid password")
        failurMessage("User not found")
    }
})

if (Admin.getAll().length == 0) {
    Admin.create("admin", 30, "admin123@gmail.com", '01271236266', 'alexandria', "a123456789")
}

if (Product.getAllProducts().length == 0) {


    fetch('temp/products.json')
        .then(response => response.json())
        .then(data => {
            const jsonString = JSON.stringify(data);
            localStorage.setItem('products', jsonString);
            console.log('Data stored in local storage');
        })
        .catch(error => console.error('Error fetching JSON data:', error));


    fetch('temp/images.json')
        .then(response => response.json())
        .then(data => {
            const jsonString = JSON.stringify(data);
            localStorage.setItem('imags', jsonString);
            console.log('Data stored in local storage');
        })
        .catch(error => console.error('Error fetching JSON data:', error));



}