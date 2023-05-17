import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const STUDENT_SIGN = gql`
  mutation CreateStudent($createStudentInput: CreateStudentInput!) {
    createStudent(createStudentInput: $createStudentInput) {
      stud_id
      stud_name
      stud_roll
      tasks
      username
      comment
      password
      semester
    }
  }
`;
const TEACHER_SIGN = gql`
  mutation CreateTeacher($createTeacherInput: CreateTeachersInput!) {
    createTeacher(createTeacherInput: $createTeacherInput) {
      teacher_id
      teacher_name
      teacher_subject
    }
  }
`;

const SignUp = () => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [username, setUsername] = useState('');
  const [roll, setRoll] = useState();
  const [semester, setSemester] = useState();
  const [password, setPassword] = useState('');
  const [createTeacher, stat_teach] = useMutation(TEACHER_SIGN);
  const [createStudent, stat_stud] = useMutation(STUDENT_SIGN);
  const nav = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.id === 'form1') {
      createStudent({
        variables: {
          createStudentInput: {
            stud_name: name,
            stud_roll: +roll,
            username,
            password,
            semester: +semester,
          },
        },
      })
        .then((response) => {
          if (response) {
            setName('');
            setUsername('');
            setPassword('');
            setSemester('');
            setRoll('');
            nav('/login');
            console.log(response);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (e.target.id === 'form2') {
      createTeacher({
        variables: {
          createTeacherInput: {
            teacher_name: name,
            teacher_subject: subject,
            username,
            password,
          },
        },
      })
        .then((response) => {
          if (response) {
            setName('');
            setUsername('');
            setPassword('');
            setSubject('');
            nav('/login');
            console.log(response);
          }
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <div className='signup'>
      <Tabs.Root className='TabsRoot' defaultValue='tab1'>
        <Tabs.List className='TabsList' aria-label='Manage your account'>
          <Tabs.Trigger className='TabsTrigger' value='tab1'>
            Student
          </Tabs.Trigger>
          <Tabs.Trigger className='TabsTrigger' value='tab2'>
            Teacher
          </Tabs.Trigger>
        </Tabs.List>
        <ScrollArea.Root className='ScrollAreaRoot'>
          <ScrollArea.Viewport className='ScrollAreaViewport'>
            <Tabs.Content className='TabsContent' value='tab1'>
              <p className='Text'>
                Register here as a student. Make sure to provide correct
                credentials and remember your password and username.
              </p>
              <form onSubmit={handleSubmit} id='form1'>
                <fieldset className='Fieldset'>
                  <label className='Label' htmlFor='name'>
                    Name
                  </label>
                  <input
                    className='Input'
                    id='name'
                    placeholder='Your Name'
                    name='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </fieldset>
                <fieldset className='Fieldset'>
                  <label className='Label' htmlFor='roll'>
                    Enrollment Number
                  </label>
                  <input
                    className='Input'
                    id='roll'
                    placeholder='Your Roll Number'
                    name='roll'
                    value={roll}
                    onChange={(e) => setRoll(e.target.value)}
                  />
                </fieldset>
                <fieldset className='Fieldset'>
                  <label className='Label' htmlFor='sem'>
                    Semester
                  </label>
                  <input
                    className='Input'
                    id='sem'
                    placeholder='Your Semester'
                    name='sem'
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  />
                </fieldset>
                <fieldset className='Fieldset'>
                  <label className='Label' htmlFor='username'>
                    Username
                  </label>
                  <input
                    className='Input'
                    id='username'
                    placeholder='Your Username'
                    name='username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </fieldset>
                <fieldset className='Fieldset'>
                  <label className='Label' htmlFor='password'>
                    Password
                  </label>
                  <input
                    className='Input'
                    id='password'
                    type='password'
                    placeholder='Your Password'
                    autoComplete='false'
                    name='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </fieldset>
                <div
                  style={{
                    display: 'flex',
                    marginTop: 20,
                    justifyContent: 'flex-end',
                  }}
                >
                  <button
                    className='Button green'
                    type='submit'
                    disabled={stat_stud.loading}
                  >
                    SignUp
                  </button>
                </div>
              </form>
            </Tabs.Content>
            <ScrollArea.Scrollbar
              className='ScrollAreaScrollbar'
              orientation='vertical'
            >
              <ScrollArea.Thumb className='ScrollAreaThumb' />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner className='ScrollAreaCorner' />
            <Tabs.Content className='TabsContent' value='tab2'>
              <p className='Text'>
                SignUp as a teacher. Please enter correct credentials.
              </p>
              <form onSubmit={handleSubmit} id='form2'>
                <fieldset className='Fieldset'>
                  <label className='Label' htmlFor='name'>
                    Name
                  </label>
                  <input
                    className='Input'
                    id='name'
                    type='text'
                    placeholder='Your Name'
                    name='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </fieldset>
                <fieldset className='Fieldset'>
                  <label className='Label' htmlFor='subject'>
                    Subject
                  </label>
                  <input
                    className='Input'
                    id='subject'
                    type='text'
                    placeholder='Your Subject'
                    name='subject'
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </fieldset>
                <fieldset className='Fieldset'>
                  <label className='Label' htmlFor='username'>
                    Username
                  </label>
                  <input
                    className='Input'
                    id='username'
                    type='text'
                    placeholder='Your Username'
                    name='username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </fieldset>
                <fieldset className='Fieldset'>
                  <label className='Label' htmlFor='password'>
                    Password
                  </label>
                  <input
                    className='Input'
                    id='password'
                    type='password'
                    placeholder='Your Password'
                    autoComplete='false'
                    name='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </fieldset>
                <div
                  style={{
                    display: 'flex',
                    marginTop: 20,
                    justifyContent: 'flex-end',
                  }}
                >
                  <button
                    className='Button green'
                    type='submit'
                    disabled={stat_teach.loading}
                  >
                    SignUp
                  </button>
                </div>
              </form>
            </Tabs.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className='ScrollAreaScrollbar'
            orientation='vertical'
          >
            <ScrollArea.Thumb className='ScrollAreaThumb' />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner className='ScrollAreaCorner' />
        </ScrollArea.Root>
      </Tabs.Root>
    </div>
  );
};

export default SignUp;
