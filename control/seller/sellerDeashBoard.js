import { User } from '../../modules/base/userModule.js';
import Admin from "../../modules/adminModule.js";
import Product from "../../modules/productModule.js";
import Customer from "../../modules/customerModule.js";
import ImageUploader from "../../modules/imageModule.js";
import Seller from "../../modules/sellerModule.js";
import Cart from "../../modules/cartModule.js";
import {successMassage, failurMessage,adminOrSellerSessionValidation, id, role} from '../../control/base.js';

adminOrSellerSessionValidation();


function sellersCount() {
  const totalSellers = document.getElementById("totalIncome");
  totalSellers.innerText = Cart.calculateTotalOrderPrice().toFixed(2);
  
}

function customersCount() {
  const totalCustomers = document.getElementById("totalCustomers");
  totalCustomers.innerHTML = Customer.totalCustomersNumber();
}

function ordersCount() {
  const totalOrders = document.getElementById("totalOrders");
  totalOrders.innerText = Cart.calculateTotalOrderCount();
}

function avgOrderValue() {
  document.getElementById("averageOrderValue").innerText = Cart.calculateAverageOfCarts().toFixed(2);
}

function salesChart() {
  const cartData = Cart.calculateTotalOrderPricePerMonth();
  const labels = cartData.map(data => data.month);
  const values = cartData.map(data => data.total);
  console.log(labels);
  console.log(values);

  const salesCtx = document.getElementById("salesChart").getContext("2d");
  new Chart(salesCtx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Sales",
          data: values,
          borderColor: "#fdbe02",
          tension: 0.4,
          fill: false,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

sellersCount();
customersCount();
ordersCount();
avgOrderValue();
salesChart();
