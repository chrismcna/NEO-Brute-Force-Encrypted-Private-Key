
const { Worker } = require('worker_threads')




const passwordChars = ["a", "b", "c", "d", "e", "f", "g", "h"];
//const passwordChars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const workerThreads = [];

const encryptedPrivateKey = process.argv[2];
const currentPassword = [passwordChars[0]];




const main = async() =>{

	for(var i = 0; i < 10; i++)
	{
		const worker = new Worker('./worker.js', { encryptedPrivateKey });
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


		worker.postMessage({
			op:"nextPassword",
			password: passwordChars.join('')
		});

	}

	if (message.op == "foundPassword")
	{
		console.log("Password found - " + message.password);
	}

}

main();