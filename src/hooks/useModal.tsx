
import { useState, useCallback } from 'react';

interface ModalState {
  isOpen: boolean;
  data?: any;
}

export const useModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    data: undefined
  });

  const openModal = useCallback((data?: any) => {
    setModalState({ isOpen: true, data });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ isOpen: false, data: undefined });
  }, []);

  const toggleModal = useCallback((data?: any) => {
    setModalState(prev => ({
      isOpen: !prev.isOpen,
      data: prev.isOpen ? undefined : data
    }));
  }, []);

  return {
    isOpen: modalState.isOpen,
    data: modalState.data,
    openModal,
    closeModal,
    toggleModal
  };
};
