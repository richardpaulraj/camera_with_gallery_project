// Task:
//1) Open a Database
//2) Create objectStore  --> This can be ONLY created / modified in upgradeneeded event
//3) Make transactions
let db;
let openRequest = indexedDB.open('myDatabase');   //Whe have to make a request to indexedDB API to create a database it bydefault comes with version 1 if u wanted to upgrade it to higher version put comma beside the dbname and add 2

// there are 3 events
openRequest.addEventListener('success',(e)=>{
    console.log('DB Success')
    db = openRequest.result;
})

openRequest.addEventListener('error', (e)=>{
    console.log('DB Error')
})

openRequest.addEventListener('upgradeneeded', (e)=>{
    console.log('DB Upgraded and also for initial DB creation')
    db = openRequest.result;

    console.log(db)

    db.createObjectStore('video', {keyPath : 'id'}) //This keyPath: 'id' should have the same name i.e ` id ` in the videoEntry var in script.js
    db.createObjectStore('image', {keyPath : 'id'})

})// when you open this for the first time or upgrading the version then it will first console.log this one and after this success one