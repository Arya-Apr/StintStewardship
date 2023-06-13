import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import './Login.css';
import { NavLink } from 'react-router-dom';

const Login = ({ handleSubmit, onChangeHandler, state, loading, error }) => {
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    enqueueSnackbar(`Welcome To StintStwardship! 🙏🏻`, {
      preventDuplicate: 'true',
      style: { background: '#ee9b00' },
    });
  }, [enqueueSnackbar]);
  return (
    <div className='login'>
      <div className='login-div'>
        <h5 className='login-title'>Log-In</h5>
        <p className='login-message'>Login in with correct credentials.</p>
        <form onSubmit={handleSubmit}>
          <fieldset className='Fieldset'>
            <label className='login-label' htmlFor='role'>
              Select who you are
            </label>
            <select
              className='select'
              name='role'
              id='role'
              onChange={onChangeHandler}
            >
              <option value={'teacher'}>Teacher</option>
              <option value={'student'}>Student</option>
            </select>
          </fieldset>
          <fieldset className='Fieldset'>
            <label className='login-label' htmlFor='username'>
              Username
            </label>
            <input
              type='text'
              className='login-input'
              id='username'
              name='username'
              value={state.username}
              placeholder='Your Username'
              onChange={onChangeHandler}
              required
            />
          </fieldset>
          <fieldset className='Fieldset'>
            <label className='login-label' htmlFor='password'>
              Password
            </label>
            <input
              className='login-input'
              id='password'
              type='password'
              value={state.password}
              name='password'
              placeholder='Your Password'
              autoComplete='false'
              onChange={onChangeHandler}
              required
            />
          </fieldset>
          <p style={{ color: '#EE9B00' }}>
            New User?{' '}
            <NavLink to={'/signup'} style={{ color: '#ee9b00' }}>
              SignUp
            </NavLink>
            {error && <p style={{ color: 'white' }}>{error.message}</p>}
          </p>
          <button
            className='login-button green'
            type='submit'
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'LogIn'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
