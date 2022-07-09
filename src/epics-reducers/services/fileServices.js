import * as FileSystem from "expo-file-system";
import {COMMON_APP} from "../../constants";

export async function postFile(uri, type, datasetId) {
  return FileSystem.uploadAsync(
    `${COMMON_APP.HOST_API}${"/api/uploads"}`,
    uri,
    {
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'files',
      parameters: {
        type,
        datasetId: datasetId
      }
    }).then((res) => {
    if (res.status === 200) {
      let dataRes = JSON.parse(res.body)
      return dataRes[0]._id;
    }
    return null;
  }).catch((err) => {
    console.log(err.message)
    return null;
  });
}

export async function postImages(images, datasetId) {
  try{
    let path = `${COMMON_APP.HOST_API}${"/api/uploads"}`
    console.log(images, 'postImagespostImagespostImages')
    const uploads = images.map((image, index) => {
      return image.uri || image.file;
    })
    console.log(uploads, 'uploads')
    const response = await Promise.all(uploads.map((uri, index) => {
      return FileSystem.uploadAsync(
        path,
        uri,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'files',
          parameters: {
            type: 'image',
            img_type: 'upload',
            datasetId: datasetId
          }
        }).then((res) => {
        if (res.status === 200) {
          console.log(JSON.parse(res.body), 'JSON.parse(res.body)')
          let dataRes = JSON.parse(res.body)
          return dataRes[0]._id;
        }
        return null;
      }).catch((err) => {
        console.log(err, 'errerrerr')
        return null;
      });
    }))
    return response;
  }catch (e) {
    console.log(e, 'eee')
  }
}
