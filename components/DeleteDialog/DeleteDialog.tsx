import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteDialogProps {
  onDelete: () => void;
  invoiceId: string;
}

export const DeleteDialog = ({ onDelete, invoiceId }: DeleteDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className="bg-[#EC5757] hover:bg-[#FF9797] cursor-pointer transition-colors px-4 rounded-3xl text-white font-semibold text-sm h-[48px] flex items-center">
          Delete
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white dark:bg-[#1E2139] p-10">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-heading">
            Confirm Deletion
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[#888EB0] dark:text-[#DFE3FA]">
            Are you sure you want to delete invoice #{invoiceId}? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-[#F9FAFE] dark:bg-[#252945] cursor-pointer pt-[8px] transition-colors px-6 rounded-3xl text-[#7E88C3] dark:text-[#DFE3FA] font-semibold text-sm min-h-[48px] flex items-center sheet-close-button">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-[#EC5757] hover:bg-[#FF9797] cursor-pointer transition-colors px-6 rounded-3xl text-white font-semibold text-sm h-[48px] flex items-center"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
