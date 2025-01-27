import Cart from '../modules/cartModule.js';
import { User } from '../modules/base/userModule.js';
import Customer from '../modules/customerModule.js';
export const id = User.getUserSession() ?.userId ?? 0;
export const role = User.getUserSession() ?.role ?? ""; 

const baseURL = location.origin;
console.log(id, role)
$('.cart-items-count').text(Cart.getCartProductCount(id, role));

export function sessionValidationOfCustomerSide() {
    $('#logedDropdown').hide();
    $('#notLogedDropdown').show();
    $('#adminProfile').hide();
    $('#customerSetting').hide();
    $('#sellerProfile').hide();

    if (id && (role == 'customer' || role == 'admin' || role == 'seller')) {
        $('#logedDropdown').show();
        $('#notLogedDropdown').hide();

        if (id && role == 'admin') {
            // User's role is 'admin'
            $('#adminProfile').show();
        } else if (id && role == 'customer') {
            console.log("show stings");
            // User's role is 'customer'
            $('#customerSetting').show();
        } else if (id && role == 'seller') {
            // User's role is 'seller'
            $('#sellerProfile').show();
        }
    } else {
        if (window.location.href != `${baseURL}/view/template/index.html`) {
            window.location.href = `${baseURL}/view/template/index.html`;
        }
    }
}

export function adminOrSellerSessionValidation() {
    if (role !== 'admin' && role !== 'seller') {
        if (window.location.href != `${baseURL}/view/template/index.html`) {
            window.location.href = `${baseURL}/view/template/index.html`;
        }
    }
}





const failureMessageDiv = $('<div></div>', {
    class: 'alert alert-danger failure-message left-50',
    text: 'Failure! Something went wrong.',
    style: 'display: none; z-index:2000',
    id: 'failureMessage'
});
$('body').append(failureMessageDiv);

const successMessageDiv = $('<div></div>', {
    class: 'alert alert-success success-message',
    text: 'Success! Your action was completed.',
    style: 'display: none; z-index:2000',
    id: 'successMessage'
});
$('body').append(successMessageDiv);


export function successMassage(message) {
    $('#successMessage').html(message).show();
    setTimeout(() => {
        $('#successMessage').hide();
    }, 3000);
}

export function failurMessage(message) {
    $('#failureMessage').html(message).show();
    setTimeout(() => {
        $('#failureMessage').hide();
    }, 3000);
}


// export function logout(){
$('.logoutBtn').on('click', function(e) {
    e.preventDefault();
    User.logout();
    window.location.href = `${baseURL}/view/template/index.html`;
});
// }



const customer = Customer.getById(id);
console.log(customer);

export function updateCustomer() {
    let modal = `
    <div class="modal fade" id="updateCustomerModal" tabindex="-1" aria-labelledby="updateCustomerModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header d-flex align-items-start">
            <h3 class="mb-3" id="updateCustomerModalLabel">Update your info</h3>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="signup-container">
              <form id="updateCustomer-form">
                <div class="mb-3">
                    <label for="name-modal" class="form-label">Name</label>
                    <input type="text" id="name-modal" class="form-control" placeholder="Name" required>
                </div>
                <div class="mb-3">
                    <label for="address-modal" class="form-label">Address</label>
                    <input type="text" id="address-modal" class="form-control" placeholder="Address" required>
                </div>
                <div class="mb-3">
                    <label for="phone-modal" class="form-label">Phone</label>
                    <input type="text" id="phone-modal" class="form-control" placeholder="Phone" required>
                </div>
                <div class="mb-3">
                    <label for="age-modal" class="form-label">Age</label>
                    <input type="number" id="age-modal" class="form-control" placeholder="Age" required>
                </div>
                <div class="mb-3">
                    <label for="email-modal" class="form-label">Email</label>
                    <input type="email" id="email-modal" class="form-control" placeholder="Email" required>
                </div>
                <div class="mb-3">
                    <label for="password-modal" class="form-label">Password</label>
                    <input type="password" id="password-modal" class="form-control" placeholder="Password" required>
                </div>
                <button type="submit" class="btn btn-primary">Update</button>
              </form>              
            </div>
          </div>
        </div>
      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modal);

    // Show the modal
    // $('#updateCustomerModal').modal('show');

    // Fill the form with customer data after the modal is shown
    $('#updateCustomerModal').on('shown.bs.modal', function() {
        $('#name-modal').val(customer.name);
        $('#address-modal').val(customer.address);
        $('#phone-modal').val(customer.phone);
        $('#age-modal').val(customer.age);
        $('#email-modal').val(customer.email);
        $('#password-modal').val(customer.password);
    });

    // Attach the submit event handler after the modal is shown
    $('#updateCustomerModal').on('shown.bs.modal', function() {
        submitCustomer();
    });
}

export function submitCustomer() {
    console.log('submitCustomer');
    $('#updateCustomer-form').on('submit', function(event) {
        event.preventDefault();

        // Read form values
        const name = $('#name-modal').val();
        const address = $('#address-modal').val();
        const phone = $('#phone-modal').val();
        const age = $('#age-modal').val();
        const email = $('#email-modal').val();
        const password = $('#password-modal').val();

        // Log the values to confirm they are being read correctly
        console.log('Name:', name);
        console.log('Address:', address);
        console.log('Phone:', phone);
        console.log('Age:', age);
        console.log('Email:', email);
        console.log('Password:', password);

        // Update the customer object with new values
        customer.name = name;
        customer.address = address;
        customer.phone = phone;
        customer.age = age;
        customer.email = email;
        customer.password = password;

        // Log the updated customer object
        console.log(customer);

        // Update the customer in the system
        Customer.update(customer);
        successMassage();
        // Close the modal
        // $('#updateCustomerModal').modal('hide');
    });
}

// export fill the modal form with selected customer