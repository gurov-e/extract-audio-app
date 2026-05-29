import type { IApiError } from '@/shared/types/types.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

export const useUpload = () => {
	return useMutation<
		{ urls: string[] },
		AxiosError<IApiError>,
		FormData
	>({
		mutationFn: async (formData: FormData) => {
			const response = await axios.post('/api/media/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
			});

			return response.data;
		},

		retry: false,
	});
};

export const useGetMedia = () => {
	return useQuery({
		queryKey: ['media', 'get'],
		queryFn: () => {

		},
	})
};