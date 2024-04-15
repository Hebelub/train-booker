import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TrashIcon } from '@/utils/icons';

interface DeletionDialogProps {
    onDeleteConfirmed: () => void;   
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const DeletionDialog = ({ onDeleteConfirmed, isOpen, onOpenChange }: DeletionDialogProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(isOpen);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2"><TrashIcon /> Delete Session</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this session? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-4 mt-4">
                    <DialogClose asChild>
                        <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={() => {
                        onDeleteConfirmed();
                        setIsDialogOpen(false);
                    }}>Delete</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeletionDialog;
