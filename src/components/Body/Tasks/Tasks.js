import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useQuery, gql } from '@apollo/client';
import './Body.css';

const todoTasks = gql`
  query Query($userName: String!) {
    getAllTodoOfStudent(userName: $userName)
  }
`;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: 16,
  margin: '0 0 8px 0',
  background: isDragging ? 'lightgreen' : 'grey',
  ...draggableStyle,
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
const Tasks = (props) => {
  const [name, setName] = useState('');
  const todoData = useQuery(todoTasks, {
    variables: { userName: name },
  });
  const [items, setItems] = useState([]);
  const [items1, setItems1] = useState([]);
  const { setIsExpanded } = props;
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    //THE LOGIC HERE FETCHES THE TODO TASKS AND SHOWS THEM TO THE TAB!!
    const token = localStorage.getItem('authToken');
    if (token) {
      const parts = token.split('.');
      const payloadbase = parts[1];
      const payload = JSON.parse(atob(payloadbase));
      setName(payload.username);
    }

    setItems1([]);
    setIsMounted(true);
    if (todoData.data) {
      const data1 = [
        { id: 'item-1', content: 'Item 1' },
        { id: 'item-2', content: 'Item 2' },
        { id: 'item-3', content: 'Item 3' },
      ];
      const tododata1 = todoData.data.getAllTodoOfStudent.map((task) => {
        return { id: `item-${task}`, content: `${task}` };
      });
      console.log(tododata1);
      console.log(data1);
      setItems(tododata1);
      console.log(todoData.data.getAllTodoOfStudent);
    }
  }, [todoData]);
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    if (result.destination.droppableId === result.source.droppableId) {
      if (result.destination.droppableId === 'droppable') {
        const reorderedItems = reorder(
          items,
          result.source.index,
          result.destination.index
        );
        console.log(reorderedItems);
        setItems(reorderedItems);
      } else {
        const reorderedItems = reorder(
          items1,
          result.source.index,
          result.destination.index
        );
        console.log(reorderedItems);
        setItems1(reorderedItems);
      }
    }
    let add,
      active = items,
      complete = items1;
    if (result.source.droppableId === 'droppable') {
      add = active[result.source.index];
      active.splice(result.source.index, 1);
    } else {
      add = complete[result.source.index];
      complete.splice(result.source.index, 1);
    }
    if (result.destination.droppableId === 'droppable') {
      active.splice(result.destination.index, 0, add);
    } else {
      complete.splice(result.destination.index, 0, add);
    }

    setItems(active);
    setItems1(complete);
  };

  const handle = () => {
    setIsExpanded(false);
  };
  return (
    <div className='body' onClick={handle}>
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
                        snapshot.isDraggingOver ? 'lightblue' : 'lightgrey'
                      }`,
                      position: 'absolute',
                      left: 400,
                      top: 50,
                      borderRadius: 10,
                      padding: 8,
                      width: 250,
                      minHeight: 50,
                    }}
                  >
                    <h4>To-Do</h4>

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
                        snapshot.isDraggingOver ? 'lightblue' : 'lightgrey'
                      }`,
                      position: 'absolute',
                      left: 800,
                      borderRadius: 10,
                      padding: 8,
                      top: 50,
                      width: 250,
                      minHeight: 50,
                    }}
                  >
                    <h4>Completed</h4>
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
            </div>
          ) : null}
        </DragDropContext>
      </div>
    </div>
  );
};

export default Tasks;
