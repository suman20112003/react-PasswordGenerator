import { useState, useCallback, useEffect, useRef } from 'react';

function App() {
  const [length, setLength] = useState(12);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [strength, setStrength] = useState('');
  const passwordRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (numberAllowed) str += '0123456789';
    if (charAllowed) str += '!@#$%^&*';

    for (let i = 0; i < length; i++) {
      const charIndex = Math.floor(Math.random() * str.length);
      pass += str.charAt(charIndex);
    }

    setPassword(pass);
    calculateStrength(pass);
    setPasswordHistory((prev) => [...prev, pass]);
  }, [length, numberAllowed, charAllowed]);

  const calculateStrength = (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    const criteriaMet = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

    if (password.length < 8) {
      setStrength('Too Weak');
    } else if (criteriaMet === 4) {
      setStrength('Very Strong');
    } else if (criteriaMet === 3) {
      setStrength('Strong');
    } else {
      setStrength('Weak');
    }
  };

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 99999);
    window.navigator.clipboard.writeText(password)
      .then(() => {
        alert('Password copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }, [password]);

  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  const clearFields = () => {
    setPassword('');
    setLength(12);
    setNumberAllowed(false);
    setCharAllowed(false);
    setPasswordHistory([]);
    setStrength('');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className='text-white text-3xl text-center font-bold mb-4'>Secure Password Generator</h1>
        <div className="flex shadow rounded-lg overflow-hidden mb-4">
          <input
            type="text"
            value={password}
            className="outline-none w-full py-2 px-3 bg-gray-700 text-white"
            placeholder="Generated Password"
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={copyPasswordToClipboard}
            className='outline-none bg-blue-600 text-white px-4 py-2'
          >
            Copy
          </button>
        </div>
        <div className='flex mb-4'>
          <span className={`text-${strength === 'Very Strong' ? 'green' : strength === 'Strong' ? 'yellow' : 'red'}-500`}>
            Strength: {strength}
          </span>
        </div>
        <div className='flex text-sm gap-x-4 mb-4'>
          <div className='flex items-center gap-x-1'>
            <input
              type="range"
              min={6}
              max={100}
              value={length}
              className='cursor-pointer'
              onChange={(e) => setLength(Number(e.target.value))}
            />
            <label className='text-white'>Length: {length}</label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              checked={numberAllowed}
              id="numberInput"
              onChange={() => setNumberAllowed((prev) => !prev)}
            />
            <label htmlFor="numberInput" className='text-white'>Include Numbers</label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              checked={charAllowed}
              id="characterInput"
              onChange={() => setCharAllowed((prev) => !prev)}
            />
            <label htmlFor="characterInput" className='text-white'>Include Special Characters</label>
          </div>
        </div>
        <button
          onClick={clearFields}
          className='w-full bg-red-600 text-white py-2 rounded mt-4'
        >
          Clear
        </button>
        {passwordHistory.length > 0 && (
          <div className="mt-4 text-white">
            <h2 className='text-lg font-semibold'>Password History</h2>
            <ul className="list-disc ml-4">
              {passwordHistory.map((pw, index) => (
                <li key={index}>{pw}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
