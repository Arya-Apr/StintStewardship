import React from 'react';
import './Icons.css';
import { NavLink } from 'react-router-dom';
const icons = [
  {
    id: 1,
    name: 'Home',
    path: '/home',
    svg: `<svg width="30" height="28" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.9748 23.8571V36H2V14.1429L19.9623 2L37.9245 14.1429V36H25.9497V23.8571H13.9748Z" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        `,
  },
  {
    id: 2,
    name: 'Tasks',
    path: '/tasks',
    svg: `<svg width="30" height="28" viewBox="0 0 39 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 31.1667C12 31.1667 12 24.8261 19.5 24.8261C27 24.8261 27 31.1667 27 31.1667H12ZM2 2V23.558H37V2H2Z" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `,
  },
  {
    id: 3,
    name: 'Personal',
    path: '/personal',
    svg: `<svg width="30" height="28" viewBox="0 0 41 37" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.2222 22.7778C24.7778 22.7778 29.3333 17.8889 29.3333 11.7778C29.3333 5.66667 26.2963 2 20.2222 2C14.1481 2 11.1111 5.66667 11.1111 11.7778C11.1111 17.8889 15.6667 22.7778 20.2222 22.7778ZM20.2222 22.7778C29.3333 22.7778 38.4444 24 38.4444 35H2C2 24 11.1111 22.7778 20.2222 22.7778Z" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `,
  },
  {
    id: 4,
    name: 'Activities',
    path: '/activities',
    svg: `<svg width="30" height="28" viewBox="0 0 47 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 16.9839H14.5417L19.9167 31.9678L27.0833 2L32.4583 16.9839H45" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `,
  },
  {
    id: 5,
    name: 'Logout',
    path: '/logout',
    svg: `<svg width="30" height="28" className="logout" viewBox="0 0 43 39" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M41 19.5H9.8M41 19.5L28.52 7.83333M41 19.5L28.52 31.1667M14.48 37H2V2H14.48" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `,
  },
];
const Icons = ({ isExpanded, onLogout }) => {
  const token = localStorage.getItem('authToken');
  return (
    <>
      {isExpanded ? (
        <div className='icon-main'>
          {icons.map((icon) => {
            if (icon.name === 'Logout') {
              if (!token) {
                return null;
              }
              return (
                <NavLink
                  to={icon.path}
                  key={icon.id}
                  className={({ isActive, isPending }) =>
                    isPending ? 'pending' : isActive ? 'active' : ''
                  }
                  onClick={onLogout}
                >
                  <div key={icon.id} className={`icon-container`}>
                    <svg
                      dangerouslySetInnerHTML={{ __html: icon.svg }}
                      className='icons'
                    />

                    <span className='icon-name'>{icon.name}</span>
                  </div>
                </NavLink>
              );
            }
            return (
              <NavLink
                to={icon.path}
                key={icon.id}
                className={({ isActive, isPending }) =>
                  isPending ? 'pending' : isActive ? 'active' : ''
                }
              >
                <div key={icon.id} className={`icon-container`}>
                  <svg
                    dangerouslySetInnerHTML={{ __html: icon.svg }}
                    className='icons'
                  />

                  <span className='icon-name'>{icon.name}</span>
                </div>
              </NavLink>
            );
          })}
        </div>
      ) : (
        <div className='icon-main'>
          {icons.map((icon) => {
            if (icon.name === 'Logout') {
              if (!token) {
                return null;
              }
              return (
                <NavLink
                  to={icon.path}
                  key={icon.id}
                  className={({ isActive, isPending }) =>
                    isPending ? 'pending' : isActive ? 'active' : ''
                  }
                  onClick={onLogout}
                >
                  <div key={icon.id} className={`icon-back`}>
                    <svg
                      dangerouslySetInnerHTML={{ __html: icon.svg }}
                      className='icons'
                    />
                  </div>
                </NavLink>
              );
            }
            return (
              <NavLink
                to={icon.path}
                key={icon.id}
                className={({ isActive, isPending }) =>
                  isPending ? 'pending' : isActive ? 'active' : ''
                }
              >
                <div key={icon.id} className={`icon-back`}>
                  <svg
                    dangerouslySetInnerHTML={{ __html: icon.svg }}
                    className='icons'
                  />
                </div>
              </NavLink>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Icons;
