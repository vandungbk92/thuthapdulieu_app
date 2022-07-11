import axios from "axios"
import {COMMON_APP, API, CONSTANTS} from "../../constants";

function uploadImages(files, datasetId) {
  const config = {
    headers: {"content-type": "multipart/form-data", "Content-Type": "multipart/form-data"}
  }
  let path = `${COMMON_APP.HOST_API}${"/api/uploads"}`
  let dataRes = []
  const uploaders = files.map((file, index) => {
    const formData = new FormData();
    let uri = file.uri || file.file;
    let fileType = "jpg";
    let name = `photo.${fileType}`;
    formData.append("files", {
      uri,
      name,
      type: `image/${fileType}`,
    });
    formData.append("type", "image")
    formData.append("datasetId", datasetId)
    formData.append("img_type", "upload")

    return axios.post(path, formData, config).then(response => {
      const data = response.data;
      if(data) dataRes = [...dataRes, data[0]._id]
    }).catch(error => {

    });
  });

  return axios.all(uploaders).then(axios.spread(function (res1, res2) {
    return dataRes
  }));
}

function uploadFiles(files, type, datasetId) {
  try {
    const config = {
      headers: {"content-type": "multipart/form-data", "Content-Type": "multipart/form-data"}
    }
    let path = `${COMMON_APP.HOST_API}${"/api/uploads"}`
    let dataRes = []
    const uploaders = files.map((file, index) => {
      const formData = new FormData();

      const filetype = file.split(".").pop();
      const filename = file.split("/").pop();

      formData.append("files", {
        uri: file,
        name: filename,
        type: filetype
      });
      formData.append("type", type)
      formData.append("datasetId", datasetId)

      return axios.post(path, formData, config).then(response => {
        const data = response.data;
        if(data) dataRes = [...dataRes, data[0]._id]
      }).catch(error => {
        console.log(error.message, 'error')
      });
    });

    return axios.all(uploaders).then(axios.spread(function (res1, res2) {
      return dataRes
    }));
  }catch (e) {
    console.log(e, '1111111111')
  }
}

/*function uploadImages(images) {
  const config = {
    headers: {"content-type": "multipart/form-data", "Content-Type": "multipart/form-data"}
  }
  let path = `${COMMON_APP.HOST_API}${"/api/files"}`

  let dataRes = []
  const uploaders = images.map((file, index) => {
    const uri = file.uri || file.file;
    const fileType = "jpg";
    const formData = new FormData();
    formData.append("image", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });
    return axios.post(path, formData, config).then(response => {
      const data = response.data;
      if(data) dataRes = [...dataRes, data.image_id]
    }).catch(error => {

    });
  });

  return axios.all(uploaders).then(axios.spread(function (res1, res2) {
    return dataRes
  }));
}*/



export {uploadImages, uploadFiles}
