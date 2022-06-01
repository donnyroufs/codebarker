import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Heading,
  VStack,
} from '@chakra-ui/react';
import { Button } from '@codebarker/components';
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
      <ModalContent bgColor="brand.600" color="brand.text" borderRadius={12}>
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
          <VStack spacing={2} my={6}>
            <Button
              tabIndex={1}
              fontSize="md"
              fontWeight="bold"
              w="full"
              variant="outline"
              onClick={(): Promise<void> => signIn('github')}
              bgColor="#151329"
              py={6}
              _hover={{
                bgColor: '#151329',
                opacity: 0.8,
              }}
            >
              Continue with Github
            </Button>
            <Button
              tabIndex={2}
              fontSize="md"
              bgColor="#151329"
              fontWeight="bold"
              _hover={{
                bgColor: '#151329',
                opacity: 0.8,
              }}
              w="full"
              py={6}
              variant="outline"
              onClick={(): Promise<void> => signIn('discord')}
            >
              Continue with Discord
            </Button>
            <Button
              tabIndex={3}
              fontSize="md"
              bgColor="#151329"
              fontWeight="bold"
              _hover={{
                bgColor: '#151329',
                opacity: 0.8,
              }}
              w="full"
              py={6}
              variant="outline"
              onClick={(): Promise<void> => signIn('google')}
            >
              Continue with Google
            </Button>
          </VStack>
          {/* <Text
            as="button"
            onClick={(): void => alert('not yet implemented')}
            mb={6}
            textAlign="center"
            w="full"
            textDecor="underline"
          >
            Want to try the app first? <b>Continue as guest</b>
          </Text> */}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
