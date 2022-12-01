import { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { CartItem } from '../../types/cartItems';
import { Product } from '../../types/product';
import { api } from '../../utils/api';
import { api as API } from '../Api';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../Button';
import { MinusCircle } from '../Icons/MinusCircle';
import { PlusCircle } from '../Icons/PlusCircle';
import { OrderConfirmedModal } from '../OrderConfirmedModal';
import { Text } from '../Text';
import {
  Item,
  ProductContainer,
  Actions,
  Image,
  QuantityContainer,
  ProductDetails,
  Sumary,
  TotalContainer,
} from './styles';

interface CartProps {
  cartItems: CartItem[];
  onAdd: (product: Product) => void;
  onDecrement: (product: Product) => void;
  onConfirmOrder: () => void;
  selectedTable: string;
}

export function Cart({ cartItems, onAdd, onDecrement, onConfirmOrder, selectedTable }: CartProps) {
  const [isLoading, setIsLoading] = useState(false);
  const total = cartItems.reduce((acc, cartItem) => {
    return acc + cartItem.quantity * cartItem.product.price;
  }, 0);

  const [isModalVisible, setIsModalVisible] = useState(false);

  async function handleConfirmOrder() {
    setIsLoading(true);

    await api.post('/orders', {
      table: selectedTable,
      products: cartItems.map((cartItem) => ({
        product: cartItem.product._id,
        quantity: cartItem.quantity,
      })),
    });

    setIsLoading(false);
    setIsModalVisible(true);
  }

  function handleOk() {
    onConfirmOrder();
    setIsModalVisible(false);
  }

  return (
    <>

      <OrderConfirmedModal
        visible={isModalVisible}
        onOk={handleOk}
      />

      {cartItems.length > 0 && (
        <FlatList
          data={cartItems}
          style={{ marginBottom: 20, maxHeight: 150}}
          keyExtractor={cartItem => cartItem.product._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: cartItem}) => (
            <Item>
              <ProductContainer>
                <Image
                  source={{
                    uri: `${API}/uploads/${cartItem.product.imagePath}`
                  }}
                />

                <QuantityContainer>
                  <Text size={14} color='#666'>{cartItem.quantity}x</Text>
                </QuantityContainer>

                <ProductDetails>
                  <Text size={14} weight='600'>{cartItem.product.name}</Text>
                  <Text size={14} color='#666' style={{ marginTop: 14 }}>{formatCurrency(cartItem.product.price)}</Text>
                </ProductDetails>
              </ProductContainer>
              <Actions>
                <TouchableOpacity
                  style={{ marginRight: 24 }}
                  onPress={() => onAdd(cartItem.product)}
                >
                  <PlusCircle />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onDecrement(cartItem.product)}>
                  <MinusCircle />
                </TouchableOpacity>
              </Actions>
            </Item>
          )}
        />
      )}

      <Sumary>
        <TotalContainer>
          {cartItems.length > 0 ? (
            <>
              <Text color='#666'>Total</Text>
              <Text size={20} weight='600'>{formatCurrency(total)}</Text>
            </>
          ) : (
            <Text color='#666'>Seu carrinho está vazio</Text>
          )}
        </TotalContainer>

        <Button
          onPress={handleConfirmOrder}
          disabled={cartItems.length === 0}
          loading={isLoading}
        >
          Confirmar pedido
        </Button>
      </Sumary>
    </>
  );
}
