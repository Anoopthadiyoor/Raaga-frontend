import React, { useEffect, useState } from 'react';
import { Container, Form, InputGroup, Spinner } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import SongCard from '../Components/SongCard';
import Header from '../Components/Header';
import BottomNavigation from '../Components/BottomNavigation';
import apiServices from '../Services/apiServices';

function Search() {

    const [songs, setSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => { apiServices('GET', '/songs')   .then((response) => {  setSongs(response.data);
                setLoading(false);
            })
            .catch((error) => {  console.log(error);   setLoading(false);

            });
    }, []);
    const filteredSongs = songs.filter((song) => {
        const search = searchTerm.toLowerCase().trim();
        if (!search) {
            return false;
        }
        return (
            song.title?.toLowerCase().includes(search) || song.artist?.toLowerCase().includes(search) ||  song.album?.toLowerCase().includes(search) ||  song.movie?.toLowerCase().includes(search) ||  song.genre?.toLowerCase().includes(search) ||  song.language?.toLowerCase().includes(search) || song.composer?.toLowerCase().includes(search) ||song.lyricist?.toLowerCase().includes(search) || song.featuredArtists?.some((artist) =>  artist.toLowerCase().includes(search)   )
        );
    });
    if (loading) {

        return (
            <>
                <Header />
                <div
                    className="text-white text-center mt-5"
                    style={{ minHeight: '70vh' }} >
                    <Spinner animation="border" variant="danger" />
                </div>
                <BottomNavigation />
            </>
        );

    }
    return (
        <div
            className="bg-black text-white"
            style={{ minHeight: '100vh' }} >
            <Header />
            <Container className="pt-4" style={{ paddingBottom: '220px' }}>
                <div className="mb-4">
                    <p className="text-danger fw-bold text-uppercase mb-1">Find your sound</p>
                    <h1 className="h2 fw-bold mb-3">Search music</h1>
                    <InputGroup
                        className="rounded-3 overflow-hidden"
                        style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(16px)',   WebkitBackdropFilter: 'blur(16px)',   boxShadow: '0 12px 32px rgba(0, 0, 0, 0.22)'   }} >
                        <InputGroup.Text className="border-0 text-danger px-3" style={{ background: 'transparent' }}>  <FiSearch size={20} aria-hidden="true" /> </InputGroup.Text>
                        <Form.Control type="text" placeholder="Songs, artists, albums..."  aria-label="Search songs, artists, albums, movies, or genres"   value={searchTerm}  onChange={(event) => setSearchTerm(event.target.value)}   className="border-0 py-3 text-white shadow-none"  style={{ background: 'transparent', color: 'white' }} />
                    </InputGroup>
                </div>

                {searchTerm && filteredSongs.length === 0 && (
                    <p className="text-white-50">   No songs found. </p>
                )}
                {!searchTerm && ( <p className="text-white-50"> Search for a song, artist, album, movie or genre. </p>)}
                <div className="d-flex flex-column gap-2">
                    {filteredSongs.map((song) => (
                        <SongCard  key={song.id} song={song}  />
                    ))}
                </div>
            </Container>
            <BottomNavigation />
        </div>
    );
}
export default Search;