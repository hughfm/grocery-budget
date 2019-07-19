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

  const [draft, setDraft] = useState(item);

  const { id, name, amount } = item;
  const { name: draftName, amount: draftAmount } = draft;

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
    if (key === 'Enter') update(draft);
  };

  const editOnEnter = ({ key }) => {
    if (key === 'Enter') edit();
  };

  const hasUnsavedChanges = name !== draftName || amount !== draftAmount;

  const classNames = ['listItem'];

  if (hasUnsavedChanges) {
    classNames.push('edited');
  } else {
    classNames.push('saved');
  }

  if (editing) {
    classNames.push('editing');
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

      {
        editing ? (
          <input
            type="number"
            min={0}
            value={draftAmount}
            ref={amountInput}
            className="itemAmount"
            onChange={({ target }) => setDraft(Object.assign({}, draft, { amount: parseFloat(target.value) }))}
          />
        ) : (
          <div
            className="itemAmount"
            tabIndex={0}
          >
            {`$${amount}`}
          </div>
        )
      }

      <span
        onClick={destroy}
        className="removeItem"
      >X</span>
    </li>
  );
}

export default Item;
