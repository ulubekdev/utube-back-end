import controller from '../controllers/videos.js';
import checkToken from '../middlewares/checkToken.js';

import { Router } from "express";

const router = Router();

router.get('/videos', controller.getVideos);
router.get('/videos/private', checkToken, controller.getUserVideos);
router.post('/videos', checkToken, controller.uploadVideo);
router.put('/videos', checkToken, controller.updateVideo);
router.delete('/videos/:videoId', checkToken, controller.deleteVideo);

export default router;