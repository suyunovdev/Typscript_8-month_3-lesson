import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Modal, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: number;
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
    id: 0,
    name: "",
    lastname: "",
    group: "",
    level: 0,
  });
  const [searchName, setSearchName] = useState("");
  const [searchLastname, setSearchLastname] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  //   const [selectedLevel, setSelectedLevel] = useState<number | "">("");

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
      setGroups(response.data.map((group: { name: string }) => group.name));
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Guruhlarni olishda xatolik");
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await axios.get("http://localhost:3001/levels");
      setLevels(response.data.map((level: { value: number }) => level.value));
    } catch (error) {
      console.error("Error fetching levels:", error);
      toast.error("Darajalarni olishda xatolik");
    }
  };

  const handleShow = (user: User | null) => {
    setSelectedUser(user);
    setFormData(user ?? { id: 0, name: "", lastname: "", group: "", level: 0 });
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedUser(null);
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
    if (
      !formData.name ||
      !formData.lastname ||
      !formData.group ||
      !formData.level
    ) {
      toast.error("Barcha maydonlarni to'ldiring!");
      return;
    }

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

  const handleSearchNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
  };

  const handleSearchLastnameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchLastname(e.target.value);
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGroup(e.target.value);
  };

  //   const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //     setSelectedLevel(e.target.value ? Number(e.target.value) : "");
  //   };

  const filteredUsers = users.filter(user => {
    return (
      (!searchName ||
        user.name.toLowerCase().includes(searchName.toLowerCase())) &&
      (!searchLastname ||
        user.lastname.toLowerCase().includes(searchLastname.toLowerCase())) &&
      (!selectedGroup || user.group === selectedGroup)
    );
  });

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Ism bo'yicha qidirish"
            value={searchName}
            onChange={handleSearchNameChange}
          />
        </Col>
        <Col>
          <Form.Control
            type="text"
            placeholder="Familiya bo'yicha qidirish"
            value={searchLastname}
            onChange={handleSearchLastnameChange}
          />
        </Col>
        <Col>
          <Form.Control
            as="select"
            value={selectedGroup}
            onChange={handleGroupChange}>
            <option value="">Guruhni tanlang</option>
            {groups.length > 0 ? (
              groups.map((group, index) => (
                <option key={index} value={group}>
                  {group}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Guruhlar mavjud emas
              </option>
            )}
          </Form.Control>
        </Col>
        {/* <Col>
          <Form.Control
            as="select"
            value={selectedLevel}
            onChange={handleLevelChange}>
            <option value="">Darajani tanlang</option>
            {levels.length > 0 ? (
              levels.map((level, index) => (
                <option key={index} value={level}>
                  {level}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Darajalar mavjud emas
              </option>
            )}
          </Form.Control>
        </Col> */}
      </Row>

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
          {filteredUsers.map(user => (
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
                  setFormData({ ...formData, level: Number(e.target.value) })
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
              Yopish
            </Button>
            <Button variant="primary" type="submit">
              {selectedUser ? "Yangilash" : "Qo‘shish"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default StudentTable;
