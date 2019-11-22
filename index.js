
const { Worker } = require('worker_threads')
const { default: Neon, api, wallet, tx, rpc } = require("@cityofzion/neon-js");


//const passwordChars = ["a", "b", "c", "d", "e", "f", "g", "h"];
const passwordChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?!@".split('');
const workerThreads = [];

const encryptedPrivateKey = process.argv[2];
const currentPassword = [passwordChars[0]];




const main = async() =>{

	for(var i = 0; i < 10; i++)
	{
		const worker = new Worker('./worker.js', { workerData:{encryptedPrivateKey} });
		worker.on('message', message => processMessage(worker, message));
		worker.on('error', error => console.log("error:" + error));
		worker.on('exit', code => console.log("exit:" + code));
		workerThreads.push(worker);
	}
	
}


const processMessage = (worker, message) =>{
	if (message.op == "nextPassword")
	{

		for(var i = 0; i < currentPassword.length; i++)
		{
			var index = passwordChars.indexOf(currentPassword[i]);
			if (index + 1 < passwordChars.length)
			{
				currentPassword[i] = passwordChars[index + 1];
				break;
			}
			else
			{
				currentPassword[i] = passwordChars[0];
				if (i + 1 >= currentPassword.length)
				{
					currentPassword.push(passwordChars[0]);
					break;
				}
			}
		}

		var currentPasswordStr = currentPassword.join('')
		worker.postMessage({
			op:"nextPassword",
			password: currentPasswordStr
		});
	
		console.log("Trying password - " + currentPasswordStr);
	}

	if (message.op == "foundPassword")
	{
		console.log("Password found - " + message.password);
		process.exit(0);
	}

}

main();