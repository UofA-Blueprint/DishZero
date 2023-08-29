import Joi from 'joi'
import { User } from '../models/user'
import { auth, db } from '../internal/firebase'
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

export const getUserById = async (id: string) => {
    const snapshot = await db.collection('users').doc(id).get()
    let data = snapshot.data()
    if (!data) {
        return null
    }
    return {
        id: id,
        role: data.role,
        email: data.email,
    }
}

export const verifyIfUserAdmin = (userClaims: DecodedIdToken) => {
    return userClaims.role === 'admin'
}

export const verifyIfUserVolunteer = (userClaims: DecodedIdToken) => {
    return userClaims.role === 'volunteer'
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
        role: Joi.string(), // Role is not required
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

    if (user.role) {
        if (!verifyRole(user.role)) {
            throw new Error('Invalid role')
        }

        await auth.setCustomUserClaims(user.id, { role: user.role })
        await db.collection('users').doc(user.id).update({ role: user.role })
    } else {
        throw new Error('Role is not provided')
    }
}

export const modifyUserData = async (user: User, userClaims: DecodedIdToken) => {
    const { error } = validateUserRequestBody(user)
    if (error) {
        throw new Error(error.details[0].message)
    }

    // extract id from user object
    let { id, ...userData } = user
    if (Object.keys(userData).length === 0) {
        throw new Error('No data to update')
    }

    if (userData.role) {
        throw new Error('Cannot update role')
    }

    // Update all the given fields expect role
    await db
        .collection('users')
        .doc(user.id)
        .update({
            ...userData,
        })
}
