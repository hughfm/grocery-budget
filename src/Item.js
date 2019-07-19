import { DEFAULT_UNITS } from './useItemsList.js';

const { useRef, useState, useEffect } = React;

function Item({
  item,
  editing,
  update,
  edit,
  destroy,
}) {
  const nameInput = useRef();
  const amountInput = useRef();
  const quantityInput = useRef();

  const [draft, setDraft] = useState(item);

  const {
    id,
    name,
    amount,
    quantity = DEFAULT_UNITS,
  } = item;

  const {
    name: draftName,
    amount: draftAmount,
    quantity: draftQuantity = 1,
  } = draft;

  useEffect(() => {
    if (editing && nameInput.current) {
      nameInput.current.focus();
      nameInput.current.select();
    }
  }, [editing]);

  useEffect(() => {
    setDraft(item);
  }, [item]);

  const itemTotal = quantity * amount;

  const updateOnEnter = ({ key }) => {
    if (key === 'Enter') update(Object.assign({}, draft, { amount: draft.amount || 0 }));
  };

  const editOnEnter = ({ key }) => {
    if (key === 'Enter') edit();
  };

  const hasUnsavedChanges = name !== draftName
    || amount !== draftAmount
    || quantity !== draftQuantity;

  const classNames = ['listItem'];

  if (hasUnsavedChanges) {
    classNames.push('edited');
  } else {
    classNames.push('saved');
  }

  if (editing) {
    classNames.push('editing');
  }

  if (amount === 0) {
    classNames.push('amountNotSet');
  } else {
    classNames.push('amountSet');
  }

  return (
    <li
      key={id}
      className={classNames.join(' ')}
      onKeyDown={editing ? updateOnEnter : editOnEnter}
      onClick={edit}
    >
      {
        editing ? (
          <input
            type="number"
            min={0}
            value={draftQuantity}
            ref={quantityInput}
            className="itemQuantity"
            onChange={
              ({ target }) => setDraft(
                Object.assign({}, draft, { quantity: parseInt(target.value) || null })
              )
            }
          />
        ) : (
          <div
            className="itemQuantity"
            tabIndex={0}
          >
            {quantity}
          </div>
        )
      }

      <span>x</span>

      {
        editing ? (
          <input
            type="text"
            value={draftName}
            ref={nameInput}
            onChange={({ target }) => setDraft(Object.assign({}, draft, { name: target.value }))}
            className="itemName"
          />
        ) : (
          <div
            className="itemName"
            tabIndex={0}
          >
            {name}
          </div>
        )
      }

      <span>@</span>

      {
        editing ? (
          <input
            type="number"
            min={0}
            value={draftAmount}
            ref={amountInput}
            className="itemAmount"
            onChange={
              ({ target }) => setDraft(
                Object.assign({}, draft, { amount: parseFloat(target.value) || null })
              )
            }
          />
        ) : (
          <div
            className="itemAmount"
            tabIndex={0}
          >
            ${amount}
          </div>
        )
      }

      <span className="each">ea.</span>

      <span className="computedItemTotal">(${itemTotal})</span>

      <button
        onClick={destroy}
        className="removeItem"
      >🗑️</button>
    </li>
  );
}

export default Item;
