// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "eu-west-3" });

// Create EC2 service object
var ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });

const manangeInstanceId = (action = "START", instanceId, clb) => {
	var params = {
		InstanceIds: [instanceId],
		DryRun: true,
	};

	console.log(1);
	if (action.toUpperCase() === "START") {
		// Call EC2 to start the selected instances

		ec2.startInstances(params, function (err, data) {
			if (err && err.code === "DryRunOperation") {
				params.DryRun = false;
				ec2.startInstances(params, function (err, data) {
					if (err) {
						console.log("Error	", err);
					} else if (data) {
						// console.log("Success", data.StartingInstances);
						if (clb) {
							clb(data);
						}
					}
				});
			} else {
				console.log("You don't have permission to start instances.");
			}
		});
	} else if (action.toUpperCase() === "STOP") {
		// Call EC2 to stop the selected instances

		ec2.stopInstances(params, function (err, data) {
			if (err && err.code === "DryRunOperation") {
				params.DryRun = false;
				ec2.stopInstances(params, function (err, data) {
					if (err) {
						console.log("Error", err);
					} else if (data) {
						console.log("Success", data.StoppingInstances);
					}
				});
			} else {
				console.log("You don't have permission to stop instances");
			}
		});
	}
};
module.exports = {
	manangeInstanceId,
};
