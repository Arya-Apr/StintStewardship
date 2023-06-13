import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';

import './Body.css';
const stud_roll = gql`
  query GetStudentByUsername($getStudentByName: String!) {
    getStudentByUsername(getStudentByName: $getStudentByName) {
      stud_roll
    }
  }
`;
const todoTasks = gql`
  query Query($userName: String!) {
    getAllTodoOfStudent(userName: $userName)
  }
`;

const executingTasks = gql`
  query Query($userName: String!) {
    getAllExecutingOfStudent(userName: $userName)
  }
`;

const reviewTasks = gql`
  query Query($userName: String!) {
    getAllReviewOfStudent(userName: $userName)
  }
`;

const finishedTasks = gql`
  query Query($userName: String!) {
    getAllFinishedOfStudent(userName: $userName)
  }
`;

const moveTaskToExecuting = gql`
  mutation MoveTaskToExecuting($moveToExecution: MoveToStatusInput!) {
    moveTaskToExecuting(moveToExecution: $moveToExecution)
  }
`;
const moveTaskToCompleted = gql`
  mutation MoveTaskToCompleted($moveToCompleted: MoveToStatusInput!) {
    moveTaskToCompleted(moveToCompleted: $moveToCompleted)
  }
`;
const moveTaskToTodo = gql`
  mutation MoveTaskToTodo($moveToTodo: MoveToStatusInput!) {
    moveTaskToTodo(moveToTodo: $moveToTodo)
  }
`;

const completedTasks = gql`
  query Query($userName: String!) {
    getAllCompletedOfStudent(userName: $userName)
  }
`;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: 16,
  margin: '0 0 8px 0',
  background: isDragging ? 'orange' : '#E6FFFD',
  ...draggableStyle,
});

const Tasks = (props) => {
  const { enqueueSnackbar } = useSnackbar();

  const [name, setName] = useState('');
  const todoData = useQuery(todoTasks, {
    variables: { userName: name },
  });
  const rollNo = useQuery(stud_roll, {
    variables: { getStudentByName: name },
  });
  const completedData = useQuery(completedTasks, {
    variables: { userName: name },
  });
  const executingData = useQuery(executingTasks, {
    variables: { userName: name },
  });
  const reviewData = useQuery(reviewTasks, {
    variables: { userName: name },
  });
  const finishedData = useQuery(finishedTasks, {
    variables: { userName: name },
  });
  const [taskToExecuting] = useMutation(moveTaskToExecuting);
  const [taskToTodo] = useMutation(moveTaskToTodo);
  const [taskToCompleted] = useMutation(moveTaskToCompleted);

  const [role, setRole] = useState('');
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
      setName(payload.username);
      localStorage.setItem('user-role', payload.role);
      setRole(payload.role);
    }
    setIsMounted(true);
    if (todoData.data) {
      const tododata1 = todoData.data.getAllTodoOfStudent.map((task) => {
        return { id: `item-${task}`, content: `${task}` };
      });
      setItems(tododata1);
    }
    if (completedData.data) {
      const completedData1 = completedData.data.getAllCompletedOfStudent.map(
        (task) => {
          return { id: `item-${task}`, content: `${task}` };
        }
      );
      setItems1(completedData1);
    }
    if (executingData.data) {
      const executingData1 = executingData.data.getAllExecutingOfStudent.map(
        (task) => {
          return { id: `item-${task}`, content: `${task}` };
        }
      );
      setItems2(executingData1);
    }
    if (reviewData.data) {
      const reviewData1 = reviewData.data.getAllReviewOfStudent.map((task) => {
        return { id: `item-${task}`, content: `${task}` };
      });
      setItems3(reviewData1);
    }
    if (finishedData.data) {
      const finishedData1 = finishedData.data.getAllFinishedOfStudent.map(
        (task) => {
          return { id: `item-${task}`, content: `${task}` };
        }
      );
      setItems4(finishedData1);
    }
    if (rollNo.data) {
      setRoll(+rollNo.data.getStudentByUsername.stud_roll);
    }
  }, [
    todoData,
    completedData,
    executingData,
    reviewData,
    finishedData,
    rollNo,
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

  const isDragDisabled = role === 'student';
  const isDropDisabled = role === 'student';

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
      <div className='title-for-page'>Your School Tasks</div>

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
                        snapshot.isDraggingOver ? 'lightblue' : '#F6FA70'
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
                        snapshot.isDraggingOver ? 'lightblue' : '#F6FA70'
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
                        snapshot.isDraggingOver ? 'lightblue' : '#F6FA70'
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
              <Droppable
                droppableId='droppable-3'
                isDropDisabled={isDropDisabled}
              >
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: `${
                        snapshot.isDraggingOver ? 'lightblue' : '#F6FA70'
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
                        isDragDisabled={isDragDisabled}
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
              <Droppable
                droppableId='droppable-4'
                isDropDisabled={isDropDisabled}
              >
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: `${
                        snapshot.isDraggingOver ? 'lightblue' : '#F6FA70'
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
                        isDragDisabled={isDragDisabled}
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

export default Tasks;
