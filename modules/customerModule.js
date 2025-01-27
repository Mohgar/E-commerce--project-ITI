import StorageManager from './base/storageModule.js';
import { UserFields, User } from './base/userModule.js';

class CustomerFields extends UserFields {
    constructor(id, name, age, email, phone, address) {
        super(id, name, age, email, phone, address);
        this.date = (new Date()).getDate() + '/' + ((new Date()).getMonth() + 1) + '/' + (new Date()).getFullYear();
        this.blocked = false;
        this.role = 'customer';
    }
}
export default class Customer extends User {
    static getAll() {
        //retrive all customers from local storage else return empty arr
        return StorageManager.load('customers') || [];
    }
    static getById(id) {
        const customers = Customer.getAll();
        //fetches a specific customer by his id
        return customers.find(customer => customer.id === id);
    }
    static create(name, address, phone, age, email, password) {
        //retrive existing customers
        const preCustomer = Customer.getAll();
        //generate new id by incr las id by 1
        const id = preCustomer.length > 0 ? preCustomer[preCustomer.length - 1].id + 1 : 1;
        //create new instance of CustomerFields
        const customer = new CustomerFields(id, name, age, email, phone, address);
        //set pass and add to customer list
        customer.password = password;
        preCustomer.push(customer);
        //save to local storage
        StorageManager.save('customers', preCustomer);
        return customer;
    }

    static update(customer) {
        let customers = Customer.getAll();
        //replace the existing customer with same id in the list
        customers = customers.map(c => c.id === customer.id ? customer : c);
        StorageManager.save('customers', customers);
        return customer;
    }

    static delete(id) {
        let customers = Customer.getAll();
        //keeps all customers id except whoes provided as they are deleted
        customers = customers.filter(customer => customer.id !== id);
        StorageManager.save('customers', customers);
        return true;
    }
    static block(id) {
        const customer = Customer.getById(id);
        customer.blocked = true;
        Customer.update(customer);
        return true;
    }
    static unblock(id) {
        const customer = Customer.getById(id);
        customer.blocked = false;
        Customer.update(customer);
        return true;
    }
    static getBlockedCustomer() {
        const customers = Customer.getAll();
        return customers.filter(customer => customer.blocked);
    }
    static getUnblockedCustomer() {
        const customers = Customer.getAll();
        return customers.filter(customer => !customer.blocked);
    }
    static totalCustomersNumber() {
        const customers = Customer.getAll();
        return customers.length;
    }

}