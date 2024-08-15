import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id?: number;
  name: string;
  lastname: string;
  group: string;
  level: number;
}

const StudentTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [levels, setLevels] = useState<number[]>([]);
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    name: "",
    lastname: "",
    group: "",
    level: 0,
  });

  useEffect(() => {
    fetchUsers();
    fetchGroups();
    fetchLevels();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Foydalanuvchilarni olishda xatolik");
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:3001/groups");
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Guruhlarni olishda xatolik");
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await axios.get("http://localhost:3001/levels");
      setLevels(response.data);
    } catch (error) {
      console.error("Error fetching levels:", error);
      toast.error("Darajalarni olishda xatolik");
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
    const isConfirmed = window.confirm("Ma'lumotni o'chirishni xohlaysizmi?");
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/users/${id}`);
        toast.success("Ma’lumot muvaffaqiyatli o‘chirildi");
        fetchUsers();
      } catch (error) {
        console.error("Ma’lumotni o‘chirishda xatolik yuz berdi:", error);
        toast.error("Ma’lumotni o‘chirishda xatolik");
      }
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
        toast.success("Ma’lumot muvaffaqiyatli yangilandi");
      } else {
        await axios.post("http://localhost:3001/users", formData);
        toast.success("Ma’lumot muvaffaqiyatli qo‘shildi");
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error("Ma’lumotni saqlashda xatolik yuz berdi:", error);
      toast.error("Ma’lumotni saqlashda xatolik");
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={() => handleShow(null)}>
        Foydalanuvchi qo‘shish
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Ismi</th>
            <th>Familiyasi</th>
            <th>Guruh</th>
            <th>Daraja</th>
            <th>Amallar</th>
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
                  Tahrirlash
                </Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                  O‘chirish
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedUser
              ? "Foydalanuvchini tahrirlash"
              : "Foydalanuvchi qo‘shish"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="formName">
              <Form.Label>Ismi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ism kiriting"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formLastname">
              <Form.Label>Familiyasi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Familiya kiriting"
                value={formData.lastname}
                onChange={e =>
                  setFormData({ ...formData, lastname: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formGroup">
              <Form.Label>Guruh</Form.Label>
              <Form.Control
                as="select"
                value={formData.group}
                onChange={e =>
                  setFormData({ ...formData, group: e.target.value })
                }>
                <option value="">Guruhni tanlang</option>
                {groups.map((group, index) => (
                  <option key={index} value={group}>
                    {group}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formLevel">
              <Form.Label>Daraja</Form.Label>
              <Form.Control
                as="select"
                value={formData.level}
                onChange={e =>
                  setFormData({ ...formData, level: parseInt(e.target.value) })
                }>
                <option value="">Darajani tanlang</option>
                {levels.map((level, index) => (
                  <option key={index} value={level}>
                    {level}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              Saqlash
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default StudentTable;
