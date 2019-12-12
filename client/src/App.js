import React from "react";
import "./App.css";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";
import {
    GET_TODOS,
    ADD_TODO,
    UPDATE_TODO,
    TOGGLE_TODO,
    DELETE_TODO
} from "./TodoQueries.js";
import { Button, Checkbox, TextField, Container, ButtonGroup } from "@material-ui/core";

const client = new ApolloClient();

// Lists the todos and their respective controlling structures
// Called from the app function
function Todos() {
    // Declare and define needed queries and manipulations
    const { loading, error, data } = useQuery(GET_TODOS);
    const [deleteTodo] = useMutation(DELETE_TODO, {
        update(cache, { data: { deleteTodo } }) {
            const { todos } = client.readQuery({ query: GET_TODOS });
            client.writeQuery({
                query: GET_TODOS,
                data: {
                    todos: todos.filter(todo => {
                        if (todo.id !== deleteTodo.todo.id) return true;
                        else return false;
                    })
                }
            });
        }
    });
    const [updateTodo] = useMutation(UPDATE_TODO);
    const [toggleTodo] = useMutation(TOGGLE_TODO);

    // Catch loading and error on query
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    // map queries data to JSX
    return data.todos.map(({ id, text, completed }) => {
        return (
            <form
                className="todo"
                key={"todo-" + id}
                onSubmit={e => {
                    e.preventDefault();
                    updateTodo({
                        variables: {
                            id,
                            text: e.currentTarget.elements.updateTodo.value
                        }
                    });
                }}
            >
                <div>
                    <ButtonGroup size="large">
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                        <Button variant="contained" type="reset">
                            Reset
                        </Button>
                        <Button
                            color="secondary"
                            variant="contained"
                            type="reset"
                            onClick={() => {
                                deleteTodo({ variables: { id: id } });
                            }}
                        >
                            Delete
                        </Button>
                    </ButtonGroup>
                </div>
                <div>
                    <Checkbox
                        checked={completed}
                        onChange={e => {
                            e.preventDefault();
                            toggleTodo({ variables: { id } });
                        }}
                    />
                    <TextField
                        variant="outlined"
                        size="small"
                        className={completed ? "text-strike" : null}
                        type="text"
                        defaultValue={text}
                        name="updateTodo"
                        autoComplete="off"
                    />

                </div>
            </form>
        );
    });
}

// Created the react component to add a new todo
// Called from the app function
function AddTodo() {
    // Declare and define needed manipulation
    const [addTodo] = useMutation(ADD_TODO, {
        update(cache, { data: { addTodo } }) {
            const { todos } = client.readQuery({ query: GET_TODOS });
            client.writeQuery({
                query: GET_TODOS,
                data: { todos: todos.concat([addTodo.todo]) }
            });
        }
    });

    // map to JSX
    return (
        <div>
            <div className="header">
                <h2>
                    A Todolist in the eNeRGy stack.{" "}
                    <span aria-label="rocket-emoji" role="img">
                        🚀
                    </span>
                </h2>
                <p>Node.js, React.js and GraphQL</p>
            </div>
            <form
                className="addTodo"
                onSubmit={e => {
                    e.preventDefault();
                    addTodo({
                        variables: {
                            text: e.currentTarget.elements.newTodo.value
                        }
                    });
                }}
            >
                <TextField
                    id="newTodo"
                    label="A new task"
                    required
                    type="text"
                    name="newTodo"
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                /> {' '}
                <Button size="large" variant="contained" type="submit" color="primary">
                    Submit
                </Button>
            </form>
        </div>
    );
}

// The app that uses an apollo provider and the above AddTodo and
// Todo components
const App = () => {
    return (
        <ApolloProvider client={client}>
            <Container maxWidth="sm">
                <AddTodo />
                <Todos />
            </Container>
        </ApolloProvider>
    );
};

export default App;
