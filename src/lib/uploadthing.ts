import { generateUploadButton, generateUploadDropzone } from '@uploadthing/react';
import { genUploader } from 'uploadthing/client';

import type { AppFileRouter } from '@/app/api/uploadthing/core';

export const UploadButton = generateUploadButton<AppFileRouter>();
export const UploadDropzone = generateUploadDropzone<AppFileRouter>();

export const { uploadFiles } = genUploader<AppFileRouter>();
