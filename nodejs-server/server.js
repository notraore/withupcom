const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors");
app.use(cors());

const { exec } = require("child_process");

const { manangeInstanceId } = require("./ec2_startstopinstances.js");

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
	const inter = setInterval(() => {
		getInstances(inter);
	}, 1000);
	console.log(AllID + "NOBILA");
	// const interval = setInterval(() => {
	// checkStatus(socket, interval);
	// }, 5000);
});

const compareIDArray = () => {
	if (usedID.length == 0) {
		usedID.push(AllID[0]);
		ID = usedID[0];
		console.log(ID + " ID");
	} else if (usedID.length != 0) {
		for (var i = 0; i < AllID.length; i++) {
			var test = usedID.indexOf(AllID[i]);
			console.log(test);
		}
	}
};

const getInstances = (inter) => {
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
			// console.log(JSON.parse(stdout));
			AllID = JSON.parse(stdout);
			if (AllID.length != 0) {
				clearInterval(inter);
				console.log(AllID.length);
				compareIDArray();
			}
			// console.log(AllID);
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
