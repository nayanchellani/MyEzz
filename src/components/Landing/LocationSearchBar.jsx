import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, X } from 'lucide-react';

// Sample locations for autocomplete
const sampleLocations = [
  { id: 1, name: 'Koramangala, Bangalore', type: 'Area' },
  { id: 2, name: 'Indiranagar, Bangalore', type: 'Area' },
  { id: 3, name: 'HSR Layout, Bangalore', type: 'Area' },
  { id: 4, name: 'Whitefield, Bangalore', type: 'Area' },
  { id: 5, name: 'JP Nagar, Bangalore', type: 'Area' },
  { id: 6, name: 'Electronic City, Bangalore', type: 'Area' },
  { id: 7, name: 'Marathahalli, Bangalore', type: 'Area' },
  { id: 8, name: 'BTM Layout, Bangalore', type: 'Area' },
  { id: 9, name: 'MG Road, Bangalore', type: 'Area' },
  { id: 10, name: 'Jayanagar, Bangalore', type: 'Area' },
  { id: 11, name: 'Hebbal, Bangalore', type: 'Area' },
  { id: 12, name: 'Yelahanka, Bangalore', type: 'Area' },
];

export default function LocationSearchBar({ showToast }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 1) {
      const filtered = sampleLocations.filter(loc =>
        loc.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
    setSelectedIndex(-1);
  }, [query]);

  const handleSelect = (location) => {
    setQuery(location.name);
    setIsOpen(false);
    redirectToLogin();
  };

  const redirectToLogin = () => {
    if (showToast) {
      showToast('Please login to order your favourite food', 'info');
    }
    // Delay navigation so toast is visible
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelect(suggestions[selectedIndex]);
      } else if (query.length > 0) {
        redirectToLogin();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.length > 0) {
      redirectToLogin();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <div className="relative flex items-center bg-white rounded-xl border-2 border-orange-200 shadow-lg shadow-orange-100/50 focus-within:border-orange-400 focus-within:shadow-orange-200/70 transition-all">
        <MapPin className="absolute left-4 w-5 h-5 text-orange-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 1 && suggestions.length > 0 && setIsOpen(true)}
          placeholder="Enter delivery location..."
          className="w-full pl-12 pr-24 py-3.5 bg-transparent text-gray-800 placeholder-gray-400 rounded-xl focus:outline-none text-sm sm:text-base"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setSuggestions([]); setIsOpen(false); }}
            className="absolute right-20 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
        >
          Find Food
        </button>
      </div>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50">
          {suggestions.slice(0, 6).map((location, index) => (
            <button
              key={location.id}
              type="button"
              onClick={() => handleSelect(location)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                index === selectedIndex
                  ? 'bg-orange-50 text-orange-600'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
              <div>
                <p className="font-medium text-sm">{location.name}</p>
                <p className="text-xs text-gray-400">{location.type}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
