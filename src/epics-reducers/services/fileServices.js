import * as FileSystem from "expo-file-system";
import { COMMON_APP } from "../../constants";

export async function postFile(arr_uri, type, datasetId) {
    let path = `${COMMON_APP.HOST_API}${"/api/drive-upload/files"}`;

    return await Promise.all(
        arr_uri.map((uri) => {
            return FileSystem.uploadAsync(path, uri, {
                httpMethod: "POST",
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                fieldName: "files",
                parameters: {
                    type,
                    datasetId: datasetId,
                },
            })
                .then((res) => {
                    if (res.status === 200) {
                        let dataRes = JSON.parse(res.body);
                        return dataRes._id;
                    }
                    return null;
                })
                .catch((err) => {
                    console.log(err.message);
                    return null;
                });
        })
    );
}

export async function postImages(images, datasetId) {
    try {
        let path = `${COMMON_APP.HOST_API}${"/api/uploads"}`;
        const uploads = images.map((image, index) => {
            return image.uri || image.file;
        });

        const response = await Promise.all(
            uploads.map((uri, index) => {
                return FileSystem.uploadAsync(path, uri, {
                    httpMethod: "POST",
                    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                    fieldName: "files",
                    parameters: {
                        type: "image",
                        img_type: "upload",
                        datasetId: datasetId,
                    },
                })
                    .then((res) => {
                        if (res.status === 200) {
                            console.log(
                                JSON.parse(res.body),
                                "JSON.parse(res.body)"
                            );
                            let dataRes = JSON.parse(res.body);
                            return dataRes[0]._id;
                        }
                        return null;
                    })
                    .catch((err) => {
                        console.log(err, "errerrerr");
                        return null;
                    });
            })
        );
        return response;
    } catch (e) {
        console.log(e, "eee");
    }
}
