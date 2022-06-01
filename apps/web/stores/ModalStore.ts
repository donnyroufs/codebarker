import { proxy } from 'valtio';

type Props = {
  isOpen: boolean;
};

export const ModalStore = proxy<Props>({
  isOpen: false,
});
