import createLocalStorage from './localStorage.js';

const { useState, useRef, useEffect } = React;

const DEFAULT_AMOUNT = 0;
const DEFAULT_NAME = '';
export const DEFAULT_UNITS = 1;

const createItem = id => ({
  id,
  name: DEFAULT_NAME,
  amount: DEFAULT_AMOUNT,
  quantity: DEFAULT_UNITS,
});

const { get: getLocalItems, set: setLocalItems } = createLocalStorage('items');

function useItemsList() {
  const [items, setItemsState] = useState(() => (getLocalItems() || []));
  const [editing, setEditing] = useState(null);

  const id = useRef(null);

  if (id.current === null) {
    id.current = items.length
      ? Math.max(...items.map(({ id }) => id))
      : 0;
  }

  const setItems = (items) => {
    setItemsState(items);
    setLocalItems(items);
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

  useEffect(() => {
    const handleStorageChange = ({ key }) => {
      if (key === 'items') {
        const newState = getLocalItems() || [];
        setItemsState(newState);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [window]);

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
