import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { copyToClipboard, getMediaUrl } from '@/shared/helpers/helpers.ts';
import { Check, Copy, Download } from 'lucide-react';
import { useState } from 'react';

interface IResultItemProps {
	url: string;
}

const ResultItem = ({ url }: IResultItemProps) => {
	const [isCopied, setIsCopied] = useState<boolean>(false);

	const fullMediaUrl = getMediaUrl(url);

	const handleCopy = async () => {
		await copyToClipboard(fullMediaUrl);

		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000);
	};

	return (
		<Card>
			<CardContent className="space-y-4">
				<div className="flex items-center gap-2 bg-muted rounded-sm">
					<audio 
						controls
						src={fullMediaUrl}
						className='w-full'
					></audio>

					<Button
						variant="ghost"
						size="icon"
						onClick={handleCopy}
						className="cursor-pointer"
					>
						{isCopied ? (
							<Check className="h-4 w-4 text-green-500" />
						) : (
							<Copy className="h-4 w-4" />
						)}
					</Button>

					<Button variant="outline" asChild className="flex-1">
						<a href={fullMediaUrl} download>
							<Download className="h-4 w-4" />
						</a>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default ResultItem;
