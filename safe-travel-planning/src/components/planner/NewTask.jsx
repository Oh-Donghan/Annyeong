import { useRef, useState } from 'react';

export default function NewTask({ onAdd }) {
  const [enteredTask, setEnteredTask] = useState('');

  const inputRef = useRef();

  function handleChange(event) {
    setEnteredTask(event.target.value);
  }

  function handleClick() {
  if (enteredTask.trim() === '') {
    inputRef.current.placeholder = 'Please enter a task'; // 값을 변경해야 함
    return;
  }
  onAdd(enteredTask);
  setEnteredTask('');
}

  return (
    <div className='flex items-center gap-4'>
      <input
        type='text'
        className='w-64 px-2 py-1 rounded-sm bg-stone-200'
        onChange={handleChange}
        value={enteredTask}
        ref={inputRef}
      />
      <button
        className='text-stone-700 hover:text-stone-950'
        onClick={handleClick}
      >
        Add Task
      </button>
    </div>
  );
}
