const { useState, useRef } = React;

const DEFAULT_AMOUNT = 0;
const DEFAULT_NAME = 'New Item';

const createItem = id => ({
  id,
  name: DEFAULT_NAME,
  amount: DEFAULT_AMOUNT,
});

const localStorage = window.localStorage;

const getInitialState = () => {
  const itemsString = localStorage.getItem('items');
  return itemsString ? JSON.parse(itemsString) : [];
};

function useItemsList() {
  const id = useRef(0);

  const [items, setItemsState] = useState(getInitialState);
  const [editing, setEditing] = useState(null);

  const setItems = (items) => {
    setItemsState(items);
    localStorage.setItem('items', JSON.stringify(items));
  };

  const newItem = () => {
    id.current = id.current + 1;

    return createItem(id.current);
  };

  const addItem = () => {
    const item = newItem();

    setItems([...items, item]);

    setEditing(item.id);
  };

  const editItem = id => () => {
    setEditing(id);
  };

  const updateItem = id => (item) => {
    setItems(items.map((i) => {
      if (i.id !== id) return i;
      return Object.assign({}, i, item);
    }));

    setEditing(null);
  };

  const destroyItem = id => () => {
    setItems(items.filter(item => item.id !== id));
  };

  return {
    items,
    addItem,
    updateItem,
    destroyItem,
    editing,
    editItem,
  };
}

export default useItemsList;
