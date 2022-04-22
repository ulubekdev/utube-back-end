import controller from '../controllers/files.js';
import { Router } from "express";

const router = Router();

router.get('/images/:fileName', controller.imageRender);
router.get('/videos/:fileName', controller.videoRender);
router.get('/videos/download/:fileName', controller.downloadVideo);

export default router;