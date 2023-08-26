const adminApi = {
    serverAddress: "http://localhost:3000",

    getAllDishes: async function() {
        const allDishesReq = await fetch(`${this.serverAddress}/dish/all`);
        if (allDishesReq.ok) {
            return await allDishesReq.json();
        }
        // encountered error
        console.log(`Couldn't get the dish data: ${allDishesReq.status}`);
        return [];
    }
};

export default adminApi;