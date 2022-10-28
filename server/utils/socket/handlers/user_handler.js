import {auth} from '../../firebase.js';

export default class UserHandler{
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
    }

    async getUser(userId) {
        try {
            const user = await auth.getUser(userId);
            return user.toJSON();
        } catch (error) {
            console.log(error);
        }
        return null;
    }
}