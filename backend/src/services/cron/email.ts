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

export const convertToUTC = (minute: number, hour: number, day: string) : [number, number, string] => {
    const days : {[key : string]: string}= {
        "MON": "TUE",
        "TUE": "WED",
        "WED": "THU",
        "THU": "FRI",
        "FRI": "SAT",
        "SAT": "SUN",
        "SUN": "MON",
    }
    const date = new Date()
    const month = date.getMonth()
    let increment = 6
    // mst/mdt
    if (month <= 2 || month >= 11) {
        increment = 7
    }

    const newHour = (hour+increment)%24
    if (newHour < hour) day = days[day]

    return [minute, newHour, day]
}


export const convertToMT = (minute: number, hour: number, day: string) : [number, number, string] => {
    const days : {[key : string]: string}= {
        "MON": "SUN",
        "TUE": "MON",
        "WED": "TUE",
        "THU": "WED",
        "FRI": "THU",
        "SAT": "FRI",
        "SUN": "SAT",
    }
    const date = new Date()
    const month = date.getMonth()
    let increment = -6
    // mst/mdt
    if (month <= 2 || month >= 11) {
        increment = -7
    }

    const newHour = (hour+increment+24)%24
    if (newHour < hour) day = days[day]

    return [minute, newHour, day]
}