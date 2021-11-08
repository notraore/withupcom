const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors");
app.use(cors());

const { exec } = require("child_process");

const { manangeInstanceId } = require("./ec2_startstopinstances.js");

const server = require("http").Server(app);
const io = require("socket.io")(server);

const ID = "i-04f63950842ad7e2b";

server.listen(port, () =>
	console.log(`Nodejs Server listening on port :${port}!`)
);

io.on("connection", function (socket) {
	const previousCode = null;
	console.log("a user is connected");
	const interval = setInterval(() => {
		checkStatus(socket, interval);
	}, 5000);
});

const checkStatus = (socket, interval) => {
	manangeInstanceId("START", ID, function (data) {
		exec(
			`aws ec2 describe-instances --instance-id ${ID} | grep -i PublicIPAddress  | cut -d '"' -f 4`,
			(error, stdout, stderr) => {
				if (error) {
					console.log(`error: ${error.message}`);
					return;
				}
				if (stderr) {
					console.log(`stderr: ${stderr}`);
					return;
				}
				console.log(stdout);
				console.log(data.StartingInstances[0].CurrentState.Code);

				if (data.StartingInstances[0].CurrentState.Code == 16) {
					clearInterval(interval);
					console.log("timing...");
					setTimeout(() => {
						socket.emit("ip", stdout);
					}, 8000);
				}
			}
		);
	});
};
