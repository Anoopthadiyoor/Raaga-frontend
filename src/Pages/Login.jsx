import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import apiServices from '../Services/apiServices';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {

    e.preventDefault();

    setIsSubmitting(true);
    setLoginError('');

    try {

        const response = await apiServices(
            'GET',
            `/users?email=${email.trim()}&password=${password}`
        );

        if (response.data.length === 0) {
            setLoginError('Invalid email or password.');
            return;
        }

        const user = response.data[0];

        localStorage.setItem('user', JSON.stringify(user));

        navigate('/home');

    } catch (error) {

        console.log(error);

        setLoginError('Unable to sign in. Please try again.');

    } finally {

        setIsSubmitting(false);

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
                            Sign In
                        </h2>

                        {loginError && (
                            <Alert variant="danger" role="alert">
                                {loginError}
                            </Alert>
                        )}

                        <Form onSubmit={handleLogin}>

                            <Form.Group className="mb-3">
                                <Form.Label></Form.Label>

                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label></Form.Label>

                                <Form.Control
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button
                                variant="danger"
                                type="submit"
                                className="w-100"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </Button>

                        </Form>

                        <div className="text-center mt-4">

                            <p className="text-secondary mb-2">
                                Don't have an account?
                            </p>

                            <Link
                                to="/register"
                                className="text-danger text-decoration-none"
                            >
                                Sign Up
                            </Link>

                        </div>

                        <div className="text-center mt-3 pt-3 border-top border-secondary">

                            <span className="text-secondary">
                                Are you an admin?{' '}
                            </span>

                            <Link
                                to="/admin-login"
                                className="text-danger text-decoration-none"
                            >
                                Admin Login
                            </Link>

                        </div>

                    </Card.Body>

                </Card>

            </Container>

        </div>
    );
}

export default Login;