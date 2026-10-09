import React, { useEffect, useState } from 'react';
import {  Container, Row,Col,Card,Button,Table,Spinner  }from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import apiServices from '../Services/apiServices';

function AdminDashboard() {

    const navigate = useNavigate();
    const [songs, setSongs] = useState([]);
    const [users, setUsers] = useState([]);
    const [showSongs, setShowSongs] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
    const [loadingSongs, setLoadingSongs] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Fetch songs
    const fetchSongs = async () => {
        setLoadingSongs(true);
        try {
            const response = await apiServices('GET',  '/songs' );
            setSongs(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingSongs(false);
        }
    };
    // Fetch users
    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await apiServices( 'GET', '/users'  );
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingUsers(false);
        }
    };
    // Load data when page opens
    useEffect(() => {
        fetchSongs();
        fetchUsers();
    }, []);
    // Show / hide songs
    const handleViewSongs = () => {
        setShowSongs(!showSongs);
        if (!showSongs) {
            fetchSongs();
        }
    };
    // Show / hide users
    const handleViewUsers = () => {
  setShowUsers(!showUsers);
        if (!showUsers) {
            fetchUsers();
        }
    };
    // Delete song
    const handleDeleteSong = async (songId) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this song?'
        );
        if (!confirmDelete) {
            return;
        }
        try {
            await apiServices(  'DELETE',  `/songs/${songId}`  );
            setSongs((currentSongs) => currentSongs.filter(
                    (song) => Number(song.id) !== Number(songId)
                )
            );
        } catch (error) {
            console.log(error);
            alert('Failed to delete the song.');
        }
    };
    // Admin logout
    const handleLogout = () => {
        localStorage.removeItem('admin');
        navigate('/admin-login');
    };
    return (
        <div className="bg-black text-white min-vh-100" style={{    background: 'linear-gradient(135deg, #000000 0%, #090909 50%, #120000 100%)'  }}  >
            {/* Header */}
            <header className="py-3">
                <Container>
                    <div className="d-flex justify-content-between align-items-center">
                        <h1 className="text-white fw-bold fs-3 mb-0"> Raaga <span className="text-danger">♪</span> </h1>
                        <Button variant="danger" onClick={handleLogout} >  Logout </Button>
                    </div>
                </Container>
            </header>
            <Container className="py-4">
                {/* Page heading */}
                <div className="mb-4">
                    <h2 className="fw-bold mb-1">
                        Admin Dashboard
                    </h2>
                    <p className="text-secondary mb-0">
                        Manage your music library
                    </p>
                </div>
                {/* Statistics */}
                <Row className="g-3">
                    {/* Total Songs */}
                    <Col md={6}>
                        <Card className="text-white border-0 h-100" style={{  background: 'rgba(255, 255, 255, 0.08)',  backdropFilter: 'blur(14px)',  WebkitBackdropFilter: 'blur(14px)',   border: '1px solid rgba(255, 255, 255, 0.15)',  borderRadius: '16px',  boxShadow:'0 8px 32px rgba(0, 0, 0, 0.35)' }} >
                            <Card.Body>
                                <h6 className="text-secondary"> Total Songs </h6>
                                <h2 className="mb-0">  {songs.length} </h2>
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* Total Users */}
                    <Col md={6}><Card    className="text-white border-0 h-100"
                            style={{   background: 'rgba(255, 255, 255, 0.08)',   backdropFilter: 'blur(14px)',   WebkitBackdropFilter: 'blur(14px)',
                           border:   '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '16px', boxShadow:   '0 8px 32px rgba(0, 0, 0, 0.35)' }} >
                            <Card.Body>
                                <h6 className="text-secondary"> Total Users </h6>
                                <h2 className="mb-0">
                                    {users.length}
                                </h2>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                {/* Songs heading + buttons */}
                <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
                    <h4 className="mb-0">    </h4>
                    <div className="d-flex gap-2 flex-wrap">
                        <Button variant="outline-light" onClick={handleViewSongs} >
                            {showSongs
                                ? 'Hide Songs'
                                : 'View All Songs'}
                        </Button>
                        <Button  variant="outline-light" onClick={handleViewUsers} >
                            {showUsers ? 'Hide Users' : 'View All Users'}
                        </Button>
                        <Button  variant="danger"  onClick={() =>      navigate('/admin/add-song')
                            }>
                            + Add Song
                        </Button>
                    </div>
                </div>
                {/* Songs table */}
                {showSongs && (
                    <Card
                        className="text-white border-0 mb-4"
                        style={{
                            background:
                                'rgba(255, 255, 255, 0.07)',
                            backdropFilter: 'blur(14px)',
                            WebkitBackdropFilter: 'blur(14px)',
                            border:
                                '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '16px',
                            boxShadow:
                                '0 8px 32px rgba(0, 0, 0, 0.35)'
                        }}>
                        <Card.Body>
                            <h5 className="mb-3"> All Songs  </h5>
                            {loadingSongs ? (
                                <div className="text-center py-4">
                                    <Spinner
                                        animation="border"
                                        variant="danger"
                                    />
                                </div>
                            ) : songs.length === 0 ? (
                                <p className="text-secondary mb-0">
                                    No songs available.
                                </p>
                            ) : (
                                <div className="table-responsive">
                                    <Table  variant="dark"  hover  className="mb-0 align-middle"
                                    >
                                        <thead>
                                            <tr>
                                                <th className="text-danger"> Name</th>
                                                <th className="text-danger">
                                                    Artist
                                                </th>
                                                <th className="text-danger">
                                                    Movie
                                                </th>
                                                <th className="text-danger">
                                                    Year
                                                </th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {songs.map((song) => (
                                                <tr key={song.id}>
                                                    <td>{song.title} </td>
                                                    <td> {song.artist} </td>
                                                    <td>
                                                        {song.movie}
                                                    </td>
                                                    <td>
                                                        {song.releaseYear}
                                                    </td>
                                                    <td className="text-center">
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDeleteSong(
                                                                    song.id
                                                                )
                                                            }
                                                        >  Delete  </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                )}
                {/* Users table */}

                {showUsers && (

                    <Card
                        className="text-white border-0 mb-4"
                        style={{
                            background:
                                'rgba(255, 255, 255, 0.07)',
                            backdropFilter: 'blur(14px)',
                            WebkitBackdropFilter: 'blur(14px)',
                            border:
                                '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '16px',
                            boxShadow:
                                '0 8px 32px rgba(0, 0, 0, 0.35)'
                        }}
                    >
                        <Card.Body>

                            <h5 className="mb-3">
                                All Users
                            </h5>
                            {loadingUsers ? (
                                <div className="text-center py-4">

                                    <Spinner
                                        animation="border"
                                        variant="danger"
                                    />
                                </div>
                            ) : users.length === 0 ? (

                                <p className="text-secondary mb-0">
                                    No users available.
                                </p>

                            ) : (

                                <div className="table-responsive">

                                    <Table
                                        variant="dark"
                                        hover
                                        className="mb-0 align-middle"
                                    >
                                        <thead>

                                            <tr>

                                                <th className="text-danger">
                                                    Username
                                                </th>

                                                <th className="text-danger">
                                                    Email
                                                </th>

                                            </tr>

                                        </thead>
                                        <tbody>

                                            {users.map((user) => (

                                                <tr key={user.id}>

                                                    <td>
                                                        {user.name}
                                                    </td>

                                                    <td>
                                                        {user.email}
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                )}
            </Container>
        </div>
    );
}
export default AdminDashboard;