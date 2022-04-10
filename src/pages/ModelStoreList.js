import React, {useState} from 'react';
import modelStoreService from "../services/modelStoreService";
import "bootstrap/dist/css/bootstrap.min.css";

let loading = false;

const ModelStoreList = () => {
	let curTime = new Date().getTime();
	const [modelInfoList, setModelInfoList] = useState(null);

	const timeDifference = (time) => {
		let duration = "";
		let diff = Math.floor((curTime - time)/1000);
		let unit;
		unit = diff%60;
		if (unit !== 0){
			if (unit!== 1){
				duration = "s"+duration;
			}
			duration = unit.toString()+" second"+duration;
		}
		diff = Math.floor(diff/60);
		if (diff !== 0 && unit !== 0){
			duration = ", "+duration;
		}
		else{
			return duration;
		}
		unit = diff%60;
		if (unit !== 0){
			if (unit!== 1){
				duration = "s"+duration;
			}
			duration = unit.toString()+" minute"+duration;
		}
		diff = Math.floor(diff/60);
		if (diff !== 0 && unit !== 0){
			duration = ", "+duration;
		}
		else{
			return duration;
		}
		unit = diff%24;
		if (unit !== 0){
			if (unit!== 1){
				duration = "s"+duration;
			}
			duration = unit.toString()+" hour"+duration;
		}
		diff = Math.floor(diff/24);
		if (diff !== 0 && unit !== 0){
			duration = ", "+duration;
		}
		else{
			return duration;
		}
		unit = diff;
		if (unit !== 0){
			if (unit!== 1){
				duration = "s"+duration;
			}
			duration = unit.toString()+" day"+duration;
		}
		return duration;
	}

	const renderList = (modelInfoList) => {
		if (!modelInfoList){
			return null;
		}
		return modelInfoList.map(modelInfo => {
			return (
				<tr key={modelInfo.id}>
					<th scope="row">
						<a href={"/" + modelInfo.id} className="text-decoration-none">
							{modelInfo.fileName}
						</a>
					</th>
					<td>
						{timeDifference(modelInfo.updated)}
					</td>
					<td>
						{timeDifference(modelInfo.uploaded)}
					</td>
				</tr>
			)
		});
	}

	if (!modelInfoList && !loading) {
		loading = true;
		modelStoreService.listModels()
			.then(
				(data) => {
					setModelInfoList(data);
				}
			).catch((error) => {
				console.log(error);
				console.log("Fetching Model List Failed");
			});
		loading = false;
	}

	return (
		<div className="container-fluid row">
			<div className="col-md-2"/>
			<div className="col-md-8">
				<table className="table table-hover">
					<thead>
					<tr>
						<th scope="col">Name</th>
						<th scope="col">Updated</th>
						<th scope="col">Uploaded</th>
					</tr>
					</thead>
					<tbody>
						{renderList(modelInfoList)}
					</tbody>
				</table>
			</div>
			<div className="col-md-2"/>
		</div>
	);
}

export default ModelStoreList;