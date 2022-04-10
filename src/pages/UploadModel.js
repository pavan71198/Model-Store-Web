import React, {useState} from "react";
import ModelViewer from "../components/ModelViewer";
import modelStoreService from "../services/modelStoreService";
import {useNavigate} from "react-router-dom";

let uploadFile;
const UploadModel = ({currentUser}) => {
	const navigate = useNavigate();
	const [fileUrl, setFileUrl] = useState(null);
	const [fileValid, setFileValid] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadError, setUploadError] = useState(false);

	const fileLoader = (event) => {
		uploadFile = event.target.files[0];
		setFileUrl(URL.createObjectURL(uploadFile));
	}

	const gltfCheck = (loaded) => {
		if (loaded) {
			if (currentUser) {
				setFileValid(true);
			}
		} else {
			setFileValid(false);
			setFileUrl(null);
		}
	}

	const onUploadProgress = (event) => {
		setUploadProgress(Math.round((event.loaded / event.total) * 100));
	}

	const handleUpload = (e) => {
		e.preventDefault();
		setUploading(true);
		setFileUrl(null);
		modelStoreService.uploadModel(uploadFile, uploadFile.name, onUploadProgress)
			.then((response) => {
				if (response.status === 200) {
					console.log("Uploaded");
					setUploading(false);
					navigate("/files")
				}
			})
			.catch((error) => {
				console.log(error);
				console.log("Upload Failed");
				setUploading(false);
				setUploadError(true);
			})

	}

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-3"/>
				{
					uploadError ?
						<div className="col-md-6">
							<p className="h3 text-center">
								Upload error
							</p>
						</div>
						:
						uploading ?
							<div className="col-md-6">
								<p className="h3 text-center">
									Uploading...
								</p>
								<div className="progress">
									<div
										className="progress-bar progress-bar-info progress-bar-striped"
										role="progressbar"
										aria-valuenow={uploadProgress}
										aria-valuemin="0"
										aria-valuemax="100"
										style={{width: uploadProgress + "%"}}
									>
										{uploadProgress}%
									</div>
								</div>
							</div>
							:
							<div className="col-md-6">
								<p className="h3 text-center">
									Select a model to view it
								</p>
								<form className="row align-items-center" onSubmit={handleUpload}>
									<div className="col-10">
										<input className="form-control" type="file" name="file" onChange={fileLoader}/>
									</div>
									<div className="col-2">
										{
											fileValid ?
												<button type="submit" className="btn btn-primary">Publish</button>
												:
												<button className="btn btn-primary disabled">Publish</button>
										}
									</div>
								</form>
							</div>
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
						</div>
						:
						null}
				</div>
				<div className="col-md-2"/>
			</div>
		</div>
	)
}

export default UploadModel;