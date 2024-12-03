import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { HStack, Image, Text, Heading, VStack } from '@gluestack-ui/themed';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { SlideInRight, SlideOutRight, Layout, Easing } from 'react-native-reanimated';
import { UserSkill } from '../@types/userSkill';
import { Trash2 } from 'lucide-react-native';

interface LibraryItemProps {
  skill: UserSkill;
  onToggleFavorite: (id: number) => void;
  onDelete: (id: number) => void;
  onPress: (skillId: string) => void;
}

export const LibraryPostCard: React.FC<LibraryItemProps> = ({ skill, onToggleFavorite, onDelete, onPress }) => {

  const renderStars = (level: number) => {
    const fullStars = Math.floor(level);
    const emptyStars = 5 - fullStars;

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <Icon key={index} name="star" size={16} color="yellow" />
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <Icon key={index + fullStars} name="star-border" size={16} color="yellow" />
        ))}
      </>
    );
  };

  const renderLeftActions = () => (
    <View style={styles.swipeableRemove}>
      <Trash2 size={24} color="white" />
    </View>
  );

  return (
    <Animated.View
      entering={SlideInRight.duration(400).easing(Easing.ease)}  
      exiting={SlideOutRight.duration(400).easing(Easing.ease)} 
      layout={Layout.springify().damping(20).mass(1).stiffness(90)} 
    >
      <Swipeable
        overshootLeft={false}
        containerStyle={styles.swipeableContainer}
        leftThreshold={10}
        renderLeftActions={renderLeftActions}
        onSwipeableOpen={() => onDelete(skill.id)}
      >
        <TouchableOpacity onPress={() => onPress(skill.skillId.toString())}>
          <HStack
            borderWidth="$1"
            borderColor="$gray400"
            alignItems="center"
            p="$2"
            pr="$4"
            rounded="$md"
            mb="$3"
            backgroundColor="$gray900"
          >
            <Image
              source={{ uri: skill.image }}
              alt={`Imagem de ${skill.skillName}`}
              w="$16"
              h="$20"
              rounded="$md"
              mr="$4"
              ml="$1"
              resizeMode="cover"
            />
            <VStack flex={1}>
              <Heading fontSize="$lg" color="$white" fontFamily="$heading">
                {skill.skillName}
              </Heading>
              <HStack justifyContent='flex-start'>
                {renderStars(skill.level)}
              </HStack>
              <Text
                fontSize="$sm"
                color="$gray200"
                mt="$1"
                mb="$2"
                mr="$2"
                numberOfLines={2}
              >
                {skill.description}
              </Text>
            </VStack>
            <HStack mx="$2">
              <TouchableOpacity onPress={() => onToggleFavorite(skill.id)}>
                <Icon
                  name={skill.favorite ? 'favorite' : 'favorite-border'}
                  size={24}
                  color={skill.favorite ? '#dc2626' : 'gray'}
                />
              </TouchableOpacity>
            </HStack>
          </HStack>
          <HStack mt="$2">
          </HStack>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  swipeableContainer: {
    marginBottom: 10,
    borderRadius: 5,
  },
  swipeableRemove: {
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '85%',
    borderRadius: 5,
  },
});
