import axios from 'axios';

export async function uploadToCloudinary(
    file: File,
    onProgress?: (pct: number) => void
): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'artportfolio');
    formData.append('cloud_name', 'ddwilwdju');

    const response = await axios.post(
        `https://api.cloudinary.com/v1_1/ddwilwdju/image/upload`,
        formData,
        {
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress?.(pct);
                }
            },
        }
    );
    return response.data.secure_url;
}