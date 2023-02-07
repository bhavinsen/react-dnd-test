import './App.css';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox,  Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormDialog from './Component/FormDialog';
import { useDispatch, useSelector } from 'react-redux';
import { getItems, getSavedData, removeEntries, rotateItems, saveItems, saveList } from './Store/prefSlice';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import CloseIcon from '@mui/icons-material/Close';
function App() {

  const [checked, setChecked] = useState([])
  const dispatch = useDispatch()
  const getData = useSelector(getSavedData)
  const items = useSelector(getItems)
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      const selectedObject = items.filter(data => data.value === value)
      newChecked.push(selectedObject[0]);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const Items = Array.from(items);
    const [reorderedItem] = Items.splice(result.source.index, 1);
    Items.splice(result.destination.index, 0, reorderedItem);
    dispatch(rotateItems(Items))
  }
  function handleOnDragEndItems(result) {
    if (!result.destination) return;

    const Items = Array.from(getData);
    const [reorderedItem] = Items.splice(result.source.index, 1);
    Items.splice(result.destination.index, 0, reorderedItem);

    dispatch(saveItems(Items));
  }
  const handleClose = async (data) => {
    try {
      dispatch(saveList({ data: checked, name: data }))
      setChecked([])
    } catch (er) {
      console.log(er)
    }
  }
  const [search, setSearch] = useState("")
  return (
    <Grid container justifyContent={'center'} >
      <Grid sx={{ height: "500px" }} item xs={12} lg={3} md={4}>
        <Paper >

          <Paper
            component="form"
            sx={{ p: '2px 0px', display: 'flex', alignItems: 'center', minWidth: "100%" }}
          >
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              onChange={(e) => { setSearch(e.target.value) }}
              value={search}
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              inputProps={{ 'aria-label': 'Search' }}
            />
          </Paper>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="characters">
              {(provided) => (
                <Box sx={{ width: "100%", minHeight: "350px" }} className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                  {items.filter(data => data.label.toLowerCase().includes(search.toLowerCase())).map(({ value, label }, index) => {
                    const labelId = `list-item-${index}`;
                    return (
                      <Draggable key={index} draggableId={labelId} index={index}>
                        {(provided) => (
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            id={index}
                            dense
                            button
                          >
                            <Checkbox
                              edge="start"
                              checked={checked.some(data => data.value === value)}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': label }}
                              onClick={handleToggle(value)}
                            />
                            <ListItemText id={labelId} primary={label} />
                            <IconButton
                              {...provided.dragHandleProps}
                            >
                              <DragHandleIcon />
                            </IconButton>
                          </ListItem>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Saved</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DragDropContext onDragEnd={handleOnDragEndItems}>
                <Droppable droppableId="characters">
                  {(provided) => (
                    <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: "70px", minHeight: "50px", overflowY: getData?.length > 2 ? "scroll" : "hidden" }} {...provided.droppableProps} ref={provided.innerRef}>
                      {getData?.map((data, index) => {
                        const labelId = `list-item-${index}`;
                        return (
                          <Draggable key={index} draggableId={labelId} index={index}>
                            {(provided) => (
                              <ListItem
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                id={index}
                                key={index}
                                secondaryAction={
                                  <IconButton  {...provided.dragHandleProps} edge="end" aria-label="comments">
                                    <DragHandleIcon />
                                  </IconButton>
                                }
                                disablePadding
                              >
                                <ListItemButton onClick={() => { dispatch(removeEntries(index)) }} role={undefined} dense>
                                  <ListItemIcon>
                                    <CloseIcon />
                                  </ListItemIcon>
                                  <ListItemText id={labelId} primary={data?.name} />
                                </ListItemButton>
                              </ListItem>
                            )}
                          </Draggable>
                        );
                      })}
                    </List>
                  )}
                </Droppable>
              </DragDropContext>
            </AccordionDetails>
          </Accordion>
          <FormDialog callback={handleClose} />
          <Box sx={{ display: "flex", alignitems: 'center', justifyContent: "space-between", m: 1 }}>
            <Button variant="text">Close</Button>
            <Button variant="text" onClick={() => { setChecked([]) }}>Reset</Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default App;
