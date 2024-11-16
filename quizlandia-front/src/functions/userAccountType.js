import { backEndpoint } from "../envs";

export const userAccountType = async (uid) => {
    let res;

    await fetch(backEndpoint.getUser + uid)
        .then(response => response.json())
        .then(data => {
            res = data.accountType;
        })
        .catch((error) => {
            res = undefined;
            console.error('Error:', error);
        });
    
    return res;
}