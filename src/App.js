import React, {useEffect, useState} from "react";
import {Routes, Route, NavLink} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import authService from "./services/authService";
import Login from "./pages/Login";
import Register from "./pages/Register";
import axios from "axios";
import {API_URL} from "./config";
import ModelStoreList from "./pages/ModelStoreList";
import UploadModel from "./pages/UploadModel";
import DownloadModel from "./pages/DownloadModel";

const App = () => {
	const [currentUser, setCurrentUser] = useState(null);

	const logout = () => {
		authService.logout();
		setCurrentUser(null);
	};

	const navLinkClasses = ({isActive}) => {
		if (isActive) {
			return "nav-link active";
		} else {
			return "nav-link"
		}
	}

	const getUser = () => {
		let user = JSON.parse(localStorage.getItem("user"));
		let headers = authService.getHeader();
		if (headers && !currentUser) {
			axios.get(
				API_URL + "/user/info",
				{headers: headers})
				.then((response) => {
					if (response.status === 200) {
						user = response.data;
						localStorage.setItem("user", JSON.stringify(response.data));
						setCurrentUser(user);
					}
				})
				.catch((err) => {
					console.log(err);
				})
			setCurrentUser(user);
		}

	}

	useEffect(() => {
		getUser();
	});

	return (
		<div className="container-fluid">
			<nav className="navbar navbar-expand-lg navbar-light bg-light">
				<ul className="nav nav-pills">
					<li className="nav-item">
						<NavLink to={"/"} className={navLinkClasses}>3D Model Store</NavLink>
					</li>
					{
						currentUser ?
							<li className="nav-item">
								<NavLink to={"/profile"} className={navLinkClasses}>{currentUser.name}</NavLink>
							</li>
							:
							<li className="nav-item">
								<NavLink to={"/login"} className={navLinkClasses}>Login</NavLink>
							</li>

					}
					{
						currentUser ?
							<li className="nav-item">
								<a className="nav-link" href={"/login"} onClick={logout}>Logout</a>
							</li>
							:
							<li className="nav-item">
								<NavLink to={"/register"} className={navLinkClasses}>Register</NavLink>
							</li>
					}

				</ul>
			</nav>
			<div className="container mt-3">
				<Routes>
					<Route path="/" element={<UploadModel/>}/>
					<Route path="/login" element={<Login getUser={getUser}/>}/>
					<Route path="/register" element={<Register getUser={getUser}/>}/>
					<Route path="/profile" element={<ModelStoreList/>}/>
					<Route path="/:modelId" element={<DownloadModel/>}/>
				</Routes>
			</div>
		</div>

	);
};

export default App;