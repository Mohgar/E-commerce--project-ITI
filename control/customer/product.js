import {User} from '../../modules/base/userModule.js'
import Admin from "../../modules/adminModule.js";
import Seller from "../../modules/sellerModule.js";
import Customer from "../../modules/customerModule.js";
import ImageUploader from "../../modules/imageModule.js";
import Product from "../../modules/productModule.js";
import Cart from "../../modules/cartModule.js";
import {submitCustomer,updateCustomer,sessionValidationOfCustomerSide,id,role, failurMessage, successMassage} from '../base.js';
sessionValidationOfCustomerSide();
updateCustomer();
submitCustomer();


let allProducts= Product.getAllProducts();
let priceRange = 10000;
let filterByCategory = '';
const productsPerPage = 6;
let currentPage = 1;
let isFirstLoad = true;




function showElements() {
    $('#productContainer').html('')
    //console.log('allllllll ',allProducts);
    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = allProducts.slice(start, end);

    let productContainer = document.getElementById('productContainer');
    productContainer.classList.add('fade-out');

    setTimeout(() => {
        productContainer.innerHTML = '';
        let row;

        productsToShow.forEach((product, index) => {
            if (index % 3 === 0) {
                row = document.createElement('div');
                row.className = 'row row-cols-1 row-cols-lg-3 mt-4';
                productContainer.appendChild(row);
            }
            //console.log(product);
            row.innerHTML += showProduct(product).outerHTML; // Use outerHTML to append the product item
        });

        productContainer.classList.remove('fade-out');
    }, 500); // Match the transition duration

    showPagination(totalPages);

    if (!isFirstLoad) {
        scrollToHeaderBottom();
    } else {
        isFirstLoad = false;
    }
}

function showProduct(product) {
    // Create the product div
    const productItem = document.createElement('div');
    productItem.className = `col product-item position-relative`; ;
    productItem.dataset.category = String(product.category).toLowerCase(); // add data-category attribute
    productItem.dataset.price = product.price; // add data-price
    productItem.dataset.id = product.id; // add data-id
    
    const stock =document.createElement('div');
    stock.className = product.quantity > 0? 'badge bg-success' : 'badge bg-danger';
    stock.classList.add('stockAlarm');
    stock.textContent = product.quantity > 0? product.quantity+' In Stock' : ' Out of Stock';
    productItem.appendChild(stock);


    // Create the image div
    const itemImg = document.createElement('div');
    itemImg.className = 'featured-container p-5 item-img';

    // Add the product image
    // const img = document.createElement('img');
    // img.src = `img/img-products/product-${product.id}.png`;
    const img =ImageUploader.getImagesByProductId(product.id);
    console.log('showProduct: ', img);
    itemImg.appendChild(img);

    // Add the search icon
   // Assuming 'product' is an object with the necessary details


// Assuming 'itemImg' is a valid container element where you want to append the search icon

    const searchIcon = document.createElement('span');
    searchIcon.className = 'featured-search-icon search-icon';
    // searchIcon.setAttribute('data-bs-toggle', 'modal');
    // searchIcon.setAttribute('data-bs-target', '#productModal');
    searchIcon.innerHTML = '<i class="fas fa-search"></i>';
    itemImg.appendChild(searchIcon);

    // Add cart icon
    const cartLink = document.createElement('a');
    cartLink.href = '#';
    cartLink.className = `btn cart-link addToCart ${product.quantity==0?'d-none':'d-block'}` ;
    cartLink.textContent = 'Add to Cart';
    itemImg.appendChild(cartLink);
    productItem.appendChild(itemImg);

    // Add the product name
    const productName = document.createElement('h6');
    productName.className = 'text-center text-capitalize';
    productName.textContent = product.name;
    productItem.appendChild(productName);

    // Add the product price
    const productPrice = document.createElement('h6');
    productPrice.className = 'text-center';
    productPrice.textContent = `$${product.price}`;
    productItem.appendChild(productPrice);

    return productItem;
}

function showPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = 'page-item' + (i === currentPage ? ' active' : '');
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageItem.addEventListener('click',(event) => {
            event.preventDefault();
            currentPage = i;
            showElements();
        });
        pagination.appendChild(pageItem);
    }
}

function scrollToHeaderBottom() {
        setTimeout(() => {
            let headerBottom = document.querySelector('header').getBoundingClientRect().bottom;
            let absoluteBottom = headerBottom + window.pageYOffset;
            window.scrollTo({ top: absoluteBottom, behavior: 'smooth' });
        }, 100);
    };

showElements();





/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
document.getElementById('productContainer').addEventListener('click', function (e) {
    console.log("add to cart clicked");
    if(id && role){
        if (e.target && e.target.matches('a.addToCart')) {
            $('.cart-items-count').text(Cart.getCartProductCount(id,role));
            e.preventDefault();
            const productId = e.target.closest('.product-item').dataset.id;
            Cart.addProduct(id, role, productId);
            successMassage('Product is added to your cart');
        }
    }else{
        $('#signin').modal("show");
    }
});


$(function(){


document.getElementById('productContainer').addEventListener('click',function(e){
    if (e.target && e.target.matches('.fas.fa-search')){
        const productId = e.target.closest('.product-item').dataset.id;
        console.log(productId)
        const product=Product.getProductById(productId);
        
        document.getElementById("productName").innerText = product.name;
        document.getElementById("productPrice").innerText = product.price;
        document.getElementById("productDescription").innerText = product.description;
        const img =ImageUploader.getImagesByProductId(product.id);
        document.getElementById("productImage").innerHTML = "";
        document.getElementById("productImage").appendChild(img);
         
        $('#productModal').modal('show');

    }
    })
});

///////////////////////////////////// show the categories menu //////////////////////////////
function showCategories() {
    const categories = Product.categories();
    categories.push('all')
    //console.log(categories);
    let categoryContainer = document.getElementById('categories');
    for (let category of categories) {
        let item=document.createElement('li');
        item.className='list-group-item border-0 category-item';
        item.textContent=category;
        categoryContainer.appendChild(item);
    }   
}
showCategories();


///////////////////////////////////////// filter when the category or range is clicked //////////////////////////////
$('.category-item').on('click', function(e) {

    //console.log('preeessss')
    e.preventDefault();
    //console.log($(this).parent().children().removeClass('selected'));
    $(this).addClass('selected');
    filterByCategory = $(this).text();
    allProducts = Product.getProductByFilters(priceRange, filterByCategory);
   // console.log('filters ',allProducts);
    showElements();
});

$('#price-range').on('input', function(){
    priceRange = parseInt($(this).val());
    $('.maxPrice').text(priceRange);
    allProducts = Product.getProductByFilters(priceRange, filterByCategory);
    showElements();
});

///////////////////////////////////// search functionality //////////////////////////////
$(function () {
        // Search input
        $('#searchinput').on('input', function () {
            const text = $(this).val();
            allProducts = Product.getProductsBySearch(text);
            showElements();
        });
    });




// $(".addToCart").on('click',function(e){
//     console.log("add to cart clicked");
//     e.preventDefault();
//     const productId = $(this).data("id");
//     Cart.addProduct(id, role, productId);
//     alert("product is add to you cart");
// })



