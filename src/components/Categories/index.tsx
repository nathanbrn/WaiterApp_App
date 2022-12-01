import { FlatList } from 'react-native';

import { CategoryContainer, Icon } from './styles';
import { Text } from '../Text';
import { useState } from 'react';
import { Category } from '../../types/Category';

interface CategoriesProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => Promise<void>;
}

export function Categories({ categories, onSelectCategory}: CategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState('');

  function handleSelectedCategory(categoryId: string) {
    const category = selectedCategory === categoryId ? '' : categoryId;

    onSelectCategory(category);
    setSelectedCategory(category);
  }

  return (
    <>
      <FlatList showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24}} horizontal data={categories} keyExtractor={category => category._id} renderItem={({ item: category })=> {
        const isSelected = selectedCategory === category._id;
        return(
          <CategoryContainer onPress={() => handleSelectedCategory(category._id)}>
            <Icon>
              <Text opacity={isSelected ? 1 : 0.5}>{category.icon}</Text>
            </Icon>

            <Text opacity={isSelected ? 1 : 0.5} size={14} weight='600'>{category.name}</Text>
          </CategoryContainer>
        );
      }}/>
    </>
  );
}
