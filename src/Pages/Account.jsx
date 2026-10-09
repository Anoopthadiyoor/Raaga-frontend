import { Button, Card, Container } from 'react-bootstrap';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import BottomNavigation from '../Components/BottomNavigation';
import React, { useContext } from 'react';
import { PlayerContext } from '../Context/PlayerContext';

function Account() {

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const { closePlayer } = useContext(PlayerContext);

const handleLogout = () => {
    closePlayer();
    localStorage.removeItem('user');
    navigate('/login');
};

    if (!user) {
        return (
            <>
                <Header />

                <div
                    className="bg-black text-white d-flex justify-content-center align-items-center"
                    style={{ minHeight: '80vh', paddingBottom: '220px' }}
                >
                    <Card
                        className="text-white border-0 text-center p-4"
                        style={{
                            width: '350px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            borderRadius: '20px'
                        }}
                    >
                        <h4 className="mb-3">
                            You are not logged in
                        </h4>

                        <Button
                            variant="danger"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Button>
                    </Card>
                </div>

                <BottomNavigation />
            </>
        );
    }


    return (
        <div
            className="bg-black text-white"
            style={{ minHeight: '100vh' }}
        >

            <Header />

            <Container
                className="pt-4"
                style={{ paddingBottom: '220px' }}
            >

                <div className="text-center mb-4">
                    <p className="text-danger fw-bold text-uppercase mb-1">Profile</p>
                    <h1 className="h2 fw-bold mb-0">Account Details</h1>
                </div>

                <Card
                    className="text-white border mx-auto"
                    style={{
                        width: 'min(100%, 420px)',
                        aspectRatio: '1 / 1',
                        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.055) 64%, rgba(220, 53, 69, 0.11))',
                        borderColor: 'rgba(255, 255, 255, 0.22)',
                        backdropFilter: 'blur(18px)',
                        WebkitBackdropFilter: 'blur(18px)',
                        borderRadius: '18px',
                        boxShadow: '0 18px 48px rgba(0, 0, 0, 0.3), inset 0 1px rgba(255, 255, 255, 0.14)'
                    }}
                >

                    <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-3 p-sm-4">
                        <div className="mb-3">

                            <div
                                className="mx-auto d-flex align-items-center justify-content-center"
                                style={{
                                    width: '68px',
                                    height: '68px',
                                    borderRadius: '50%',
                                    background: 'rgba(220, 53, 69, 0.15)',
                                    border: '1px solid rgba(220, 53, 69, 0.5)',
                                    boxShadow: '0 0 28px rgba(220, 53, 69, 0.12)'
                                }}
                            >
                                <FiUser
                                    size={38}
                                    className="text-danger"
                                />
                            </div>

                        </div>


                        <div className="mb-3">
                            <small className="text-white-50 d-block mb-1">Name</small>
                            <div className="fw-semibold">{user.name}</div>
                        </div>

                        <div className="mb-3 w-100 px-2">
                            <small className="text-white-50 d-block mb-1">Email</small>
                            <div className="fw-semibold text-break">{user.email}</div>
                        </div>

                        <div className="mb-3">
                            <small className="text-white-50 d-block mb-1">Account status</small>
                            <div className="fw-semibold">Active</div>
                        </div>

                        <Button
                            variant="danger"
                            className="px-4 py-2 mt-1 d-inline-flex align-items-center justify-content-center gap-2 rounded-2"
                            onClick={handleLogout}
                        >
                            <FiLogOut size={18} />
                            Logout
                        </Button>
                    </Card.Body>

                </Card>

            </Container>

            <BottomNavigation />

        </div>
    );
}

export default Account;