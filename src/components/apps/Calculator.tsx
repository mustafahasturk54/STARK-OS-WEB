import React, { useState } from 'react';
import { Delete } from 'lucide-react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const buttons = [
    { label: 'C', type: 'clear', className: 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white' },
    { label: '±', type: 'function', className: 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white' },
    { label: '%', type: 'function', className: 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white' },
    { label: '÷', type: 'operator', className: 'bg-orange-500 text-white' },
    
    { label: '7', type: 'number', className: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' },
    { label: '8', type: 'number', className: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' },
    { label: '9', type: 'number', className: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' },
    { label: '×', type: 'operator', className: 'bg-orange-500 text-white' },
    
    { label: '4', type: 'number', className: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' },
    { label: '5', type: 'number', className: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' },
    { label: '6', type: 'number', className: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' },
    { label: '-', type: 'operator', className: 'bg-orange-500 text-white' },
    
    { label: '1', type: 'number', className: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' },
    { label: '2', type: 'number', className: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' },
    { label: '3', type: 'number', className: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' },
    { label: '+', type: 'operator', className: 'bg-orange-500 text-white' },
    
    { label: '0', type: 'number', className: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white col-span-2' },
    { label: '.', type: 'decimal', className: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' },
    { label: '=', type: 'equals', className: 'bg-orange-500 text-white' },
  ];

  const handleButtonClick = (button: typeof buttons[0]) => {
    switch (button.type) {
      case 'number':
        inputNumber(button.label);
        break;
      case 'decimal':
        inputDecimal();
        break;
      case 'operator':
        performOperation(button.label);
        break;
      case 'equals':
        handleEquals();
        break;
      case 'clear':
        clear();
        break;
      case 'function':
        // Handle other functions like ± and %
        if (button.label === '±') {
          setDisplay(String(parseFloat(display) * -1));
        } else if (button.label === '%') {
          setDisplay(String(parseFloat(display) / 100));
        }
        break;
    }
  };

  return (
    <div className="h-full bg-gray-100 dark:bg-gray-800 flex flex-col">
      {/* Display */}
      <div className="flex-1 flex items-end justify-end p-6 bg-black text-white">
        <div className="text-right">
          <div className="text-4xl font-light leading-none">
            {display.length > 10 ? parseFloat(display).toExponential(5) : display}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-gray-50 dark:bg-gray-900">
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`
              h-16 rounded-lg font-medium text-lg transition-all duration-150
              hover:opacity-80 active:scale-95
              ${button.className}
              ${button.label === '0' ? 'col-span-2' : ''}
            `}
            onClick={() => handleButtonClick(button)}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}