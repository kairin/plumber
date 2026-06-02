import { useMemo, useState } from 'react'
import { RiArrowDownSLine } from 'react-icons/ri'
import {
  Box,
  Flex,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { transformForClient } from '@emailens/engine'

interface ClientOption {
  id: string
  label: string
}

const CLIENT_OPTIONS: ClientOption[] = [
  {
    id: 'outlook-windows-legacy',
    label: 'Microsoft Outlook',
  },
  {
    id: 'gmail-web',
    label: 'Gmail',
  },
  {
    id: 'apple-mail-macos',
    label: 'Apple Mail',
  },
  {
    id: 'yahoo-mail',
    label: 'Yahoo Mail',
  },
]

interface ClientOptionsListProps {
  selectedClientId: string
  onSelect: (id: string) => void
}

function ClientOptionsList({
  selectedClientId,
  onSelect,
}: ClientOptionsListProps) {
  return (
    <List spacing={1}>
      {CLIENT_OPTIONS.map((option) => {
        const isSelected = option.id === selectedClientId
        return (
          <ListItem key={option.id}>
            <Box
              as="button"
              type="button"
              w="100%"
              textAlign="left"
              px={5}
              py={2}
              borderRadius="md"
              bg={isSelected ? 'primary.100' : undefined}
              _hover={{ bg: isSelected ? undefined : 'grey.100' }}
              aria-current={isSelected || undefined}
              onClick={() => onSelect(option.id)}
            >
              <Text textStyle="body-1">{option.label}</Text>
            </Box>
          </ListItem>
        )
      })}
    </List>
  )
}

interface ViewAsEmailModalProps {
  isOpen: boolean
  onClose: () => void
  html: string
  title: string
}

export default function ViewAsEmailModal({
  isOpen,
  onClose,
  html,
  title,
}: ViewAsEmailModalProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>(
    'outlook-windows-legacy',
  )

  const transformed = useMemo(() => {
    return transformForClient(html, selectedClientId).html
  }, [html, selectedClientId])

  const selectedClient =
    CLIENT_OPTIONS.find((option) => option.id === selectedClientId) ??
    CLIENT_OPTIONS[0]

  const clientPopover = useDisclosure()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      motionPreset="none"
      isCentered
    >
      <ModalOverlay />
      <ModalContent maxH="85vh" overflow="hidden" borderRadius="lg">
        <ModalHeader borderBottom="1px solid" borderColor="base.divider.medium">
          <Flex direction="column">{title}</Flex>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody p={4}>
          <Flex direction={{ base: 'column', sm: 'row' }} gap={4} h="70vh">
            <Box
              display={{ base: 'none', sm: 'block' }}
              borderRight="1px solid"
              borderColor="base.divider.medium"
              pr={2}
            >
              <ClientOptionsList
                selectedClientId={selectedClientId}
                onSelect={setSelectedClientId}
              />
            </Box>
            <Box display={{ base: 'block', sm: 'none' }}>
              <Popover
                isOpen={clientPopover.isOpen}
                onOpen={clientPopover.onOpen}
                onClose={clientPopover.onClose}
                matchWidth
                placement="bottom-start"
              >
                <PopoverTrigger>
                  <Box
                    as="button"
                    type="button"
                    w="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    px={3}
                    py={2}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="base.divider.medium"
                  >
                    <Text textStyle="body-1">{selectedClient.label}</Text>
                    <RiArrowDownSLine />
                  </Box>
                </PopoverTrigger>
                <PopoverContent w="100%" minW={0}>
                  <PopoverBody p={2}>
                    <ClientOptionsList
                      selectedClientId={selectedClientId}
                      onSelect={(id) => {
                        setSelectedClientId(id)
                        clientPopover.onClose()
                      }}
                    />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>
            <Box flex="1" minW={0}>
              <iframe
                title="Email preview"
                srcDoc={transformed}
                sandbox=""
                style={{ width: '100%', height: '100%', border: 0 }}
              />
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
