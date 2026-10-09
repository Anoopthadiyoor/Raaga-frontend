import React, { useEffect, useState } from 'react';
import {  Badge, Button, Card,  Container, Spinner} from 'react-bootstrap';
import SongCard from '../Components/SongCard';
import Header from '../Components/Header';
import BottomNavigation from '../Components/BottomNavigation';
import apiServices from '../Services/apiServices';
import { FiArrowDown, FiMusic,   FiCheck} from 'react-icons/fi';

function Explore() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedArtist, setSelectedArtist] = useState('');
    // Get songs
    useEffect(() => {
        apiServices('GET', '/songs') .then((response) => {setSongs(response.data); setLoading(false);
            }) .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);
    // Get unique values

    const getUniqueValues = (values) => {
        const uniqueValues = [];
        const seenValues = new Set();
        values.forEach((value) => {
            if (!value) {
                return;
            }
            const cleanValue = String(value).trim();
            if (!cleanValue) {
                return;
            }
            const normalizedValue =
                cleanValue.toLowerCase();
            if (!seenValues.has(normalizedValue)) {
                seenValues.add(normalizedValue);
                uniqueValues.push(cleanValue);
            }
        });
        return uniqueValues;
    };
    // Unique genres
    const genres = getUniqueValues(
        songs.map((song) => song.genre)
    );
    // Unique languages
    const languages = getUniqueValues(
        songs.map((song) => song.language)
    );
    // Unique artists

    const artists = getUniqueValues(
        songs.flatMap((song) => [song.artist,...(song.featuredArtists || []) ])
    );

    const featuredSong =
        songs.find((song) => song.coverUrl);
    // Filter songs
    const filteredSongs = songs.filter((song) => {
        const genreMatch =  !selectedGenre ||  song.genre?.toLowerCase() ===   selectedGenre.toLowerCase();
        const languageMatch =  !selectedLanguage ||  song.language?.toLowerCase() ===   selectedLanguage.toLowerCase();
        const artistMatch =  !selectedArtist ||  song.artist?.toLowerCase() ===  selectedArtist.toLowerCase() || song.featuredArtists?.some(
                (artist) =>    artist?.toLowerCase() ===  selectedArtist.toLowerCase()
            );
        return ( genreMatch &&  languageMatch &&  artistMatch  );
    });
    // Clear filters
    const clearFilters = () => {
        setSelectedGenre('');
        setSelectedLanguage('');
        setSelectedArtist('');

    };
    // Loading
    if (loading) {
        return (
            <>
                <Header />
                <div className="bg-black text-white text-center pt-5"  style={{   minHeight: '80vh'  }} >

                    <Spinner
                        animation="border"
                        variant="danger"
                    />
                    <p className="text-secondary mt-3">
                        Finding your next favorite
                    </p>
                </div>
                <BottomNavigation />
            </>
        );
    }
    return (
        <div className="bg-black text-white" style={{   minHeight: '100vh'  }}  >

            <Header />
            <Container
                className="pt-4"
                style={{
                    paddingBottom: '220px'
                }}
            >
                {/* HERO SECTION */}

                <section
                    className="p-4 p-md-5 mb-5 rounded-4 border overflow-hidden"

                    style={{
                        background:
                            'linear-gradient(115deg, rgba(36, 36, 36, 0.88), rgba(18, 18, 18, 0.72) 62%, rgba(76, 20, 27, 0.78))',

                        borderColor:
                            'rgba(255, 255, 255, 0.14)',

                        backdropFilter:
                            'blur(18px)',

                        WebkitBackdropFilter:
                            'blur(18px)',

                        boxShadow:
                            '0 18px 50px rgba(0, 0, 0, 0.28)'
                    }} >
                    <div
                        className="row align-items-center g-4" >
                        <div className="col">
                            <h1 className="display-5 fw-bold mb-3">
                                Explore music
                            </h1>
                            <p className="text-secondary mb-4">
                                Discover music by genre,
                                language, and the artists
                                you love.
                            </p>
                            <Button
                                variant="danger"
                                href="#discovery"
                                className="rounded-3 px-3" >
                                Tune your discovery
                                <FiArrowDown
                                    className="ms-2"
                                    aria-hidden="true"  />
                            </Button>

                        </div>

                        <div className="col-auto d-none d-sm-block">
                            <div
                                className="d-flex align-items-center justify-content-center rounded-4 overflow-hidden"
                                style={{
                                    width:
                                        'clamp(96px, 22vw, 176px)',

                                    aspectRatio: '1',

                                    background:
                                        'rgba(255, 255, 255, 0.06)',

                                    border:
                                        '1px solid rgba(255, 255, 255, 0.14)',

                                    backdropFilter:
                                        'blur(12px)',

                                    WebkitBackdropFilter:
                                        'blur(12px)'
                                }}
                            >

                                {featuredSong?.coverUrl ? (

                                    <img
                                        src={
                                            featuredSong.coverUrl
                                        }

                                        alt={
                                            featuredSong.title
                                        }

                                        className="w-100 h-100 object-fit-cover"
                                    />

                                ) : (

                                    <FiMusic
                                        size={48}
                                        className="text-danger"
                                        aria-hidden="true"
                                    />

                                )}

                            </div>

                        </div>

                    </div>

                </section>

                <Card
                    id="discovery"

                    className="mb-5 text-white border rounded-4 overflow-hidden"

                    style={{
                        background:
                            'rgba(255, 255, 255, 0.055)',

                        borderColor:
                            'rgba(255, 255, 255, 0.16)',

                        backdropFilter:
                            'blur(24px)',

                        WebkitBackdropFilter:
                            'blur(24px)',

                        boxShadow:
                            '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px rgba(255, 255, 255, 0.12)'
                    }}
                >

                    <Card.Body
                        className="p-3 p-md-4"
                    >


                        {/* SECTION HEADER */}

                        <div
                            className="d-flex justify-content-between align-items-start mb-4"
                        >

                            <div>

                                <p
                                    className="text-danger fw-bold text-uppercase mb-1"
                                    style={{
                                        fontSize: '11px',
                                        letterSpacing: '1.5px'
                                    }}
                                >
                                    Curated for your mood
                                </p>

                                <h2 className="h4 fw-bold mb-1">
                                    Tune your discovery
                                </h2>

                                <p className="text-white-50 small mb-0">
                                    Pick a vibe and shape your
                                    music feed.
                                </p>

                            </div>


                            {/* CLEAR FILTERS */}

                            {(selectedGenre ||
                                selectedLanguage ||
                                selectedArtist) && (

                                <Button
                                    variant="link"
                                    className="text-white-50 text-decoration-none p-0"
                                    size="sm"
                                    onClick={
                                        clearFilters
                                    }
                                >
                                    Clear
                                </Button>

                            )}

                        </div>


                        {/* GENRES */}

                        <div className="mb-4">

                            <p
                                className="small text-white-50 fw-semibold mb-2"
                            >
                                Genres
                            </p>

                            <div
                                className="d-flex gap-2 overflow-auto pb-2"
                                style={{
                                    scrollbarWidth: 'none'
                                }}
                            >

                                {genres.map((genre) => {

                                    const isActive =
                                        selectedGenre ===
                                        genre;

                                    return (

                                        <Button
                                            key={genre}
                                            type="button"
                                            size="sm"

                                            className="text-nowrap rounded-pill px-3"

                                            style={{
                                                flexShrink: 0,

                                                color: isActive
                                                    ? '#ffffff'
                                                    : 'rgba(255, 255, 255, 0.82)',

                                                background:
                                                    isActive
                                                        ? 'rgba(220, 53, 69, 0.72)'
                                                        : 'rgba(255, 255, 255, 0.09)',

                                                border:
                                                    isActive
                                                        ? '1px solid rgba(255, 255, 255, 0.22)'
                                                        : '1px solid rgba(255, 255, 255, 0.16)',

                                                backdropFilter:
                                                    'blur(14px)',

                                                WebkitBackdropFilter:
                                                    'blur(14px)',

                                                boxShadow:
                                                    isActive
                                                        ? '0 5px 20px rgba(220, 53, 69, 0.18)'
                                                        : 'inset 0 1px rgba(255, 255, 255, 0.08)',

                                                transition:
                                                    'all 0.2s ease'
                                            }}

                                            onClick={() =>
                                                setSelectedGenre(
                                                    isActive
                                                        ? ''
                                                        : genre
                                                )
                                            }
                                        >
                                            {isActive && (
                                                <FiCheck
                                                    size={13}
                                                    className="me-1"
                                                />
                                            )}
                                            {genre}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                        {/* LANGUAGES */}
                        <div className="mb-4">
                            <p
                                className="small text-white-50 fw-semibold mb-2"
                            >
                                Languages
                            </p>
                            <div
                                className="d-flex gap-2 overflow-auto pb-2"
                                style={{
                                    scrollbarWidth: 'none'
                                }}
                            >
                                {languages.map((language) => {
                                    const isActive =
                                        selectedLanguage ===
                                        language;
                                    return (
                                        <Button
                                            key={language}
                                            type="button"
                                            size="sm"
                                            className="text-nowrap rounded-pill px-3"
                                            style={{
                                                flexShrink: 0,
                                                color: isActive
                                                    ? '#ffffff'
                                                    : 'rgba(255, 255, 255, 0.82)',
                                                background:
                                                    isActive
                                                        ? 'rgba(220, 53, 69, 0.72)'
                                                        : 'rgba(255, 255, 255, 0.09)',
                                                border:
                                                    isActive
                                                        ? '1px solid rgba(255, 255, 255, 0.22)'
                                                        : '1px solid rgba(255, 255, 255, 0.16)',
                                                backdropFilter:
                                                    'blur(14px)',
                                                WebkitBackdropFilter:
                                                    'blur(14px)',
                                                boxShadow:
                                                    isActive
                                                        ? '0 5px 20px rgba(220, 53, 69, 0.18)'
                                                        : 'inset 0 1px rgba(255, 255, 255, 0.08)',
                                                transition:
                                                    'all 0.2s ease'
                                            }}
                                            onClick={() =>
                                                setSelectedLanguage(
                                                    isActive
                                                        ? ''
                                                        : language
                                                )
                                            }
                                        >
                                            {isActive && (
                                                <FiCheck
                                                    size={13}
                                                    className="me-1"
                                                />
                                            )}
                                            {language}

                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                        {/* ARTISTS */}
                        <div>
                            <p
                                className="small text-white-50 fw-semibold mb-2"
                            >
                                Artists
                            </p>

                            <div
                                className="d-flex gap-2 overflow-auto pb-2"
                                style={{
                                    scrollbarWidth: 'none'
                                }}
                            >

                                {artists.map((artist) => {

                                    const isActive =
                                        selectedArtist ===
                                        artist;

                                    return (

                                        <Button key={artist}
                                            type="button"
                                            size="sm"
                                            className="text-nowrap rounded-pill px-3"

                                            style={{ flexShrink: 0,   color: isActive    ? '#ffffff'   : 'rgba(255, 255, 255, 0.82)',
                                                background:    isActive  ? 'rgba(220, 53, 69, 0.72)'   : 'rgba(255, 255, 255, 0.09)',
                                                border: isActive   ? '1px solid rgba(255, 255, 255, 0.22)'   : '1px solid rgba(255, 255, 255, 0.16)',
                                                backdropFilter: 'blur(14px)',
                                                WebkitBackdropFilter: 'blur(14px)',
                                                boxShadow:isActive  ? '0 5px 20px rgba(220, 53, 69, 0.18)'
                                                        : 'inset 0 1px rgba(255, 255, 255, 0.08)',

                                                transition:
                                                    'all 0.2s ease'
                                            }}

                                            onClick={() =>
                                                setSelectedArtist(
                                                    isActive
                                                        ? ''
                                                        : artist
                                                )
                                            }
                                        >

                                            {isActive && (
                                                <FiCheck
                                                    size={13}
                                                    className="me-1"
                                                />
                                            )}

                                            {artist}

                                        </Button>

                                    );

                                })}

                            </div>

                        </div>

                    </Card.Body>

                </Card>

                {/* FILTERED SONGS */}
                {(selectedGenre ||
                    selectedLanguage ||
                    selectedArtist) && (
                    <section className="mb-5">
                        <div
                            className="d-flex justify-content-between align-items-end border-bottom border-secondary pb-3 mb-3"
                        >
                            <div>
                                <h2 className="h3 fw-bold mb-0">
                                    Filtered songs
                                </h2>
                            </div>
                            <Badge
                                bg="danger"
                                className="rounded-2 px-2 py-2"
                            >

                                {filteredSongs.length}{' '}

                                {filteredSongs.length === 1
                                    ? 'track'
                                    : 'tracks'}

                            </Badge>
                        </div>
                        {filteredSongs.length === 0 ? (
                            <p className="text-secondary py-3">
                                No songs match these filters.
                                Try another combination.
                            </p>

                        ) : (

                            <div  className="d-flex flex-column gap-2" >
                                {filteredSongs.map((song) => (   <SongCard  key={song.id}  song={song} /> ))}
                            </div>
                        )}
                    </section>
                )}
            </Container>
            <BottomNavigation />
        </div>
    );
}
export default Explore;