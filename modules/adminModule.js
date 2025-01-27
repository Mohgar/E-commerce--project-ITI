import StorageManager from './base/storageModule.js'
import {UserFields,User} from './base/userModule.js'

class AdminFields extends UserFields {
    constructor(id, name, age, email, phone, address) {
        super(id, name, age, email, phone, address);
        this.role = 'admin';
        
    }
}
export default class Admin extends User {    
    static getAll() {
        return StorageManager.load('admins') || [];
    }
    static getById(id) { 
        const admins = Admin.getAll();
        return admins.find(admin => admin.id === id);
    }
    
    static create(name, age, email, phone, address,password) {
        const admins = Admin.getAll();
        const id = admins.length > 0 ? admins[admins.length - 1].id + 1 : 1;
        console.log(id)
        const admin = new AdminFields(id, name, age, email, phone, address);
        admin.password=password;
        admins.push(admin);
        StorageManager.save('admins', admins);
    }

    static update(id, name, age, email, phone, address,password) {
        const admin = new AdminFields(id, name, age, email, phone, address);
        admin.password=password;
        let admins = Admin.getAll();
        admins = admins.map(a => a.id === id ? admin : a);
        StorageManager.save('admins', admins);
    }

    static delete(id) {
        let admins = Admin.getAll();
        admins = admins.filter(admin => admin.id !== id);
        StorageManager.save('admins', admins);
    }
}
