import React from 'react';
import './SearchPanel.css';
const SearchPanel = () => {
  return (
    <div className='search'>
      <button className='icon'>
        <svg
          width='22'
          height='22'
          viewBox='0 0 22 22'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M9.2709 18.1429C13.8388 18.1429 17.5418 14.3053 17.5418 9.57143C17.5418 4.83756 13.8388 1 9.2709 1C4.70301 1 1 4.83756 1 9.57143C1 14.3053 4.70301 18.1429 9.2709 18.1429Z'
            stroke='black'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M15.4741 16L20.2988 21'
            stroke='black'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
      <input type='search' placeholder='Search' className='inp'></input>
    </div>
  );
};

export default SearchPanel;
