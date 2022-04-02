import React, {useState} from 'react';
import modelStoreService from "../services/modelStoreService";
import "bootstrap/dist/css/bootstrap.min.css";

const ModelStoreList = () => {
	const [modelInfoList, setModelInfoList] = useState([]);

	const renderList = (modelInfoList) => {
		return modelInfoList.map(modelInfo => {
			return (
				<a key={modelInfo.id} href={"/" + modelInfo.id} className="list-group-item list-group-item-action">
					{modelInfo.fileName}
				</a>
			)
		});
	}

	if (modelInfoList.length === 0) {
		modelStoreService.listModels()
			.then(
				(data) => {
					setModelInfoList(data);
				}
			)
	}

	return (
		<div className="container-fluid row">
			<div className="col-md-3"/>
			<div className="col-md-6">
				<ul className="list-group">
					{renderList(modelInfoList)}
				</ul>
			</div>
			<div className="col-md-3"/>
		</div>
	);
}

export default ModelStoreList;