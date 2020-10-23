import { User, Settings } from "./model";


export async function fbSaveSettings(uid: string, settings: Settings) {
    const db = firebase.firestore();
    await db.collection('settings').doc(uid).set(settings);
}