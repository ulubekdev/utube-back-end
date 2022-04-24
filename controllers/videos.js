import { AuthorizationError, InternalServerError } from '../utils/errors.js';
import path from 'path';

const getVideos = (req, res, next) => {
    try {

        let videos = req.readFile('videos');
        let { userId, title } = req.query;

        if(userId) {
            videos = videos.filter(video => video.userId == userId);
        }

        if(title) {
            videos = videos.filter(video => video.videoTitle.toLowerCase().includes(title.toLowerCase()));
        }

        let users = req.readFile('users');

        videos = videos.map(video => {
            return {
                ...video,
                user: users.find(user => user.id === video.userId),
            }
        });
        
        res.status(200).json({
            status: 200,
            message: 'Videos retrieved successfully',
            data: videos,
            token: null
        });
    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};


const uploadVideo = (req, res, next) => {
    try {
        let videos = req.readFile('videos');
        let file = req.files;

        let { videoTitle } = req.body;

        if(!file) {
            return next(new AuthorizationError(400, 'Video is required'));
        }

        let size = (file.video.size / 1024 / 1024).toFixed(2);
        
        if(size > 50) {
            return next(new AuthorizationError(400, 'File size must be less than 50MB'));
        }

        if(!videoTitle.trim()) {
            return next(new AuthorizationError(400, 'Video title is required'));
        }

        if(videoTitle.length < 3 || videoTitle.length > 20) {
            return next(new AuthorizationError(400, 'Video title must be between 3 and 20 characters'));
        }

        if(!file.video.mimetype.includes('mp4') && !file.video.mimetype.includes('avi') && !file.video.mimetype.includes('mkv')) {
            return next(new AuthorizationError(400, 'File must be a video'));
        }

        let date = new Date();

        let videoUrl = file.video.name;

        let newVideo = {
            videoId: videos.length ? videos[videos.length - 1].videoId + 1 : 1,
            videoUrl,
            videoTitle,
            userId: req.id,
            videoSize: size + 'mb',
            uploadedData: date.toISOString().slice(0, 10) + ' | ' + date.toLocaleTimeString([], { hourCycle: 'h23', hour: '2-digit', minute:'2-digit' })
        };

        let filePath = path.join(process.cwd(), 'uploads', 'videos', videoUrl);

        file.video.mv(filePath, (error) => {
            if(error) {
                return next(new InternalServerError(500, error.message));
            }
        });

        videos.push(newVideo);

        req.writeFile('videos', videos);

        res.status(201).json({
            status: 201,
            message: 'Video created successfully',
            data: newVideo,
        });
        
    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};


const updateVideo = (req, res, next) => { 
    let { videoId, videoTitle, uploadedData } = req.body;

    let videos = req.readFile('videos');

    let video = videos.find(video => video.videoId === parseInt(videoId) && video.userId === parseInt(req.id));

    if(!video) {
        return next(new AuthorizationError(400, 'Video does not exist'));
    }

    if(!videoTitle.trim()) {
        return next(new AuthorizationError(400, 'Video title is required'));
    }

    let index = videos.indexOf(video);

    video.videoTitle = videoTitle.trim();
    video.uploadedData = uploadedData;

    videos[index] = video;

    req.writeFile('videos', videos);

    res.status(200).json({
        status: 200,
        message: 'Video updated successfully',
        data: video,
    });
};


const deleteVideo = (req, res, next) => {
    let { videoId } = req.body;

    let videos = req.readFile('videos');

    let video = videos.find(video => video.videoId === parseInt(videoId) && video.userId === parseInt(req.id));

    if(!video) {
        return next(new AuthorizationError(400, 'Video does not exist'));
    }
    
    let index = videos.indexOf(video);

    videos.splice(index, 1);

    req.writeFile('videos', videos);

    res.status(200).json({
        status: 200,
        message: 'Video deleted successfully',
        data: video,
    });
};

const getUserVideos = (req, res, next) => {
    try {
        let videos = req.readFile('videos');

        let video = videos.filter(video => video.userId === parseInt(req.id));

        res.status(200).json({
            status: 200,
            message: 'User videos retrieved successfully',
            data: video,
        });
    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};

export default {
    getVideos,
    uploadVideo,
    updateVideo,
    deleteVideo,
    getUserVideos
}