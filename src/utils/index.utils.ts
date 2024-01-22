export const hasEmptyValue = (obj: any): boolean => {
    for (const key in obj) {
        if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
            return true;
        }
    }
    return false;
};