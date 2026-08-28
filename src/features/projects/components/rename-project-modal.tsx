'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useRenameProjectModal } from '@/features/projects/store/use-rename-project-modal';

import { useUpdateProject } from '../api/use-update-project';

export const RenameProjectModal = () => {
  const { isOpen, onClose, id, title } = useRenameProjectModal();
  const { mutate: updateProject, isPending: isUpdatingProject } = useUpdateProject(id);

  const [name, setName] = useState(title);
  const [prevTitle, setPrevTitle] = useState(title);

  if (title !== prevTitle) {
    setPrevTitle(title);
    setName(title);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || name.length < 3 || name.length > 50) return;

    updateProject(
      {
        name,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen || isUpdatingProject} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Rename workspace</DialogTitle>

          <VisuallyHidden.Root>
            <DialogDescription>Quickly update and manage workspace name with ease.</DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>

        <form onSubmit={handleSubmit} autoCapitalize="off" autoComplete="off">
          <Input
            disabled={isUpdatingProject}
            placeholder="Workspace name"
            minLength={3}
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <DialogFooter className="mt-4 gap-y-2 pt-2">
            <Button type="submit" className="ml-auto" disabled={isUpdatingProject}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
