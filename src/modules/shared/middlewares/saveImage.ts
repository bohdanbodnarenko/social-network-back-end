import { NextFunction, Response } from 'express';
import * as imagemin from 'imagemin';
import * as fs from 'fs';
import * as imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';

import { allowedImagesTypes, uploadsDir } from '../constants/constants';
import { ReqWithImageUrl } from '../constants/interfaces';

export const saveImage = async (req: ReqWithImageUrl, res: Response, next: NextFunction): Promise<Response | void> => {
    const { files } = req;
    if (files && files.imageUrl) {
        const image = files.imageUrl as any;
        if (!allowedImagesTypes.includes(image.mimetype)) {
            return res.status(400).json({ error: 'Bad image format' });
        }
        const lastDotIndex = image.name.lastIndexOf('.'),
            imageName = image.md5 + image.name.slice(lastDotIndex);
        await image.mv(imageName);
        await imagemin([imageName], {
            destination: uploadsDir,
            plugins: [imageminMozjpeg({ quality: 50 }), imageminPngquant({ quality: [0.6, 0.8] })],
        });
        fs.unlinkSync(imageName);

        req.imageUrl = imageName;
    }
    next();
};
