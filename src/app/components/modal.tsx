import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

type EditModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description?: string) => void;
  item?: { id: number, title: string, description?: string };
  isCategory?: boolean;
};

const EditModal: React.FC<EditModalProps> = ({ visible, onClose, onSave, item, isCategory = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [item]);

  const handleSave = () => {
    onSave(title, description);
    onClose();
  };

  return (
    <Modal 
      isOpen={visible} 
      onOpenChange={onClose}
      placement="top-center"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">{item ? (isCategory ? 'Edit Category' : 'Edit Activity') : (isCategory ? 'Add New Category' : 'Add New Activity')}</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Title"
                placeholder={isCategory ? "Enter category title" : "Enter activity title"}
                variant="bordered"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {!isCategory && (
                <Input
                  label="Description"
                  placeholder="Enter activity description"
                  variant="bordered"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={handleSave}>
                {item ? 'Update' : 'Add'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditModal;