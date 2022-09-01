

export const isValidPassword = (str: string) => {
    const re = new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
    return re.test(str);
};

export const isValidEmail = (str: string) => {
    const re = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return re.test(str);
};

export const isValidName = (str: string) => {
    const re = new RegExp(/^[a-zA-Z0-9_]{3,25}$/);
    return re.test(str);
};