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
    totalAmount,
  } = useItemsList();

  const currentPosition = budget - totalAmount;
  const positionClasses = ["currentPosition"];

  useEffect(() => {
    if (itemAdded) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      setItemAdded(false);
    }
  }, [itemAdded]);

  if (currentPosition > 0) {
    positionClasses.push("positive");
  } else if (currentPosition < 0) {
    positionClasses.push("negative");
  }

  return (
    <div>
      <header className="header">
        <h1>Groceries</h1>
        <div className="credits">
          Created by <a href="https://www.hughfm.com">Hugh Middleton</a>. View the code on <a href="https://www.github.com/hughfm/grocery-budget">GitHub</a>.
        </div>
      </header>
      <div className="stickyStats">
        <div className="statsTopLine">
          <label>
            Enter total budget:
            $<input
              type="number"
              value={budget}
              onChange={({ target }) => setBudget(target.value)}
              className="budgetInput"
            />
          </label>
          <span className="runningTotal">
            Running total:
            ${totalAmount.toFixed(2)}
          </span>
        </div>
        <div className="statsBottomLine">
          <div className={positionClasses.join(" ")}>
            {currentPosition < 0 ? "-" : (currentPosition > 0 ? "+" : "")}${Math.abs(currentPosition).toFixed(2)}
            &nbsp;
            {currentPosition < 0 ? "over!" : "to spend"}
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
