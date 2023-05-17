import React from 'react';
import './Login.css';

const Login = ({ handleSubmit, onChangeHandler, state, loading, error }) => {
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
            />
          </fieldset>
          <button
            className='login-button green'
            type='submit'
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'LogIn'}
          </button>
          {error && <p style={{ color: 'white' }}>{error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
