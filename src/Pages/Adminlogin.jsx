import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

function AdminLogin() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (username === 'admin' && password === 'thadiyoor') {
            navigate('/admin-dashboard');
        } else {
            alert('Invalid admin username or password');
        }
    };

    return (
        <div className="bg-black min-vh-100 text-white">

            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: '100vh' }}
            >

                <Card
                    className="bg-dark text-white border-secondary"
                    style={{ width: '400px' }}
                >

                    <Card.Body className="p-4">

                        <h1 className="text-center fw-bold fs-2 mb-3">
                            Raaga <span className="text-danger">♪</span>
                        </h1>

                        <h2 className="text-center fw-bold fs-5 mb-4">
                            Admin Login
                        </h2>

                        <Form onSubmit={handleLogin}>

                            <Form.Group className="mb-3">
                                <Form.Label></Form.Label>

                                <Form.Control
                                    type="text"
                                    placeholder="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label></Form.Label>

                                <Form.Control
                                    type="password"
                                    placeholder="Enter admin password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>

                            <Button
                                variant="danger"
                                type="submit"
                                className="w-100"
                            >
                                Login
                            </Button>

                        </Form>

                        <div className="text-center mt-4">

                            <Link
                                to="/login"
                                className="text-secondary text-decoration-none"
                            >
                                Back to User Login
                            </Link>

                        </div>

                    </Card.Body>

                </Card>

            </Container>

        </div>
    );
}

export default AdminLogin;