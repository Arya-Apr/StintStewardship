import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import './Home.css';
const GET_USER = gql`
  query GetStudentByUsername($getStudentByName: String!) {
    getStudentByUsername(getStudentByName: $getStudentByName) {
      stud_name
    }
  }
`;
const Home = ({ state }) => {
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const getNameQuery = useQuery(GET_USER, {
    variables: { getStudentByName: name },
  });
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const parts = token.split('.');
      const payloadbase = parts[1];
      const payload = JSON.parse(atob(payloadbase));
      setName(payload.username);
      const data = getNameQuery.data;
      if (data) {
        console.log(data.getStudentByUsername.stud_name);
        setDisplayName(data.getStudentByUsername.stud_name);
      }
    }
  }, [getNameQuery]);
  return (
    <div className='home-class'>
      <div className='home-greet'>
        <h6>Hello! {displayName}</h6>
      </div>
    </div>
  );
};

export default Home;
