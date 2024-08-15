import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";

interface User {
  id: number;
  name: string;
  lastname: string;
  group: string;
  level: number;
}

const StudentTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    group: "",
    level: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleShow = (user: User | null) => {
    setSelectedUser(user);
    setFormData(
      user ? { ...user } : { name: "", lastname: "", group: "", level: 0 }
    );
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await axios.put(
          `http://localhost:3001/users/${selectedUser.id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3001/users", formData);
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={() => handleShow(null)}>
        Add User
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Lastname</th>
            <th>Group</th>
            <th>Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.lastname}</td>
              <td>{user.group}</td>
              <td>{user.level}</td>
              <td>
                <Button variant="warning" onClick={() => handleShow(user)}>
                  Edit
                </Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedUser ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formLastname">
              <Form.Label>Lastname</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter lastname"
                value={formData.lastname}
                onChange={e =>
                  setFormData({ ...formData, lastname: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formGroup">
              <Form.Label>Group</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter group"
                value={formData.group}
                onChange={e =>
                  setFormData({ ...formData, group: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formLevel">
              <Form.Label>Level</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter level"
                value={formData.level}
                onChange={e =>
                  setFormData({ ...formData, level: parseInt(e.target.value) })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentTable;
