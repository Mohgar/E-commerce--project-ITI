import StorageManager from './storageModule.js'

export class UserFields {
    constructor(id, name, age, email, phone, address) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.email = email;
        this.password = '';
        this.phone = phone;
        this.address = address;
    }
}

class UserSession {
    constructor(userId, role) {
        this.userId = userId;
        this.role = role;
    }
}



export class User {
    constructor() {
        if (new.target === User) {
            throw new Error("Cannot instantiate an abstract class.");
        }
    }

    static getAll() {
        throw new Error("Abstract method 'getAll' must be implemented by subclass.");
    }

    static create(fields) {
        throw new Error("Abstract method 'create' must be implemented by subclass.");
    }

    static update(fields) {
        throw new Error("Abstract method 'update' must be implemented by subclass.");
    }

    static delete(id) {
        throw new Error("Abstract method 'delete' must be implemented by subclass.");
    }


    ///////////////////////////    validation methods    ////////////////////////////

    static nameValidation(name) {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (nameRegex.test(name)) {
            return 1;
        } else {
            return "Not valid user name";
        }
    }
    static passwordValidation(password) {
        // At least 6 characters long
        // Contains at least one letter
        // Contains at least one digit
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (passwordRegex.test(password)) {
            return 1;
        } else {
            return `Password not vaild:
                    1-At least 6 characters long
                    2-Contains at least one letter
                    3-Contains at least one digit
            `
        }
    }
    static emailValidation(email) {
            const emailRegex = /^[a-zA-Z][^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        //validate id the email is used by anothe user
    static emailIsUnique(email, users) {
        if (users.every(user => user.email !== email)) {
            return 1;
        } else {
            return "Duplicated email"
        }
    }
    static phoneValidation(phone) {
        const phoneRegex = /^(?:\+20|0)?1[0125]\d{8}$/;
        if (phoneRegex.test(phone)) {
            return 1;
        } else {
            return "Not vaild phone number"
        }
    }
    static addressValidation(address) {
        //const addressRegex=/^\d+\s[A-z]+\s[A-z]+,\s[A-z]+\s[A-z]{2}\s\d{5}$/
        const addressRegex = /^[a-zA-Z0-9\s,]+$/;
        if (addressRegex.test(address)) {
            return 1;
        } else {
            return "Not vaild addresse"
        }
    }
    static ageValidation(age) {
        if (age >= 15 && age <= 120) {
            return 1;
        } else {
            return "You need to be older than 15 years old to sign up"
        }
    }

    static setUserSession(id, role) {
        console.log(id, role);
        const userSession = new UserSession(id, role);
        console.log(userSession);
        StorageManager.save('userSession', userSession);
    }

    static getUserSession() {
        return StorageManager.load('userSession');
    }
    static logout() {
        StorageManager.remove('userSession');
    }



}