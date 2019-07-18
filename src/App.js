import Item from './Item.js';
import useItemsList from './useItemsList.js';
import createLocalStorage from './localStorage.js';

const { useState, useEffect } = React;

const { get: getLocalBudget, set: setLocalBudget } = createLocalStorage('budget');

function App() {
  const [budget, setBudgetState] = useState(() => (getLocalBudget() || 40));
  const [itemAdded, setItemAdded] = useState(false);

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

  const totalAmount = items.reduce((sum, { amount }) => sum + amount, 0);
  const currentPosition = budget - totalAmount;
  const positionClasses = ["currentPosition"];

  useEffect(() => {
    if (itemAdded) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      setItemAdded(false);
    }
  }, [itemAdded]);

  if (currentPosition >= 0) {
    positionClasses.push("positive");
  } else {
    positionClasses.push("negative");
  }

  return (
    <div>
      <header className="header">
        <h1>Grocery Budget</h1>
      </header>
      <div className="stickyStats">
        <div>
          <input
            type="number"
            value={budget}
            onChange={({ target }) => setBudget(target.value)}
            className="budgetInput"
          />
        </div>
        <div className="totalAndPosition">
          <div className="runningTotal">
            {totalAmount}
          </div>
          <div className={positionClasses.join(" ")}>
            {currentPosition}
          </div>
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

          <li className="addItem">
            <button
              onClick={() => {
                addItem();
                setItemAdded(true);
              }}
              className="addItemButton"
              tabIndex={0}
            >+</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
