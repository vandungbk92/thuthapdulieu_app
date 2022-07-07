import * as FileSystem from "expo-file-system";
import {COMMON_APP} from "../../constants";
import axios from "axios";
import { create } from "./quanlydulieuServices";
import { CONSTANTS } from './../../constants/constants';
import moment from 'moment';

export async function postFile(id, uri, fieldName, curentTime) {
    return FileSystem.uploadAsync(
        `${COMMON_APP.HOST_API}${"/api/uploads/"}${id}${"?time="}${curentTime}`,
        uri,
        {
            httpMethod: "POST",
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: fieldName,
        }).then((res) => {
        if (res.status === 200) { 
            return res;
        }
        return null;
    }).catch((err) => {
        console.log(err.message)
        return null;
    });
}

export async function postImages(images, id, curentTime) {
    let path = `${COMMON_APP.HOST_API}${"/api/uploads/"}${id}${"?time="}${curentTime}`

    const uploads = images.map((image, index) => {
        return image.uri
    })

    const response = await Promise.all(uploads.map((uri, index) => {
        return FileSystem.uploadAsync(
            path,
            uri,
            {
                httpMethod: "POST",
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                fieldName: 'files',
            }).then((res) => {
            if (res.status === 200) {
                return res;
            }
            return null;
        }).catch((err) => {
            return null;
        });
    }))

    return response;
}
