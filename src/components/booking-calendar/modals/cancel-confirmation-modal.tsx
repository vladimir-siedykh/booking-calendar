'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CancelConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const CancelConfirmationModal: React.FC<
  CancelConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent
        className="border-neutral-700 bg-neutral-900"
        aria-describedby="cancel-description"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-neutral-100">
            Cancel Meeting
          </AlertDialogTitle>
          <AlertDialogDescription
            id="cancel-description"
            className="text-neutral-400"
          >
            Are you sure you want to cancel this meeting? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex w-full gap-3">
            <Button
              onClick={onClose}
              className="flex-1"
            >
              Keep Meeting
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Cancelling...' : 'Cancel Meeting'}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
