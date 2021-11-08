const express = require("express");
const cors = require("cors");
app.use(cors());
const { manangeInstanceId } = require("./ec2_startstopinstances");
const app = express();
const port = 5000;
const { exec } = require("child_process");
const server = require("http").Server(app);
const io = require("socket.io")(server);

const ID = "i-04f63950842ad7e2b";
server.listen(port, () =>
	console.log(`Nodejs Server listening on port :${port}!`)
);
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/testSocketConnection.html");
});

// const getIDInfos = (ID) => {
// 	exec(
// 		`aws ec2 describe-instances --instance-id ${ID}`,
// 		(error, stdout, stderr) => {
// 			if (error) {
// 				console.log(`error: ${error.message}`);
// 				return;
// 			}
// 			if (stderr) {
// 				console.log(`stderr: ${stderr}`);
// 				return;
// 			}
// 			console.log(stdout[0].Reservations);
// 		}
// 	);
// };

io.on("connection", function (socket) {
	console.log("a user is connected");
	manangeInstanceId("start", ID, function (data) {
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
				io.emit("ip", stdout);
			}
		);
	});
});
