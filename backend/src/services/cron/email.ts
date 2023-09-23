export const validateEmailFields = (fields: string[]): boolean => {
    let validFields = ['subject', 'body']
    for (let field of fields) {
        if (!validFields.includes(field)) {
            return false
        }
    }
    return true
}

export const validateUpdateEmailBody = (body: any, fields: string[]): boolean => {
    for (let field of fields) {
        if (body[field] === undefined) {
            return false
        }
    }
    return true
}
