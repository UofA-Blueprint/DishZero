import Joi from 'joi'
import { User } from '../models/user'
import { auth, db } from './firebase'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

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

export const getUserByEmail = async (email: string) => {
    const snapshot = await db.collection('users').where('email', '==', email).get()
    if (snapshot.empty) {
        return null
    }
    let data = snapshot.docs[0].data()
    return {
        id: snapshot.docs[0].id,
        role: data.role,
        email: data.email,
    }
}

export const verifyRole = (role: string) => {
    return role === 'admin' || role === 'volunteer' || role === 'customer'
}

export const verifyType = (type: string) => {
    return type === 'role' || type === 'user'
}

export const validateUserRequestBody = (user: User) => {
    const schema = Joi.object({
        id: Joi.string().required(),
        role: Joi.string().required(),
        email: Joi.string().email().required(),
    })
    return schema.validate(user)
}

export const modifyUserRole = async (user: User, userClaims: DecodedIdToken) => {
    const { error } = validateUserRequestBody(user)
    if (error) {
        throw new Error(error.details[0].message)
    }

    if (user.id === userClaims.uid || user.email === userClaims.email) {
        throw new Error('Admin cannot modify their own role')
    }

    if (!verifyRole(user.role)) {
        throw new Error('Invalid role')
    }

    await auth.setCustomUserClaims(user.id, { role: user.role })
    await db.collection('users').doc(user.id).update({ role: user.role })
}
