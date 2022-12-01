import { useState } from 'react';
import { FlatList } from 'react-native';
import { Product } from '../../types/product';
import { formatCurrency } from '../../utils/formatCurrency';
import { api } from '../Api';
import { PlusCircle } from '../Icons/PlusCircle';
import { ProductModal } from '../ProductModal';
import { Text } from '../Text';
import { ProductContainer, ProductDetails, ProductImage, Separator, AddToCardButton} from './styles';

interface MenuProps {
  onAddToCart: (product: Product) => void;
  products: Product[];
}

export function Menu({ onAddToCart, products }: MenuProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<null | Product>(null);

  function handleOpenModal(product: Product) {
    setIsModalVisible(true);
    setSelectedProduct(product);
  }

  return (
    <>
      <ProductModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        product={selectedProduct}
        onAddToCart={onAddToCart}
      />

      <FlatList ItemSeparatorComponent={Separator} style={{ marginTop: 32}} contentContainerStyle={{ paddingHorizontal: 24}} data={products} keyExtractor={product => product._id} renderItem={({ item: product}) => (
        <ProductContainer onPress={() => handleOpenModal(product)}>
          <ProductImage
            source={{
              uri: `${api}/uploads/${product.imagePath}`,
            }}
          />
          <ProductDetails>
            <Text weight='600'>{product.name}</Text>
            <Text size={14} color='#666'>{product.description}</Text>
            <Text size={14} weight='600' style={{ marginVertical: 8 }}>{formatCurrency(product.price)}</Text>
          </ProductDetails>

          <AddToCardButton onPress={() => onAddToCart(product)}>
            <PlusCircle />
          </AddToCardButton>
        </ProductContainer>
      )} />
    </>
  );
}
