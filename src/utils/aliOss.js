const OSS = require('ali-oss');
class AliOss {
    client
    constructor(OssObj) {
        this.client = new OSS({ ...OssObj })
    }
    async upload(file) {
        const fileName = file.name;
        // 域名/pd1/uploads/client/年-月-日/文件名
        // https://pd1.oss-accelerate.aliyuncs.com/pd1/uploads/2022-04-11/yU4yfPCC5AYEJZoonLAF
        const date = new Date();
        const time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        const randomName = btoa(fileName + new Date().getTime()) + fileName;
        const res = await this.client.put('/pd1/uploads/client/' + time + '/' + randomName, file);
        return 'https://oss.pd-1st.com/' + res.name
    }
    async update(fileUrl, file) {
        const res = await this.client.put(fileUrl, file);
        return 'https://oss.pd-1st.com/' + res.name
    }
    async processImage( sourceImage,targetImage,processStr) {
        const result = await this.client.processObjectSave(
          sourceImage,
          targetImage,
          processStr,
          "pd1"
        );
        console.log(result.res.status);
      }
     
}

export default AliOss;