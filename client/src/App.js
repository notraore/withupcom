import logo from "./WITHUPCOM.png";
import React, { useEffect } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
	useEffect(() => {
		console.log("starting");
		socket.on("ip", (data) => {
			console.log(data);
			window.location.href = `http://${data}`;
		});
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<p>Creating your session... Please, wait...</p>
			</header>
		</div>
	);
}

export default App;
