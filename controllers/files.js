import path from 'path';

const imageRender = (req, res) => {
    try {
        let fileName = req.params.fileName;
        let filePath = path.join(process.cwd(), 'uploads', 'images', fileName);
        res.sendFile(filePath);
    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};


const videoRender = (req, res) => {
    try {
        let fileName = req.params.fileName;
        let filePath = path.join(process.cwd(), 'uploads', 'videos', fileName);
        res.sendFile(filePath);
    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};


const downloadVideo = (req, res) => {
    try {
        let fileName = req.params.fileName;
        let filePath = path.join(process.cwd(), 'uploads', 'videos', fileName);
        res.download(filePath);
    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};


export default {
    imageRender,
    videoRender,
    downloadVideo,
}