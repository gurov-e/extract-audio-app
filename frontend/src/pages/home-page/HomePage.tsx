import ResultCard from '@/features/extract/components/result-list/ResultList';
import UploadForm from '@/features/extract/components/upload-form/UploadForm.tsx';

const HomePage = () => {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-lg space-y-6">
				<h1 className="text-2xl font-bold text-center">
					Извлечение аудио из видео
				</h1>

				<p className="text-center text-muted-foreground">
					Загрузите видео до 10 МБ и получите MP3
				</p>

				<UploadForm />

				<ResultCard />
			</div>
		</main>
	);
};

export default HomePage;
