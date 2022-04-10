import React, {useState} from "react";
import ModelViewer from "../components/ModelViewer";
import modelStoreService from "../services/modelStoreService";
import {useNavigate, useParams} from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

let downloading = false;

const required = value => {
	if (!value) {
		return (
			<div className="alert alert-danger mt-2" >
				This field is required!
			</div>
		);
	}
};

const fileNameLengthCheck = (value) => {
	if (value.length < 6 || value.length > 30) {
		return (
			<div className="alert alert-danger mt-2" role="alert">
				The filename must be between 6 and 30 characters.
			</div>
		);
	}
}

const DownloadModel = () => {
	const navigate = useNavigate();
	const [fileUrl, setFileUrl] = useState("");
	const [fileInfo, setFileInfo] = useState(null);
	const [updating, setUpdating] = useState(false);
	const [downloadProgress, setDownloadProgress] = useState(0);
	const [downloadError, setDownloadError] = useState(false);
	const {modelId} = useParams();

	let form;
	let checkBtn;

	const gltfCheck = (loaded) => {
		if (!loaded) {
			setFileUrl(null);
		}
	}

	const onDownloadProgress = (event) => {
		setDownloadProgress(Math.round((event.loaded / event.total) * 100));
	}

	const downloadFile = () => {
		if (!fileUrl && !downloading) {
			downloading = true;
			setFileUrl(null);
			modelStoreService.modelInfo(modelId)
				.then(
					(data) => {
						setFileInfo(data);
					})
				.then(() => {
					modelStoreService.downloadModel(modelId, onDownloadProgress)
						.then((response) => {
							if (response.status === 200) {
								console.log("Downloaded");
								let modelBlob = new Blob([response.data], {type: "application/octet-stream"});
								let modelUrl = URL.createObjectURL(modelBlob);
								downloading = false;
								setFileUrl(modelUrl);
							}
						})
						.catch((error) => {
							console.log(error);
							console.log("Download Failed");
							downloading = false;
							setDownloadError(true);
						})
				})
				.catch((error) => {
					console.log(error);
					console.log("Download Failed");
					downloading = false;
					setDownloadError(true);
				});
		}
		return null;
	}

	const handleUpdate = (event) => {
		event.preventDefault();
		form.validateAll();
		if (checkBtn.context._errors.length === 0) {
			setUpdating(true);
			modelStoreService.updateModel(
				modelId,
				new Blob([]),
				form.getValues().fileName,
				()=>{}
			).then(
				(response) => {
					if (response.status === 200){
						modelStoreService.modelInfo(modelId)
							.then(
								(data) => {
									setFileInfo(data);
									setUpdating(false);
								})
							.catch((error) => {
								console.log(error);
								console.log("Refreshing File Info Failed");
								setUpdating(false);
							})
					}
				}
			).catch((error) => {
				console.log(error);
				console.log("Updating File Name Failed");
				setUpdating(false);
			});
		}
	}

	const handleDelete = (event) => {
		event.preventDefault();
		setUpdating(true);
		modelStoreService.deleteModel(modelId)
			.then(
				(response) => {
					if (response.status === 200) {
						navigate("/files");
					}
					setUpdating(false);
				}
			).catch((error) => {
				console.log(error);
				console.log("Deleting File Failed");
				setUpdating(false);
			});
	}

	return (
		<div className="container-fluid">
			{downloadFile()}
			<div className="row">
				<div className="col-md-3"/>
				{
					downloadError ?
						<div className="col-md-6">
							<p className="h3 text-center">
								Download error
							</p>
						</div>
						:
						downloading ?
							<div className="col-md-6">
								<p className="h3 text-center">
									Downloading...
								</p>
								<div className="progress">
									<div
										className="progress-bar progress-bar-info progress-bar-striped"
										role="progressbar"
										aria-valuenow={downloadProgress}
										aria-valuemin="0"
										aria-valuemax="100"
										style={{width: downloadProgress + "%"}}
									>
										{downloadProgress}%
									</div>

								</div>
							</div>
							:
							fileInfo ?
								<div className="col-md-6">
									<p className="h3 text-center">
										{fileInfo.fileName}
									</p>
									<Form
										className="row align-items-start"
										ref={ref => {
											form = ref;
										}}
										onSubmit={handleUpdate}>
										<div className="col-10">
											<Input
												className="form-control"
												type="text"
												name="fileName"
												placeholder={fileInfo.fileName}
												validations={[required, fileNameLengthCheck]}
											/>
										</div>
										<div className="col-2">
											{
												updating ?
													<button className="btn btn-primary disabled">Rename</button>
													:
													<button type="submit" className="btn btn-primary">Rename</button>
											}
										</div>
										<CheckButton
											style={{display: "none"}}
											ref={c => {
												checkBtn = c;
											}}
										/>
									</Form>
									<br/>

								</div>
								:
								null
				}
				<div className="col-md-3"/>
			</div>
			<div className="row m-4">
				<div className="col-md-2"/>
				<div className="col-md-8">
					{fileUrl ?
						<div className="card">
							<div className="card-img">
								<ModelViewer fileUrl={fileUrl} gltfCheck={gltfCheck}/>
							</div>
							{
								fileInfo ?
									<div className="card-body">
										<a href={fileUrl}
										   download={fileInfo.fileName}
										   className="btn btn-primary">
											Download
										</a>
										<div className="btn btn-danger ms-3" onClick={handleDelete}>
											Delete
										</div>
									</div>
									: null
							}
						</div>
						:
						null}
				</div>
				<div className="col-md-2"/>
			</div>
		</div>
	)
}

export default DownloadModel;