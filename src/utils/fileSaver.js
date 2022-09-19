import FileSaver from "file-saver";
export default class fileSave {
    static getImgURLs(url, name) {
        let last = url.substring(url.lastIndexOf("."), url.length);
        FileSaver.saveAs(url, `${name}${last}`);
    }
    static downLoadImg(res, filename) {
        let blob = new Blob([res], {
            type: "image/jpeg"
        });
        FileSaver.saveAs(blob, `${filename}.jpg`);
    }
}