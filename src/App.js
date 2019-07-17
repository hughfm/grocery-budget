import Item from './Item.js';
import useItemsList from './useItemsList.js';
import createLocalStorage from './localStorage.js';

const { useState } = React;

const { get: getLocalBudget, set: setLocalBudget } = createLocalStorage('budget');

function App() {
  const [budget, setBudgetState] = useState(() => (getLocalBudget() || 40));

  const setBudget = (value) => {
    setBudgetState(value);
    setLocalBudget(value);
  };

  const {
    items,
    editing,
    addItem,
    updateItem,
    destroyItem,
    editItem,
  } = useItemsList();

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
