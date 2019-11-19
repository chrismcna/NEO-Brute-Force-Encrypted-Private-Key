const { default: Neon, api, wallet, tx, rpc } = require("@cityofzion/neon-js");


const { encryptedPrivateKey, parentPort } = require('worker_threads');


var account = new wallet.Account(encryptedPrivateKey);

parentPort.on('message', async message =>{

    if (message.op == "nextPassword")
    {
        try
        {
            await account.decrypt(message.password);
            parentPort.postMessage({ op: "foundPassword", password: message.password });
            return;
        }
        catch(ex)
        {
        
        }

        parentPort.postMessage({ op: "nextPassword" });
    }

});


parentPort.postMessage({ op: "nextPassword" });

/*

*/
