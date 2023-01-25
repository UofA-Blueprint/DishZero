import DishAPI from './api';


//tests "qr code not registered"
test('addDishBorrow throws error for nonexistent qr', async () => {
    expect(DishAPI.addDishBorrow('0000','sggwwmeweJfsejfv')).rejects.toEqual(new Error('QR code not registered'));
});

//test should return document reference
test('addDishBorrow returns document reference', async () => {
    expect(DishAPI.addDishBorrow('123','sggwwmeweJfsejfv')).resolves.toEqual('docRef');
});

//test for incorrect data type parameters (qr and user)
test('addDishBorrow throws error for incorrect data type parameters', async () => {
    const qr = 7989;
    const user = 1234;
    expect(DishAPI.addDishBorrow(qr,user)).rejects.toEqual(new Error('QR code not registered'));
});

 