import React, {useState} from "react";
import ModelViewer from "../components/ModelViewer";
import modelStoreService from "../services/modelStoreService";
import {useParams} from "react-router-dom";

let downloading = false;

const DownloadModel = () => {
	const [fileUrl, setFileUrl] = useState(null);
	const [fileInfo, setFileInfo] = useState(null);
	const [updating, setUpdating] = useState(false);
	const [downloadProgress, setDownloadProgress] = useState(0);
	const [downloadError, setDownloadError] = useState(false);
	const {modelId} = useParams();

	console.log(modelId);

	const gltfCheck = (loaded) => {
		if (loaded) {
		} else {
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
						console.log(data);
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
				})
		}
		return null;
	}

	const handleUpdate = (e) => {
		e.preventDefault()
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
									<form className="row align-items-center" onSubmit={handleUpdate}>
										<div className="col-10">
											<input className="form-control" type="text" name="fileName"
											       placeholder={fileInfo.fileName}/>
										</div>
										<div className="col-2">
											{
												updating ?
													<button type="submit" className="btn btn-primary">Rename</button>
													:
													<button className="btn btn-primary disabled">Rename</button>
											}
										</div>
									</form>
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
										<a href={fileUrl} download={fileInfo.fileName}
										   className="btn btn-primary">Download</a>
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