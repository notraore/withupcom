const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors");
app.use(cors());

const { exec } = require("child_process");

const { manangeInstanceId } = require("./ec2_startstopinstances.js");
const { stderr } = require("process");

const server = require("http").Server(app);
const io = require("socket.io")(server);

var ID = "";
var AllID = [];
var usedID = [];

server.listen(port, () =>
	console.log(`Nodejs Server listening on port :${port}!`)
);

io.on("connection", function (socket) {
	const previousCode = null;
	console.log("a user is connected");
	getInstances((returnValue) => {
		AllID = JSON.parse(returnValue);
		compareIDArray();
	});
	const interval = setInterval(() => {
		checkStatus(socket, interval);
	}, 5000);
});

const compareIDArray = () => {
	var currentIndex = 0;
	if (usedID.length == 0) {
		usedID.push(AllID[currentIndex]);
		console.log("length EGAL 0 : " + usedID.length + usedID[0]);
		ID = AllID[currentIndex];
		console.log("ID = " + ID);
	} else if (usedID.length != 0) {
		for (var i = 0; i < AllID.length; i++) {
			if (usedID.indexOf(AllID[i]) == -1) {
				usedID.push(AllID[i]);
				ID = AllID[i];
				console.log(
					" length DIFF 0 : " + AllID[i] + "HAS BEEN ADDED TO USEDIS"
				);
				console.log("ID = " + ID);
				break;
			} else {
				console.log(AllID[i] + " : already exist in the array");
			}
		}
	}
};

const getInstances = (callback) => {
	exec(
		`aws ec2 describe-instances --filters "Name=instance-type,Values=g4dn.4xlarge" --query "Reservations[].Instances[].InstanceId"`,
		(error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error.message}`);
				return;
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
				return;
			}
			callback(stdout);
		}
	);
};

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
				console.log(stdout + "CheckStatus\n");
				console.log(
					data.StartingInstances[0].CurrentState.Code + "Code\n"
				);

				if (data.StartingInstances[0].CurrentState.Code == 16) {
					clearInterval(interval);
					console.log("timing...");
					setTimeout(() => {
						clearInterval(interval);
						socket.emit("ip", stdout);
					}, 8000);
				}
			}
		);
	});
};
