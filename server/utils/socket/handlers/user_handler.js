import {auth, firestore} from '../../firebase.js';

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

    async handleIdentity(msg, sock) {
        if (!msg || !msg.auth.uid) {
            return false;
        }
        const user = await this.getUser(msg.auth.uid);
        const {phoneNumber, createdAt} = user;
        // check if user is already connected
        const existingConnections = this.dispatcher.connections.filter((sock) => sock.user?.uid === msg.auth.uid);
        if (existingConnections.length > 0) {
            // disconnect existing connections
            existingConnections.forEach((sock) => {
                sock.disconnect();
            });
            // remove existing connections
            this.dispatcher.connections = this.dispatcher.connections.filter((sock) => sock.user?.uid !== msg.auth.uid);
        }
        
        // safe check if the user in msg.auth is the same as the user in the database
        if (user && msg.auth.phoneNumber === phoneNumber) {
            sock.user = user;
            return true;
        }
        return false;
    }

    async fetchProfile(userId) {
        const user = await firestore.collection(`profiles`).doc(userId).get();
        if (user.exists) {
            return user.data();
        }
        return null;
    }

    async updateProfile(userId, data) {
        await firestore.collection(`profiles`).doc(userId).update(data);
    }
}