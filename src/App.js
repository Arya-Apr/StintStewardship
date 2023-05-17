import './App.css';
import React, { useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Tasks from './components/Body/Tasks/Tasks';
import Menu from './components/Menu/Menu';
import Navbar from './components/Navigation/Navbar';
import Home from './components/Body/Home/Home';
import PersonalWorkspace from './components/Body/PersonalWorkspace/PersonalWorkspace';
import Activity from './components/Body/Activity/Activity';
import Login from './components/Body/Login/Login';
import SignUp from './components/Body/SignUp/SignUp';
import Footer from './components/Footer/Footer';
import { useMutation, gql } from '@apollo/client';
const LOGIN_MUTATION = gql`
  mutation UserLogin($loginUserInput: UserLoginInput!) {
    userLogin(loginUserInput: $loginUserInput) {
      accessToken
    }
  }
`;
function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [userLogin, { loading, error }] = useMutation(LOGIN_MUTATION);
  const [state, setState] = useState({
    password: '',
    username: '',
    role: '',
  });
  const nav = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    setToken(null);
    localStorage.removeItem('authToken');
    nav('/login');
  };
  const handle = () => {
    setIsExpanded(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    userLogin({
      variables: { loginUserInput: state },
    })
      .then((response) => {
        if (response) {
          localStorage.setItem(
            'authToken',
            response.data.userLogin.accessToken
          );
          setState({
            username: '',
            password: '',
            role: '',
          });
          nav('/home');
        }
      })
      .catch((error) => console.log(error));
  };
  const onChangeHandler = (e) => {
    const value = e.target.value;

    setState({
      ...state,
      [e.target.id]: value,
    });
  };
  return (
    <div className='App' onClick={handle}>
      <Navbar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        token={token}
      />
      <Menu
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route
          path='/tasks'
          element={
            <Tasks isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
          }
        />
        <Route path='/personal' element={<PersonalWorkspace />} />
        <Route path='/activities' element={<Activity />} />
        <Route
          path='/login'
          element={
            <Login
              handleSubmit={handleSubmit}
              onChangeHandler={onChangeHandler}
              state={state}
              loading={loading}
              error={error}
            />
          }
        />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/' element={<Navigate replace to='/home' />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
