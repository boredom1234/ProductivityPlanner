import { useSelector, useDispatch } from 'react-redux';
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { Link, useNavigate, useParams } from 'react-router-dom';
import assets from '../../assets/index';
import { useEffect, useState } from 'react';
import boardApi from '../../api/boardApi';
import { setBoards } from '../../redux/features/boardSlice';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import FavouriteList from './FavouriteList';

const Sidebar = () => {
  const user = useSelector((state) => state.user.value);
  const boards = useSelector((state) => state.board.value);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { boardId } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);

  const sidebarWidth = 250;

  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getAll();
        dispatch(setBoards(res));
      } catch (err) {
        alert(err);
      }
    };
    getBoards();
  }, [dispatch]);

  useEffect(() => {
    const activeItem = boards.findIndex((e) => e.id === boardId);
    if (boards.length > 0 && boardId === undefined) {
      navigate(`/boards/${boards[0].id}`);
    }
    setActiveIndex(activeItem);
  }, [boards, boardId, navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const onDragEnd = async ({ source, destination }) => {
    const newList = [...boards];
    const [removed] = newList.splice(source.index, 1);
    newList.splice(destination.index, 0, removed);

    const activeItem = newList.findIndex((e) => e.id === boardId);
    setActiveIndex(activeItem);
    dispatch(setBoards(newList));

    try {
      await boardApi.updatePositoin({ boards: newList });
    } catch (err) {
      alert(err);
    }
  };

  const addBoard = async () => {
    try {
      const res = await boardApi.create();
      const newList = [res, ...boards];
      dispatch(setBoards(newList));
      navigate(`/boards/${res.id}`);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Drawer
      container={window.document.body}
      variant="permanent"
      open={true}
      sx={{
        width: sidebarWidth,
        height: '100vh',
        '& > div': { borderRight: 'none' },
        backgroundColor: '#252525', // Background color for the sidebar
        color: '#FFFFFF', // Text color
      }}
    >
      <List
        disablePadding
        sx={{
          width: sidebarWidth,
          height: '100vh',
        }}
      >
        <ListItem>
          <Box sx={{ width: '100%' }}>
            <Typography variant="h8" fontWeight="bold">
              {user.username}
            </Typography>
          </Box>
        </ListItem>
        <Box sx={{ paddingTop: '10px' }} />
        <FavouriteList />
        <Box sx={{ paddingTop: '10px' }} />
        <ListItem>
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6" fontWeight="bold">
              Your Boards
            </Typography>
          </Box>
        </ListItem>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable key={'list-board-droppable-key'} droppableId={'list-board-droppable'}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {boards.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <ListItemButton
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        selected={index === activeIndex}
                        component={Link}
                        to={`/boards/${item.id}`}
                        sx={{
                          pl: '30px',
                          cursor: snapshot.isDragging ? 'grab' : 'pointer!important',
                          backgroundColor: index === activeIndex ? '#00B0FF' : 'transparent', // Active board color
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: index === activeIndex ? '#FFFFFF' : '#CCCCCC', // Text color for inactive boards
                          }}
                        >
                          {item.icon} {item.title}
                        </Typography>
                      </ListItemButton>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <ListItem>
          <IconButton onClick={addBoard} sx={{ marginLeft: 'auto', color: '#00B0FF' }}>
            <AddBoxOutlinedIcon fontSize="small" />
          </IconButton>
        </ListItem>
      </List>
      <IconButton onClick={logout} sx={{ marginLeft: 'auto', color: '#FFFFFF' }}>
        <LogoutOutlinedIcon fontSize="small" />
      </IconButton>
    </Drawer>
  );
};

export default Sidebar;
