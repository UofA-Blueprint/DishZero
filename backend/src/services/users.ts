import { User } from '../models/user'
import { db } from './firebase'

export const getUsersWithRole = async (role: string) => {
    const snapshot = await db.collection('users').where('role', '==', role).get()
    let users = <Array<User>>[]
    snapshot.forEach((doc) => {
        let data = doc.data()
        users.push({
            id: doc.id,
            role: data.role,
            email: data.email,
        })
    })
    return users
}

export const getAllUsers = async () => {
    const snapshot = await db.collection('users').get()
    let users = <Array<User>>[]
    snapshot.forEach((doc) => {
        let data = doc.data()
        users.push({
            id: doc.id,
            role: data.role,
            email: data.email,
        })
    })
    return users
}

export const verifyRole = (role: string) => {
    return role === 'admin' || role === 'volunteer' || role === 'customer'
}
