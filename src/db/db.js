
import Dexie from 'dexie';

// Crea l'istanza del database
const db = new Dexie('UserDatabase');

// Definisci la versione e le tabelle
db.version(1).stores({
    users: '++id,nome,cognome,email,password'
    // ++id è autoincrementante
});

// Esporta l'istanza per usarla altrove
export default db;