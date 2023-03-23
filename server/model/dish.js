class Dish {
    constructor(id, qid, registered, type) {
        this.id = id;
        this.qid = qid;
        this.registered = registered?.toDate();
        this.type = type;
    }
}

module.exports = {
    Dish
}