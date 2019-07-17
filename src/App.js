import Item from './Item.js';

const { useState, useRef } = React;

const DEFAULT_AMOUNT = 0;
const DEFAULT_NAME = 'New Item';

function App() {
  const [budget, setBudget] = useState(20);
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const id = useRef(0);

  const newItem = () => {
    id.current = id.current + 1;

    return {
      id: id.current,
      name: DEFAULT_NAME,
      amount: DEFAULT_AMOUNT,
    };
  };

  const addItem = () => {
    const item = newItem();

    setItems([...items, item]);
    setEditing(item.id);
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

  const editItem = id => () => {
    setEditing(id);
  };

  return (
    <div>
      <header className="header">
        <h1>Grocery Budget</h1>
      </header>
      <div className="stickyStats">
        <div>
          <label>
            Budget $
            <input
              type="number"
              value={budget}
              onChange={({ target }) => setBudget(target.value)}
            />
          </label>
        </div>
        <div>
          Total: ${items.reduce((sum, { amount }) => sum + amount, 0)}
        </div>
      </div>
      <div>
        <ul className="itemsList">
          {
            items.map((item) => (
              <Item
                key={item.id}
                item={item}
                editing={editing === item.id}
                update={updateItem(item.id)}
                edit={editItem(item.id)}
                destroy={destroyItem(item.id)}
              />
            ))
          }

          <li>
            <button
              onClick={addItem}
              className="addItem"
              tabIndex={0}
            >+</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
