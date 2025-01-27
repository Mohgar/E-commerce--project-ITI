import StorageManager from './base/storageModule.js'
import {UserFields,User} from './base/userModule.js'


class SellerFields extends UserFields {
    constructor(id, name, age, email, phone, address) {
        super(id, name, age, email, phone, address);
        this.date = (new Date()).getDate() + '/' + ((new Date()).getMonth() + 1) + '/' + (new Date()).getFullYear();
        this.blocked=false;
        this.role='seller';
    }
}
export default class Seller extends User {
    static getAll() {
        return StorageManager.load('sellers') || [];
    }
    static getById(id) {  
        const admins = Seller.getAll();
        return admins.find(seller => seller.id === id);
    }

    static create( name, age, email, phone, address ,password) {
        const preSeller = Seller.getAll();
        const id = preSeller.length > 0 ? preSeller[preSeller.length - 1].id + 1 : 1;
        const seller = new SellerFields(id, name, age, email, phone, address);
        seller.password=password;
        preSeller.push(seller);
        StorageManager.save('sellers', preSeller);
        return seller;
    }
    static update(seller) {
        let sellers = Seller.getAll();
        sellers = sellers.map(s => s.id === seller.id ? seller : s);
        StorageManager.save('sellers', sellers);
        return  seller;
    }

    static delete(id) {
        let sellers = Seller.getAll();
        sellers = sellers.filter(seller => seller.id !== id);
        StorageManager.save('sellers', sellers);
        return true;
    }
    static activateSeller(sellerId){
        const seller= Seller.getById(sellerId)
        seller.blocked=false;
        Seller.update(seller)
        console.log('Seller activated successfully' ,Seller.getById(sellerId))
        return true;
    }
    static blockSeller(sellerId){
        const seller= Seller.getById(sellerId)
        seller.blocked=true;
        console.log('Seller blocked successfully' ,seller)
        Seller.update(seller);
        console.log('Seller blocked successfully' ,Seller.getById(sellerId))
        return true;
    }
    static getAciveSellers(){
        return Seller.getAll().filter(seller =>!seller.blocked)
    }
    static getBlockedSellers(){
        return Seller.getAll().filter(seller => seller.blocked)
    }
    static getSellersBySearch(){
        const sellers = Seller.getAll();
        return sellers.filter(seller => seller.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
    }
}

