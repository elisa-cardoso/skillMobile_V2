import React from "react";
import { Button, HStack, Icon, Text } from "@gluestack-ui/themed";

import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}: PaginationProps) => {
  return (
    <HStack justifyContent="space-between" alignItems="center" px="$5" mt="$5" pb="$8">
      <HStack justifyContent="flex-start" gap="$4">
      <Button
        h="$10"
        w="$10"
        bg="$gray900"
        borderColor="$gray400"
        borderWidth="$1" onPress={onPrevPage} disabled={currentPage === 1}>
          <Icon as={ChevronLeft} color="$gray200" />
        </Button>
        <Button
        h="$10"
        w="$10"
        bg="$gray900"
        borderColor="$gray400"
        borderWidth="$1"
          onPress={onNextPage}
          disabled={currentPage === totalPages}
        >
          <Icon as={ChevronRight} color="$gray200" />
          </Button>


      </HStack>

      <Text size="sm" color="$gray200">{`Página ${currentPage} de ${totalPages}`}</Text>
    </HStack>
  );
};
