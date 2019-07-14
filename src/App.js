const { useState, useRef, useEffect } = React;

const DEFAULT_AMOUNT = 0;
const DEFAULT_NAME = 'New Item';

function App() {
  const [budget, setBudget] = useState(20);
  const [items, setItems] = useState([]);
  const [editingName, setEditingName] = useState(null);
  const [editingAmount, setEditingAmount] = useState(null);
  const [editedName, setEditedName] = useState(null);
  const [editedAmount, setEditedAmount] = useState(null);

  const id = useRef(0);

  const newItem = () => {
    id.current = id.current + 1;

    return {
      id: id.current,
      name: DEFAULT_NAME,
      amount: DEFAULT_AMOUNT,
    };
  };

  const nameInput = useRef();
  const amountInput = useRef();

  const addItem = () => {
    setItems([...items, newItem()]);
    setEditingName(id.current);
    setEditedName(DEFAULT_NAME);
  };

  useEffect(() => {
    if (editingName && nameInput.current) {
      nameInput.current.focus();
      nameInput.current.select();
    }
  }, [editingName]);

  useEffect(() => {
    if (editingAmount && amountInput.current) {
      amountInput.current.focus();
      amountInput.current.select();
    }
  }, [editingAmount]);

  return (
    <div>
      <header className="header">
        <h1>Grocery Budget</h1>
      </header>
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
      <div>
        <ul className="itemsList">
          {
            items.map(({ id, name, amount }) => (
              <li key={id} className="listItem">
                {
                  editingName === id ? (
                    <input
                      type="text"
                      value={editedName}
                      ref={nameInput}
                      onChange={({ target }) => setEditedName(target.value)}
                      className="itemName"
                      onKeyDown={({ key, target }) => {
                        if (key === 'Enter') {
                          target.blur();
                        }
                      }}
                      onBlur={() => {
                        setEditingName(null);
                        setItems(items.map((item) => {
                          if (item.id !== id) return item;
                          return Object.assign({}, item, { name: editedName });
                        }));
                      }}
                    />
                  ) : (
                    <div
                      className="itemName"
                      tabIndex={0}
                      onFocus={() => {
                        setEditingName(id);
                        setEditedName(name);
                      }}
                    >
                      {name}
                    </div>
                  )
                }

                {
                  editingAmount === id ? (
                    <input
                      type="number"
                      min={0}
                      value={editedAmount}
                      ref={amountInput}
                      className="itemAmount"
                      onChange={({ target }) => setEditedAmount(parseInt(target.value))}
                      onKeyDown={({ key, target }) => {
                        if (key === 'Enter') {
                          target.blur();
                        }
                      }}
                      onBlur={() => {
                        setEditingAmount(null);
                        setItems(items.map((item) => {
                          if (item.id !== id) return item;
                          return Object.assign({}, item, { amount: editedAmount });
                        }));
                      }}
                    />
                  ) : (
                    <div
                      className="itemAmount"
                      tabIndex={0}
                      onFocus={() => {
                        setEditingAmount(id);
                        setEditedAmount(amount);
                      }}
                    >
                      {`$${amount}`}
                    </div>
                  )
                }

                <span
                  onClick={() => {
                    setItems(items.filter(item => item.id !== id));
                  }}
                  className="removeItem"
                >X</span>
              </li>
            ))
          }

          <li>
            <button
              onClick={() => {
                addItem();
              }}
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
