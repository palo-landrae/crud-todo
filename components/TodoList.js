import {
  Text,
  Input,
  Button,
  ListItem,
  IconButton,
  HStack,
  List,
  Spacer,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const TodoList = ({ todos, onDelete, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({});

  const handleDelete = (id) => {
    onDelete(id);
  };

  const handleUpdate = () => {
    onUpdate(updatedTask);
    setEditMode(false);
  };

  return (
    <List mt="4" spacing="4" width={"100%"}>
      {todos.map((todo) => (
        <ListItem key={todo.id} width={"100%"}>
          {editMode && todo.id == updatedTask.id ? (
            <HStack>
              <Input
                type="text"
                value={updatedTask.task}
                onChange={(e) =>
                  setUpdatedTask({ id: todo.id, task: e.target.value })
                }
              />
              <Button colorScheme="teal" onClick={() => handleUpdate(todo.id)}>
                Save
              </Button>
            </HStack>
          ) : (
            <Flex>
              <Text>{todo.task}</Text>
              <Spacer />
              <HStack>
                <IconButton
                  aria-label="Edit"
                  icon={<FaEdit />}
                  onClick={() => {
                    setUpdatedTask(todo);
                    setEditMode(true);
                  }}
                />
                <IconButton
                  aria-label="Delete"
                  icon={<FaTrashAlt />}
                  colorScheme="red"
                  onClick={() => handleDelete(todo.id)}
                />
              </HStack>
            </Flex>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default TodoList;
