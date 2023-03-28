class Transaction {
    constructor(id, dish, user, returned, timestamp) {
        this.id = id;
        this.dish = dish;
        this.user = user;
        this.returned = returned;
        this.timestamp = timestamp?.toDate();
    }
}

module.exports = {
    Transaction
}