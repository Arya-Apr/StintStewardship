import React, { useEffect, useState } from 'react';
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
const iconsT = [
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
    name: 'Task+',
    path: '/addTask',
    svg: `<svg width="30" height="30" className="add-task-logo" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_116_3)">
    <path d="M44 10.36L21.18 33.2L12.7 24.72L15.52 21.9L21.18 27.56L41.18 7.56L44 10.36ZM24 40C15.18 40 8 32.82 8 24C8 15.18 15.18 8 24 8C27.14 8 30.08 8.92 32.56 10.5L35.46 7.6C32.2 5.34 28.26 4 24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C27.46 44 30.72 43.12 33.56 41.56L30.56 38.56C28.56 39.48 26.34 40 24 40ZM38 30H32V34H38V40H42V34H48V30H42V24H38V30Z" fill="black"/>
    </g>
    <defs>
    <clipPath id="clip0_116_3">
    <rect width="48" height="48" fill="white"/>
    </clipPath>
    </defs>
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
  const [role, setRole] = useState();
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const parts = token.split('.');
      const payloadbase = parts[1];
      const payload = JSON.parse(atob(payloadbase));
      setRole(payload.role);
      console.log(role);
    }
  }, [role]);
  return (
    <>
      {isExpanded ? (
        <div className='icon-main'>
          {role === 'student' &&
            icons.map((icon) => {
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
              if (token) {
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
              } else {
                return null;
              }
            })}
          {role === 'teacher' &&
            iconsT.map((icon) => {
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
              if (token) {
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
              } else {
                return null;
              }
            })}
        </div>
      ) : (
        <div className='icon-main'>
          {role === 'student' &&
            icons.map((icon) => {
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
              if (token) {
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
              } else {
                return null;
              }
            })}
          {role === 'teacher' &&
            iconsT.map((icon) => {
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
              if (token) {
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
              } else {
                return null;
              }
            })}
        </div>
      )}
    </>
  );
};

export default Icons;
