import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input';
import { useUpload } from '@/features/extract/api/useUpload.ts';
import { isFileSizeValid, isVideoFile } from '@/shared/helpers/helpers.ts';
import { Loader2, Upload } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useExtractStore } from '../../stores/extractStore.ts';

interface IUploadFormValues {
	files: FileList;
}

const UploadForm = () => {
	const {
		setUrls,
	} = useExtractStore();

	const {
		mutate: uploadFilesMutate,
		isPending: isUploadFilesPending,
	} = useUpload();

	const validateFileInputUpload = (files: FileList): string | boolean => {
		const fileArray = Array.from(files);

		const invalidType = fileArray.find((file) => !isVideoFile(file));

		if (invalidType) {
			return 'Разрешены только видео файлы';
		}

		const invalidSize = fileArray.find((file) => !isFileSizeValid(file));

		if (invalidSize) {
			return 'Размер файла не должен превышать 10 МБ';
		}

		return true;
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IUploadFormValues>();

	const handleUploadFormSubmit: SubmitHandler<IUploadFormValues> = (data) => {
		const formData = new FormData();

		Array.from(data.files).forEach((file) => {
			formData.append('files', file);
		});

		uploadFilesMutate(formData, {
			onSuccess: (data) => {
				setUrls(data.urls);
			},
		});
	};

	return (
		<Card>
			<CardContent className="pt-6">
				<form
					onSubmit={handleSubmit(handleUploadFormSubmit)}
					className="space-y-4"
				>
					<div className="space-y-2">
						<Input
							type="file"
							accept="video/mp4,video/webm"
							multiple
							{...register('files', {
								required: 'Выберите хотя бы один файл',
								validate: validateFileInputUpload,
							})}
						/>

						{errors.files && (
							<p className="text-sm text-red-500">
								{errors.files.message}
							</p>
						)}
					</div>

					<div className="flex justify-center">
						<Button
							type="submit"
							disabled={isUploadFilesPending}
							className="cursor-pointer"
						>
							{isUploadFilesPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Загрузка...
								</>
							) : (
								<>
									<Upload className="mr-2 h-4 w-4" />
									Загрузить
								</>
							)}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default UploadForm;
