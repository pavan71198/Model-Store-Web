import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import authService from "../services/authService";

import "bootstrap/dist/css/bootstrap.min.css";

const required = value => {
	if (!value) {
		return (
			<div className="alert alert-danger" role="alert">
				This field is required!
			</div>
		);
	}
};

const nameCheck = value => {
	if (value.length < 3 || value.length > 50) {
		return (
			<div className="alert alert-danger" role="alert">
				The name must be between 3 and 50 characters.
			</div>
		);
	}
};

const usernameCheck = value => {
	if (value.length < 3 || value.length > 20) {
		return (
			<div className="alert alert-danger" role="alert">
				The username must be between 3 and 20 characters.
			</div>
		);
	}
};
const passwordCheck = value => {
	if (value.length < 6 || value.length > 40) {
		return (
			<div className="alert alert-danger" role="alert">
				The password must be between 6 and 40 characters.
			</div>
		);
	}
};

const Register = ({getUser}) => {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [successful, setSuccessful] = useState(false);
	const [message, setMessage] = useState("");

	let checkBtn;
	let form;

	const onChangeName = (e) => {
		setName(e.target.value);
	}
	const onChangeUsername = (e) => {
		setUsername(e.target.value);
	}
	const onChangePassword = (e) => {
		setPassword(e.target.value);
	}
	const handleRegister = (e) => {
		e.preventDefault();
		setMessage("");
		setSuccessful(false);

		form.validateAll();
		if (checkBtn.context._errors.length === 0) {
			authService.register(
				username,
				password,
				name
			).then(
				() => {
					setMessage("Registered Successfully");
					setSuccessful(true);
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
					setSuccessful(false);
					setMessage(resMessage);
				}
			);
		}
	}

	return (
		<div className="container-fluid row">
			<div className="col-md-4"/>
			<div className="col-md-4">
				<div className="card card-body">
					<Form
						onSubmit={handleRegister}
						ref={ref => {
							form = ref;
						}}
					>
						{!successful && (
							<div>
								<div className="form-group">
									<label htmlFor="name">Name</label>
									<Input
										type="text"
										className="form-control"
										name="name"
										value={name}
										onChange={onChangeName}
										validations={[required, nameCheck]}
									/>
								</div>
								<div className="form-group">
									<label htmlFor="username">Username</label>
									<Input
										type="text"
										className="form-control"
										name="username"
										value={username}
										onChange={onChangeUsername}
										validations={[required, usernameCheck]}
									/>
								</div>
								<div className="form-group">
									<label htmlFor="password">Password</label>
									<Input
										type="password"
										className="form-control"
										name="password"
										value={password}
										onChange={onChangePassword}
										validations={[required, passwordCheck]}
									/>
								</div>
								<br/>
								<div className="form-group">
									<button className="btn btn-primary btn-block">Sign Up</button>
								</div>
							</div>
						)}
						{message && (
							<div className="form-group">
								<div
									className={
										successful
											? "alert alert-success"
											: "alert alert-danger"
									}
									role="alert"
								>
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
			<div className="col-md-4"/>
		</div>
	);
}

export default Register;