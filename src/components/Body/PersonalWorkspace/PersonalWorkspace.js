import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';

import '../Tasks/Body.css';
import AddTask from './AddTask/AddTask';
const stud_roll = gql`
  query GetStudentByUsername($getStudentByName: String!) {
    getStudentByUsername(getStudentByName: $getStudentByName) {
      stud_roll
    }
  }
`;
const todoTasks = gql`
  query Query($userName: String!) {
    getAllPersonalTodoOfStudent(userName: $userName)
  }
`;
const todoTeacher = gql`
  query Query($userName: String!) {
    getAllTodoOfTeacher(userName: $userName)
  }
`;
const executingTasks = gql`
  query Query($userName: String!) {
    getAllPersonalExecutingOfStudent(userName: $userName)
  }
`;
const executingTeacher = gql`
  query Query($userName: String!) {
    getAllExecutingOfTeacher(userName: $userName)
  }
`;
const completedTasks = gql`
  query Query($userName: String!) {
    getAllPersonalCompletedOfStudent(userName: $userName)
  }
`;
const completedTeacher = gql`
  query Query($userName: String!) {
    getAllCompletedOfTeacher(userName: $userName)
  }
`;
const reviewTasks = gql`
  query Query($userName: String!) {
    getAllPersonalReviewOfStudent(userName: $userName)
  }
`;
const reviewTeacher = gql`
  query Query($userName: String!) {
    getAllReviewOfTeacher(userName: $userName)
  }
`;

const finishedTasks = gql`
  query Query($userName: String!) {
    getAllPersonalFinishedOfStudent(userName: $userName)
  }
`;

const finishedTeacher = gql`
  query Query($userName: String!) {
    getAllFinishedOfTeacher(userName: $userName)
  }
`;

const moveTaskToExecuting = gql`
  mutation MoveTaskToExecuting($moveToExecution: MoveToStatusInput!) {
    moveTaskToExecuting(moveToExecution: $moveToExecution)
  }
`;
const moveExecutingTeacher = gql`
  mutation MoveTaskToExecutingForTeacher($moveToExecution: SwitchStatusInput!) {
    moveTaskToExecutingForTeacher(moveToExecution: $moveToExecution)
  }
`;
const moveTaskToCompleted = gql`
  mutation MoveTaskToCompleted($moveToCompleted: MoveToStatusInput!) {
    moveTaskToCompleted(moveToCompleted: $moveToCompleted)
  }
`;
const moveCompletedTeacher = gql`
  mutation MoveTaskToCompletedForTeacher($moveToCompleted: SwitchStatusInput!) {
    moveTaskToCompletedForTeacher(moveToCompleted: $moveToCompleted)
  }
`;
const moveTaskToTodo = gql`
  mutation MoveTaskToTodo($moveToTodo: MoveToStatusInput!) {
    moveTaskToTodo(moveToTodo: $moveToTodo)
  }
`;
const moveTodoTeacher = gql`
  mutation MoveTaskToTodoForTeacher($moveToTodo: SwitchStatusInput!) {
    moveTaskToTodoForTeacher(moveToTodo: $moveToTodo)
  }
`;
const moveTaskToReview = gql`
  mutation MovePersonalTaskToReview($moveToReview: MoveToStatusInput!) {
    movePersonalTaskToReview(moveToReview: $moveToReview)
  }
`;
const moveReviewTeacher = gql`
  mutation MoveTaskToReviewForTeacher($moveToReview: SwitchStatusInput!) {
    moveTaskToReviewForTeacher(moveToReview: $moveToReview)
  }
`;
const moveTaskToFinished = gql`
  mutation MovePersonalTaskToFinished($moveToFinished: MoveToStatusInput!) {
    movePersonalTaskToFinished(moveToFinished: $moveToFinished)
  }
`;

const moveFinishedTeacher = gql`
  mutation MoveTaskToFinishedForTeacher($moveToFinished: SwitchStatusInput!) {
    moveTaskToFinishedForTeacher(moveToFinished: $moveToFinished)
  }
`;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: 16,
  margin: '0 0 8px 0',
  background: isDragging ? 'orange' : '#E6FFFD',
  ...draggableStyle,
});

