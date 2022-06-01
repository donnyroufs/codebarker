import { useSnapshot } from 'valtio';
import { ModalStore } from '../stores/ModalStore';

type Props = {
  isOpen: boolean;
  onOpen(): void;
  onClose(): void;
};

export function useModal(): Props {
  const { isOpen } = useSnapshot(ModalStore);

  function onOpen(): void {
    ModalStore.isOpen = true;
  }

  function onClose(): void {
    ModalStore.isOpen = false;
  }

  return {
    isOpen,
    onOpen,
    onClose,
  };
}
