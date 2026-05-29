import { useExtractStore } from '../../stores/extractStore.ts';
import ResultItem from '../result-item/ResultItem.tsx';

const ResultList = () => {
	const {
		urls,
	} = useExtractStore();

	if (!urls.length) {
		return null;
	}

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-bold text-center">Результат</h2>

			{urls.map((url) => (
				<ResultItem
					key={url}
					url={url}
				/>
			))}
		</div>
	);
};

export default ResultList;
