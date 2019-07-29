import { WEIGHT_QTY_TYPE, UNIT_QTY_TYPE } from './useItemsList.js';

const { useRef, useState, useEffect } = React;

function toggleQuantityType(type) {
  switch (type) {
    case UNIT_QTY_TYPE:
      return WEIGHT_QTY_TYPE;
    case WEIGHT_QTY_TYPE:
      return UNIT_QTY_TYPE;
    default:
      return undefined;
  }
}

function amountSuffix(quantityType) {
  return {
    [UNIT_QTY_TYPE]: 'ea.',
    [WEIGHT_QTY_TYPE]: '/kg',
  }[quantityType];
}

function quantitySuffix(quantityType) {
  return {
    [UNIT_QTY_TYPE]: 'x',
    [WEIGHT_QTY_TYPE]: 'g',
  }[quantityType];
}

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
    quantity,
    quantityType,
    totalAmount,
  } = item;

  const {
    name: draftName,
    amount: draftAmount,
    quantity: draftQuantity = 1,
    quantityType: draftQuantityType = UNIT_QTY_TYPE,
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

  const computedTotal = totalAmount
    ? totalAmount.toFixed(2)
    : ((quantity || 1) * amount).toFixed(2);

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
                Object.assign(
                  {},
                  draft,
                  {
                    quantity: draftQuantityType === UNIT_QTY_TYPE
                      ? parseInt(target.value) || null
                      : parseFloat(target.value) || null,
                    totalAmount: draftQuantityType === UNIT_QTY_TYPE
                      ? (parseInt(target.value) * draftAmount)
                      : (parseFloat(target.value) / 1000 * draftAmount),
                  }
                )
              )
            }
          />
        ) : (
          <div
            className="itemQuantity"
            tabIndex={0}
          >
            {quantity || 1}
          </div>
        )
      }

      <span>
        {
          editing ? (
            quantitySuffix(draftQuantityType)
          ) : (
            quantitySuffix(quantityType || UNIT_QTY_TYPE)
          )
        }
      </span>

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
                Object.assign(
                  {},
                  draft,
                  {
                    amount: parseFloat(target.value) || null,
                    totalAmount: draftQuantityType === UNIT_QTY_TYPE
                      ? (parseFloat(target.value) * draftQuantity)
                      : (parseFloat(target.value) * draftQuantity / 1000),
                  }
                )
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

      {
        editing ? (
          <button
            onClick={() => {
              setDraft(
                Object.assign(
                  {},
                  draft,
                  { quantityType: toggleQuantityType(draftQuantityType) }
                )
              );
            }}
          >
            {amountSuffix(draftQuantityType)}
          </button>
        ) : (
          <span className="each">
            {amountSuffix(quantityType || UNIT_QTY_TYPE)}
          </span>
        )
      }

      {
        !editing && (
          <span className="computedItemTotal">
            ${computedTotal}
          </span>
        )
      }

      <button
        onClick={destroy}
        className="removeItem"
      >🗑️</button>
    </li>
  );
}

export default Item;
