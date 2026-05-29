import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { createReadStream, statSync } from 'fs';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { ffmpeg } from 'mediaforge';
import { extname } from 'path';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Media } from './entities/media.entity';

const uploadDir = './uploads';

@Injectable()
export class MediaService {
	constructor(
		@InjectRepository(Media)
		private readonly mediaRepository: Repository<Media>,
	) {}

	async save(file: Express.Multer.File) {
		if (!file.mimetype.startsWith('video/')) {
			throw new BadRequestException('Only video files allowed');
		}

		const slug = uuid().slice(0, 8);
		const ext = extname(file.originalname);
		const videoFileName = `${slug}${ext}`;
		const audioFileName = `${slug}.mp3`;

		await mkdir(uploadDir, { recursive: true });

		const videoPath = `${uploadDir}/${videoFileName}`;

		await writeFile(videoPath, file.buffer);

		const audioPath = `${uploadDir}/${audioFileName}`;

		await ffmpeg()
			.input(videoPath)
			.output(audioPath)
			.audioCodec('libmp3lame')
			.audioBitrate('128k')
			.noVideo()
			.run();

		await unlink(videoPath);

		const audioSize = statSync(audioPath).size;

		const media = this.mediaRepository.create({
			slug,
			originalName: file.originalname.replace(ext, '.mp3'),
			mimeType: 'audio/mpeg',
			size: audioSize,
			path: audioPath,
		});

		return this.mediaRepository.save(media);
	}

	async get(slug: string) {
		const media = await this.mediaRepository.findOne({
			where: { slug },
		});

		if (!media) throw new NotFoundException('Not found');

		return media;
	}

	streamFile(media: Media, req: Request, res: Response) {
		const fileSize = statSync(media.path).size;
		const range = req.headers.range;

		res.setHeader('Accept-Ranges', 'bytes');
		res.setHeader('Content-Type', media.mimeType);
		res.setHeader('Cache-Control', 'public, max-age=31536000');

		if (range) {
			const parts = range.replace(/bytes=/, '').split('-');
			const start = parseInt(parts[0], 10);
			const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
			const chunkSize = end - start + 1;

			res.status(206);
			res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
			res.setHeader('Content-Length', chunkSize);

			createReadStream(media.path, { start, end }).pipe(res);
		} else {
			res.setHeader('Content-Length', fileSize);
			createReadStream(media.path).pipe(res);
		}
	}
}
