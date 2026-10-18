import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import apiServices from '../Services/apiServices';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {

        const userResponse = await apiServices('POST', '/users', { name, email, password });
        const newUser = userResponse.data;
    
        await apiServices('POST', '/playlists', {  userId: newUser.id, name: 'Liked Songs', songIds: []  });

        navigate('/login');

    } catch (error) {

        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');

    } finally {

        setIsSubmitting(false);

    }
};
    
    return (
        <div className="bg-black min-vh-100 text-white">
            <Container className="d-flex justify-content-center align-items-center"style={{ minHeight: '100vh' }} >
                <Card  className="bg-dark text-white border-secondary"    style={{ width: '400px' }}>
                    <Card.Body className="p-4">
                        <h1 className="text-center fw-bold fs-2 mb-3"> Raaga <span className="text-danger">♪</span> </h1>
                        <h2 className="text-center fw-bold fs-5 mb-4">  Sign Up </h2>
                        <Form onSubmit={handleRegister}>
                            <Form.Group className="mb-3">
                                <Form.Label required></Form.Label>
                                <Form.Control  type="text"  placeholder="Enter your name"  value={name}  onChange={(e) => setName(e.target.value)}required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label></Form.Label>
                                <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    required/>
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password"  placeholder="Create a password" value={password}  onChange={(e) => setPassword(e.target.value)}  required />
                            </Form.Group>
                            <Button  variant="danger"  type="submit"   className="w-100" disabled={isSubmitting} >  {isSubmitting ? 'Creating account...' : 'Sign Up'}
                            </Button>
                        </Form>
                        <div className="text-center mt-4">
                            <span className="text-secondary"> Already have an account?{' '} </span>
                            <Link  to="/login" className="text-danger text-decoration-none" >   Sign In </Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}
export default Register;