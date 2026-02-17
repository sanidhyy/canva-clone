'use client';

import { Loader2, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

import { Button } from '@/components/ui/button';
import { Editor } from '@/features/editor/components/editor';
import { useGetProject } from '@/features/projects/api/use-get-project';

interface EditorProjectIdPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const EditorProjectIdPage = ({ params }: EditorProjectIdPageProps) => {
  const { projectId } = use(params);
  const { data, isLoading, isError } = useGetProject(projectId);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-5">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Failed to fetch project.</p>

        <Button size="sm" variant="secondary" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  return <Editor initialData={data} />;
};

export default EditorProjectIdPage;
