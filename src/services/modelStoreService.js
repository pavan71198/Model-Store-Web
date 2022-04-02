import axios from "axios";

import authService from "./authService";

import {API_URL} from "../config";

class ModelStoreService {
	uploadModel(file, name, onUploadProgress) {
		let formData = new FormData();
		formData.append("modelFile", file);
		formData.append("name", name);
		let headers = authService.getHeader();
		headers["Content-Type"] = "multipart/form-data";
		return axios.post(
			API_URL + "/model/upload",
			formData,
			{headers: headers, onUploadProgress}
		);
	}

	updateModel(id, file, name, onUploadProgress) {
		let formData = new FormData();
		formData.append("modelFile", file);
		formData.append("name", name);
		let headers = authService.getHeader();
		headers["Content-Type"] = "multipart/form-data";
		return axios.post(
			API_URL + "/model/update/"+id,
			formData,
			{headers: headers, onUploadProgress}
		);
	}

	downloadModel(id, onDownloadProgress) {
		let headers = authService.getHeader();
		return axios.get(
			API_URL+"/model/download/"+id,
			{
				headers:headers,
				responseType:"blob",
				onDownloadProgress
			}
		);
	}

	modelInfo(modelId) {
		let headers = authService.getHeader();
		return axios.get(
			API_URL+"/model/info/"+modelId,
			{headers:headers}
		).then (response => {
			return response.data;
		});
	}

	listModels() {
		let headers = authService.getHeader();
		return axios.get(
			API_URL+"/model/info/list",
			{headers:headers}
		).then (response => {
			return response.data;
		});
	}
}

export default new ModelStoreService();