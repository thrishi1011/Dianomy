const admin = require('firebase-admin');

// Initialize Firebase Admin with the project ID
// Since we don't have a service account key, this will only work if the user
// has the GOOGLE_APPLICATION_CREDENTIALS environment variable set or if run in a Google environment.
// However, for this task, I will provide the client-side code and ask the user to run it in the console
// because I cannot easily run an admin script here WITHOUT a service account JSON.

console.log("Please run the following code in your browser console while signed in as an admin (if applicable) or any user if rules allow:");
console.log(`
  db.collection('orders').get().then(snapshot => {
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    return batch.commit();
  }).then(() => console.log('Successfully cleared all orders.'))
    .catch(err => console.error('Error clearing orders:', err));
`);
