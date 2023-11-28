"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
};

export const AlertModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal
      title="Are you sure?"
      description="This action cannot be undone"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex items-center justify-end pt-6 space-x-2 w-full">
        <Button
          variant="outline"
          disabled={loading}
          onClick={onClose}
          className="text-gray-500 hover:text-gray-600 transition-colors duration-200"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          disabled={loading}
          onClick={onConfirm}
          className="ml-4 text-white transition-colors duration-200"
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};
