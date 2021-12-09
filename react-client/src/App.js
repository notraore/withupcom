import React, { useEffect } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");

const App = () => {
	// useEffect(() => {
	socket.on("ip", (data) => {
		console.log(data + "Front ip data");
		if (data) {
			window.location.href = `http://${data}`;
		}
	});
	// }, []);
	return (
		<div className="App">
			<header className="App-header">
				<p>Creating your session... Please, wait...</p>
			</header>
		</div>
	);
};

export default App;
