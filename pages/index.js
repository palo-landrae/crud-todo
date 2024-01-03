import React, { useState, useEffect } from "react";
import TodoList from "../components/TodoList";
import {
  Box,
  Center,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:3001/todos");
      const data = await response.json();
      setTodos(data.todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/todos/${id}`, {
        method: "DELETE",
      });
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleUpdate = async (params) => {
    try {
      await fetch(`http://localhost:3001/todos/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: params.task }),
      });
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleAddTodo = async () => {
    try {
      await fetch("http://localhost:3001/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: newTask }),
      });
      fetchTodos();
      setNewTask("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  return (
    <Center p={5}>
      <Box>
        <VStack>
          <Text fontSize="4xl">TODO List</Text>
          <HStack>
            <Input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task"
            />
            <IconButton
              icon={<FaPlus />}
              onClick={handleAddTodo}
              colorScheme="blue"
            />
          </HStack>
          <TodoList
            todos={todos}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </VStack>
      </Box>
    </Center>
  );
};

export default Home;
