import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  ModalCloseButton,
  ModalBody,
  Text,
  Heading,
} from '@chakra-ui/react';
import { signIn } from 'next-auth/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const SignInModal = ({ isOpen, onClose }: Props): JSX.Element => {
  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent bgColor="brand.600" color="brand.white" borderRadius={12}>
        <ModalHeader>
          <Text
            letterSpacing=".14rem"
            fontWeight="thin"
            m={0}
            p={0}
            color="brand.accent"
            fontSize="md"
          >
            codebarker.
          </Text>
          <Heading
            letterSpacing=".14rem"
            fontSize="4xl"
            as="h3"
            textTransform="uppercase"
            m={0}
            p={0}
            lineHeight=".9"
          >
            Sign In
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button
            variant="outline"
            onClick={(): Promise<void> => signIn('github')}
          >
            Login with Github
          </Button>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
