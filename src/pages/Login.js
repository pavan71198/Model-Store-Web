import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import authService from "../services/authService";

import "bootstrap/dist/css/bootstrap.min.css";

const required = (value) => {
	if (!value) {
		return (
			<div className="alert alert-danger mt-2" role="alert">
				This field is required!
			</div>
		);
	}
};

const Login = ({getUser, currentUser}) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	let checkBtn;
	let form;

	const handleLogin = (event) => {
		event.preventDefault();
		setMessage("");
		setLoading(true);
		form.validateAll();
		if (checkBtn.context._errors.length === 0) {
			authService.login(
				form.getValues().username,
				form.getValues().password
			).then(
				() => {
					getUser();
					navigate("/");
				},
				error => {
					const resMessage =
						(error.response &&
							error.response.data &&
							error.response.data.message) ||
						error.message ||
						error.toString();
					setLoading(false);
					setMessage(resMessage);

				}
			);
		} else {
			setLoading(false);
		}
	}

	return (
		<div className="container-fluid row">
			<div className="col-md-4"/>
			<div className="col-md-4">
				<div className="card card-body">
					<h5
						className="card-title text-center"
						style={currentUser ?
							{}:{display: "none"}}
					>
						You are already logged in
					</h5>
					<Form
						onSubmit={handleLogin}
						ref={ref => {
							form = ref;
						}}
						style={currentUser ?
							{display: "none"}:{}}
					>
						<div className="form-group">
							<label htmlFor="username">Username</label>
							<Input
								type="text"
								className="form-control"
								name="username"
								validations={[required]}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="password">Password</label>
							<Input
								type="password"
								className="form-control"
								name="password"
								validations={[required]}
							/>
						</div>
						<br/>
						<div className="form-group">
							<button
								className="btn btn-primary btn-block"
								disabled={loading}
							>
								{loading && (
									<span className="spinner-border spinner-border-sm"/>
								)}
								<span>Login</span>
							</button>
						</div>
						{message && (
							<div className="form-group">
								<div className="alert alert-danger mt-2" role="alert">
									{message}
								</div>
							</div>
						)}
						<CheckButton
							style={{display: "none"}}
							ref={c => {
								checkBtn = c;
							}}
						/>
					</Form>
				</div>
			</div>
		</div>
	);
}

export default Login;