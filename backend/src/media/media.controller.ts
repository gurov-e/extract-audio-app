import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Post,
	Req,
	Res,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { MediaService } from './media.service';

const ALLOWED_MIME_TYPES = ['video/mp4', 'video/webm'];

const MAX_SIZE = 10 * 1024 * 1024;
const MAX_COUNT = 5;

@Controller('media')
export class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	@Post('upload')
	@UseInterceptors(
		FilesInterceptor('files', MAX_COUNT, {
			limits: { fileSize: MAX_SIZE },
			fileFilter: (req, file, cb) => {
				if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
					cb(null, true);
				} else {
					cb(
						new BadRequestException('Only video files allowed'),
						false,
					);
				}
			},
		}),
	)
	async upload(@UploadedFiles() files: Express.Multer.File[]) {
		if (!files || !files.length) {
			throw new BadRequestException('No files uploaded');
		}

		const results: string[] = [];

		for (const file of files) {
			const media = await this.mediaService.save(file);

			results.push(`/media/v/${media.slug}`);
		}

		return {
			urls: results,
		};
	}

	@Get('v/:slug')
	async view(
		@Param('slug') slug: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const media = await this.mediaService.get(slug);

		this.mediaService.streamFile(media, req, res);
	}
}