const PersonalWorkspace = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const todoData = useQuery(todoTasks, {
    variables: { userName: name },
  });
  const todoT = useQuery(todoTeacher, {
    variables: {
      userName: name,
    },
  });
  const rollNo = useQuery(stud_roll, {
    variables: { getStudentByName: name },
  });
  const completedData = useQuery(completedTasks, {
    variables: { userName: name },
  });
  const completedT = useQuery(completedTeacher, {
    variables: {
      userName: name,
    },
  });
  const executingData = useQuery(executingTasks, {
    variables: { userName: name },
  });
  const executingT = useQuery(executingTeacher, {
    variables: { userName: name },
  });
  const reviewData = useQuery(reviewTasks, {
    variables: { userName: name },
  });
  const reviewT = useQuery(reviewTeacher, {
    variables: {
      userName: name,
    },
  });
  const finishedData = useQuery(finishedTasks, {
    variables: { userName: name },
  });
  const finishedT = useQuery(finishedTeacher, {
    variables: { userName: name },
  });
  const [taskToExecuting] = useMutation(moveTaskToExecuting);
  const [moveExecutingT] = useMutation(moveExecutingTeacher);
  const [taskToTodo] = useMutation(moveTaskToTodo);
  const [moveTodoT] = useMutation(moveTodoTeacher);
  const [taskToCompleted] = useMutation(moveTaskToCompleted);
  const [moveCompletedT] = useMutation(moveCompletedTeacher);
  const [taskToReview] = useMutation(moveTaskToReview);
  const [moveReviewT] = useMutation(moveReviewTeacher);
  const [taskToFinished] = useMutation(moveTaskToFinished);
  const [moveFinishedT] = useMutation(moveFinishedTeacher);
  const [roll, setRoll] = useState('');
  const [items, setItems] = useState([]);
  const [items1, setItems1] = useState([]);
  const [items2, setItems2] = useState([]);
  const [items3, setItems3] = useState([]);
  const [items4, setItems4] = useState([]);

  const { setIsExpanded } = props;
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const parts = token.split('.');
      const payloadbase = parts[1];
      const payload = JSON.parse(atob(payloadbase));
      setRole(payload.role);
      setName(payload.username);
    }
    setIsMounted(true);
    if (role === 'student') {
      if (todoData.data) {
        const tododata1 = todoData.data.getAllPersonalTodoOfStudent.map(
          (task) => {
            return { id: `item-${task}`, content: `${task}` };
          }
        );
        setItems(tododata1);
      }
      if (completedData.data) {
        const completedData1 =
          completedData.data.getAllPersonalCompletedOfStudent.map((task) => {
            return { id: `item-${task}`, content: `${task}` };
          });
        setItems1(completedData1);
      }
      if (executingData.data) {
        const executingData1 =
          executingData.data.getAllPersonalExecutingOfStudent.map((task) => {
            return { id: `item-${task}`, content: `${task}` };
          });
        setItems2(executingData1);
      }
      if (reviewData.data) {
        const reviewData1 = reviewData.data.getAllPersonalReviewOfStudent.map(
          (task) => {
            return { id: `item-${task}`, content: `${task}` };
          }
        );
        setItems3(reviewData1);
      }
      if (finishedData.data) {
        const finishedData1 =
          finishedData.data.getAllPersonalFinishedOfStudent.map((task) => {
            return { id: `item-${task}`, content: `${task}` };
          });
        setItems4(finishedData1);
      }
      if (rollNo.data) {
        setRoll(+rollNo.data.getStudentByUsername.stud_roll);
      }
    }
    if (role === 'teacher') {
      if (todoT.data) {
        const tododata1 = todoT.data.getAllTodoOfTeacher.map((task) => {
          return { id: `item-${task}`, content: `${task}` };
        });
        setItems(tododata1);
      }
      if (executingT.data) {
        const executingData1 = executingT.data.getAllExecutingOfTeacher.map(
          (task) => {
            return { id: `item-${task}`, content: `${task}` };
          }
        );
        setItems2(executingData1);
      }
      if (completedT.data) {
        const completedData1 = completedT.data.getAllCompletedOfTeacher.map(
          (task) => {
            return { id: `item-${task}`, content: `${task}` };
          }
        );
        setItems1(completedData1);
      }
      if (reviewT.data) {
        const reviewData1 = reviewT.data.getAllReviewOfTeacher.map((task) => {
          return { id: `item-${task}`, content: `${task}` };
        });
        setItems3(reviewData1);
      }
      if (finishedT.data) {
        const finishedData1 = finishedT.data.getAllFinishedOfTeacher.map(
          (task) => {
            return { id: `item-${task}`, content: `${task}` };
          }
        );
        setItems4(finishedData1);
      }
    }
  }, [
    todoData,
    completedData,
    executingData,
    reviewData,
    finishedData,
    todoT,
    executingT,
    completedT,
    reviewT,
    finishedT,
    rollNo,
    role,
  ]);

  const getDroppableItems = (droppableId) => {
    switch (droppableId) {
      case 'droppable':
        return items;
      case 'droppable-2':
        return items1;
      case 'droppable-1':
        return items2;
      case 'droppable-3':
        return items3;
      case 'droppable-4':
        return items4;
      default:
        return [];
    }
  };

  const updateDroppableItems = (droppableId, items) => {
    switch (droppableId) {
      case 'droppable':
        setItems(items);
        break;
      case 'droppable-2':
        setItems1(items);
        break;
      case 'droppable-1':
        setItems2(items);
        break;
      case 'droppable-3':
        setItems3(items);
        break;
      case 'droppable-4':
        setItems4(items);
        break;
      default:
        break;
    }
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) {
      enqueueSnackbar('Not Found ☠️', {
        style: { background: 'red' },
      });
      return;
    }

    const sourceDroppableId = source.droppableId;
    const destinationDroppableId = destination.droppableId;

    if (sourceDroppableId === destinationDroppableId) {
      const droppableItems = [...getDroppableItems(sourceDroppableId)];
      const [removed] = droppableItems.splice(source.index, 1);
      droppableItems.splice(destination.index, 0, removed);
      updateDroppableItems(sourceDroppableId, droppableItems);
    } else {
      const sourceItems = [...getDroppableItems(sourceDroppableId)];
      const destinationItems = [...getDroppableItems(destinationDroppableId)];
      const [removed] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, removed);
      if (role === 'student') {
        if (destinationDroppableId === 'droppable-1') {
          taskToExecuting({
            variables: {
              moveToExecution: {
                task_name: removed.content,
                student_roll: roll,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.moveTaskToExecuting);
                if (response.data.moveTaskToExecuting) {
                  enqueueSnackbar('Switched! ⚙️', {
                    style: { background: 'Purple' },
                  });
                } else {
                  enqueueSnackbar('Try That Again! 😣', {
                    style: { background: 'red' },
                  });
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (destinationDroppableId === 'droppable') {
          taskToTodo({
            variables: {
              moveToTodo: {
                student_roll: roll,
                task_name: removed.content,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.moveTaskToTodo);
                if (response.data.moveTaskToTodo) {
                  enqueueSnackbar('Switched! ⚙️', {
                    style: { background: 'Purple' },
                  });
                } else {
                  enqueueSnackbar('Try That Again! 😣', {
                    style: { background: 'red' },
                  });
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (destinationDroppableId === 'droppable-2') {
          taskToCompleted({
            variables: {
              moveToCompleted: {
                student_roll: roll,
                task_name: removed.content,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.moveTaskToCompleted);
                if (response.data.moveTaskToCompleted) {
                  enqueueSnackbar('Switched! ⚙️', {
                    style: { background: 'Purple' },
                  });
                } else {
                  enqueueSnackbar('Try That Again! 😣', {
                    style: { background: 'red' },
                  });
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (destinationDroppableId === 'droppable-3') {
          taskToReview({
            variables: {
              moveToReview: {
                task_name: removed.content,
                student_roll: roll,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.movePersonalTaskToReview);
                if (response.data.movePersonalTaskToReview) {
                  enqueueSnackbar('Switched! ⚙️', {
                    style: { background: 'Purple' },
                  });
                } else {
                  enqueueSnackbar('Try That Again! 😣', {
                    style: { background: 'red' },
                  });
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (destinationDroppableId === 'droppable-4') {
          taskToFinished({
            variables: {
              moveToFinished: {
                task_name: removed.content,
                student_roll: roll,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.movePersonalTaskToFinished);
                if (response.data.movePersonalTaskToFinished) {
                  enqueueSnackbar('Switched! ⚙️', {
                    style: { background: 'Purple' },
                  });
                } else {
                  enqueueSnackbar('Try That Again! 😣', {
                    style: { background: 'red' },
                  });
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
      if (role === 'teacher') {
        if (destinationDroppableId === 'droppable-1') {
          moveExecutingT({
            variables: {
              moveToExecution: {
                task_name: removed.content,
                teacher_username: name,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.moveTaskToExecutingForTeacher);
                if (response.data.moveTaskToExecutingForTeacher) {
                  enqueueSnackbar('Switched! ⚙️', {
                    style: { background: 'Purple' },
                  });
                } else {
                  enqueueSnackbar('Try That Again! 😣', {
                    style: { background: 'red' },
                  });
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (destinationDroppableId === 'droppable') {
          moveTodoT({
            variables: {
              moveToTodo: {
                teacher_username: name,
                task_name: removed.content,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.moveTaskToTodoForTeacher);
                if (response.data.moveTaskToTodoForTeacher) {
                  enqueueSnackbar('Switched! ⚙️', {
                    style: { background: 'Purple' },
                  });
                } else {
                  enqueueSnackbar('Try That Again! 😣', {
                    style: { background: 'red' },
                  });
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (destinationDroppableId === 'droppable-2') {
          moveCompletedT({
            variables: {
              moveToCompleted: {
                teacher_username: name,
                task_name: removed.content,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.moveTaskToCompletedForTeacher);
                if (response.data.moveTaskToCompletedForTeacher) {
                  enqueueSnackbar('Switched! ⚙️', {
                    style: { background: 'Purple' },
                  });
                } else {
                  enqueueSnackbar('Try That Again! 😣', {
                    style: { background: 'red' },
                  });
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (destinationDroppableId === 'droppable-3') {
          moveReviewT({
            variables: {
              moveToReview: {
                task_name: removed.content,
                teacher_username: name,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.moveTaskToReviewForTeacher);
                if (response.data.moveTaskToReviewForTeacher) {
                  enqueueSnackbar('Switched! ⚙️', {
                    style: { background: 'Purple' },
                  });
                } else {
                  enqueueSnackbar('Try That Again! 😣', {
                    style: { background: 'red' },
                  });
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (destinationDroppableId === 'droppable-4') {
          moveFinishedT({
            variables: {
              moveToFinished: {
                task_name: removed.content,
                teacher_username: name,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.moveTaskToFinishedForTeacher);
                if (response.data.moveTaskToFinishedForTeacher) {
                  enqueueSnackbar('Switched! ⚙️', {
                    style: { background: 'Purple' },
                  });
                } else {
                  enqueueSnackbar('Try That Again! 😣', {
                    style: { background: 'red' },
                  });
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
      updateDroppableItems(sourceDroppableId, sourceItems);
      updateDroppableItems(destinationDroppableId, destinationItems);
    }
  };
  const handle = () => {
    setIsExpanded(false);
  };

  return (
    <div className='body' onClick={handle}>
      <div className='title-button'>
        <div className='title-for-page'>Your Personal Tasks</div>
        {name && <AddTask />}
      </div>
      <div className='dndcontext'>
        <DragDropContext onDragEnd={onDragEnd} enableDefaultSensors>
          {isMounted ? (
            <div className='drop'>
              <Droppable droppableId='droppable'>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: `${
                        snapshot.isDraggingOver ? '#D4F7FE' : '#F6FA70'
                      }`,
                      position: 'absolute',
                      left: 140,
                      top: 70,
                      borderRadius: 10,
                      padding: 8,
                      width: 250,
                      minHeight: 50,
                    }}
                  >
                    <h4 className='task-status-name'>To-Do</h4>

                    {items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className='card'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId='droppable-1'>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: `${
                        snapshot.isDraggingOver ? '#D4F7FE' : '#F6FA70'
                      }`,
                      position: 'absolute',
                      left: 415,
                      borderRadius: 10,
                      padding: 8,
                      top: 70,
                      width: 250,
                      minHeight: 50,
                    }}
                  >
                    <h4 className='task-status-name'>Executing</h4>
                    {items2.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={`task-${item.id}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className='card'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId='droppable-2'>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: `${
                        snapshot.isDraggingOver ? '#D4F7FE' : '#F6FA70'
                      }`,
                      position: 'absolute',
                      left: 695,
                      borderRadius: 10,
                      padding: 8,
                      top: 70,
                      width: 250,
                      minHeight: 50,
                    }}
                  >
                    <h4 className='task-status-name'>Completed</h4>
                    {items1.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={`task-${item.id}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className='card'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId='droppable-3'>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: `${
                        snapshot.isDraggingOver ? '#D4F7FE' : '#F6FA70'
                      }`,
                      position: 'absolute',
                      left: 975,
                      borderRadius: 10,
                      padding: 8,
                      top: 70,
                      width: 250,
                      minHeight: 50,
                    }}
                  >
                    <h4 className='task-status-name'>Review</h4>
                    {items3.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={`task-${item.id}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className='card'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId='droppable-4'>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: `${
                        snapshot.isDraggingOver ? '#D4F7FE' : '#F6FA70'
                      }`,
                      position: 'absolute',
                      left: 1255,
                      borderRadius: 10,
                      padding: 8,
                      top: 70,
                      width: 250,
                      minHeight: 50,
                    }}
                  >
                    <h4 className='task-status-name'>Finished</h4>
                    {items4.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={`task-${item.id}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className='card'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ) : null}
        </DragDropContext>
      </div>
    </div>
  );
};

export default PersonalWorkspace;
