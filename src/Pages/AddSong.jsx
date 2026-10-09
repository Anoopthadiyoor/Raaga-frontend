import React, { useRef, useState } from 'react';
import { Container, Form, Button, Row, Col, Card} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import apiServices from '../Services/apiServices';

const createEmptySong = () => ({
    title: '',
    artist: '',
    featuredArtists: [],
    movie: '',
    lyricist: '',
    genre: '',
    language: '',
    releaseYear: '',
    duration: '',
    coverUrl: '',
    audioUrl: ''
});

function AddSong() {

    const navigate = useNavigate();
    const formRef = useRef(null);

    const [coverFile, setCoverFile] = useState(null);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [audioFile, setAudioFile] = useState(null);
const [uploadingAudio, setUploadingAudio] = useState(false);

    const [song, setSong] = useState(createEmptySong);

    // Handle normal input fields
    const handleChange = (e) => {

        const { name, value } = e.target;

        setSong({
            ...song,
            [name]: value
        });

    };


    // Upload cover image to Cloudinary
    const uploadCover = async () => {

        if (!coverFile) {
            alert('Please select a cover image');
            return;
        }

        setUploadingCover(true);

        const formData = new FormData();

        formData.append('file', coverFile);
        formData.append('upload_preset', 'raaga_upload');

        try {

            const response = await fetch(
                'https://api.cloudinary.com/v1_1/ujjtwnme/image/upload',
                {
                    method: 'POST',
                    body: formData
                }
            );

            const data = await response.json();

            console.log('Cloudinary response:', data);

            if (!response.ok) {
                alert(data.error?.message || 'Cover upload failed');
                return;
            }

            setSong({
                ...song,
                coverUrl: data.secure_url
            });

            alert('Cover uploaded successfully');

        } catch (error) {

            console.log('Upload error:', error);
            alert('Cover upload failed');

        } finally {

            setUploadingCover(false);

        }

    };
    const uploadAudio = async () => {

    if (!audioFile) {
        alert('Please select an audio file');
        return;
    }

    setUploadingAudio(true);

    const formData = new FormData();

    formData.append('file', audioFile);
    formData.append('upload_preset', 'raaga_upload');

    try {

        const response = await fetch(
            'https://api.cloudinary.com/v1_1/ujjtwnme/video/upload',
            {
                method: 'POST',
                body: formData
            }
        );

        const data = await response.json();

        console.log('Cloudinary audio response:', data);

        if (!response.ok) {
            alert(data.error?.message || 'Audio upload failed');
            return;
        }

        setSong({
            ...song,
            audioUrl: data.secure_url
        });

        alert('Audio uploaded successfully');

    } catch (error) {

        console.log('Audio upload error:', error);
        alert('Audio upload failed');

    } finally {

        setUploadingAudio(false);

    }
};


    // Submit song details to JSON Server
    const handleSubmit = (e) => {

        e.preventDefault();

        if (!song.coverUrl) {
            alert('Please upload the cover image first');
            return;
        }

        apiServices('POST', '/songs', song)
            .then(() => {

                setSong(createEmptySong());
                setCoverFile(null);
                setAudioFile(null);
                formRef.current?.reset();

                alert('Song added successfully');

            })
            .catch((error) => {

                console.log(error);

                alert('Failed to add song');

            });

    };


    return (

        <div className="bg-black min-vh-100 text-white">

            {/* Header */}

            <header className="bg-black py-3">

                <Container className="d-flex justify-content-between align-items-center">

                    <h1 className="text-white fw-bold fs-2 mb-0">
                        Raaga <span className="text-danger">♪</span>
                    </h1>

                    <Button
                        variant="outline-light"
                        onClick={() => navigate('/admin-dashboard')}
                    >
                        Back
                    </Button>

                </Container>

            </header>


            <Container className="py-4">

                <h2 className="fw-bold fs-4 mb-4">
                    Add Song
                </h2>


                <Card className="bg-dark text-white border-secondary">

                    <Card.Body className="p-4">

                        <Form ref={formRef} onSubmit={handleSubmit}>

                            <Row>

                                {/* Song Title */}

                                <Col md={6} className="mb-3">

                                    <Form.Label>
                                        Song Title
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="title"
                                        placeholder="Enter song title"
                                        value={song.title}
                                        onChange={handleChange}
                                        required
                                    />

                                </Col>


                                {/* Artist */}

                                <Col md={6} className="mb-3">

                                    <Form.Label>
                                        Artist
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="artist"
                                        placeholder="Enter artist name"
                                        value={song.artist}
                                        onChange={handleChange}
                                        required
                                    />

                                </Col>


                                {/* Featured Artists */}

                                <Col md={6} className="mb-3">

                                    <Form.Label>
                                        Featured Artists
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="featuredArtists"
                                        placeholder="Featured Artists (comma separated)"
                                        value={song.featuredArtists.join(', ')}
                                        onChange={(e) => {

                                            setSong({
                                                ...song,
                                                featuredArtists: e.target.value
                                                    .split(',')
                                                    .map((artist) => artist.trim())
                                                    .filter(Boolean)
                                            });

                                        }}
                                    />

                                </Col>


                                {/* Movie */}

                                <Col md={6} className="mb-3">

                                    <Form.Label>
                                        Movie
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="movie"
                                        placeholder="Enter movie name"
                                        value={song.movie}
                                        onChange={handleChange}
                                    />

                                </Col>


                                {/* Lyricist */}

                                <Col md={6} className="mb-3">

                                    <Form.Label>
                                        Lyricist
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="lyricist"
                                        placeholder="Enter lyricist"
                                        value={song.lyricist}
                                        onChange={handleChange}
                                    />

                                </Col>


                                {/* Genre */}

                                <Col md={6} className="mb-3">

                                    <Form.Label>
                                        Genre
                                    </Form.Label>

                                    <Form.Select
                                        name="genre"
                                        value={song.genre}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select genre
                                        </option>

                                        <option value="Pop">
                                            Pop
                                        </option>

                                        <option value="Melody">
                                            Melody
                                        </option>

                                        <option value="Rock">
                                            Rock
                                        </option>

                                        <option value="Electronic">
                                            Electronic
                                        </option>

                                        <option value="Classical">
                                            Classical
                                        </option>

                                        <option value="Hip Hop">
                                            Hip Hop
                                        </option>

                                        <option value="Folk">
                                            Folk
                                        </option>

                                    </Form.Select>

                                </Col>


                                {/* Language */}

                                <Col md={6} className="mb-3">

                                    <Form.Label>
                                        Language
                                    </Form.Label>

                                    <Form.Select
                                        name="language"
                                        value={song.language}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select language
                                        </option>

                                        <option value="Malayalam">
                                            Malayalam
                                        </option>

                                        <option value="English">
                                            English
                                        </option>

                                        <option value="Hindi">
                                            Hindi
                                        </option>

                                        <option value="Tamil">
                                            Tamil
                                        </option>

                                        <option value="Telugu">
                                            Telugu
                                        </option>

                                        <option value="Kannada">
                                            Kannada
                                        </option>

                                    </Form.Select>

                                </Col>


                                {/* Release Year */}

                                <Col md={6} className="mb-3">

                                    <Form.Label>
                                        Release Year
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        name="releaseYear"
                                        placeholder="Release year"
                                        value={song.releaseYear}
                                        onChange={handleChange}
                                        required
                                    />

                                </Col>


                                {/* Duration */}

                                <Col md={6} className="mb-3">

                                    <Form.Label>
                                        Duration
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="duration"
                                        placeholder="Duration (minutes)"
                                        value={song.duration}
                                        onChange={handleChange}
                                        required
                                    />

                                </Col>


                                {/* Cover Image */}

                                <Col md={12} className="mb-4">

                                    <Form.Label>
                                        Cover Image
                                    </Form.Label>

                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            setCoverFile(e.target.files[0]);
                                        }}
                                    />

                                    <div className="mt-2">

                                        <Button
                                            variant="outline-danger"
                                            type="button"
                                            onClick={uploadCover}
                                            disabled={uploadingCover}
                                        >
                                            {uploadingCover
                                                ? 'Uploading...'
                                                : 'Upload Cover'}
                                        </Button>

                                    </div>


                                    {/* Cover Preview */}

                                    {song.coverUrl && (

                                        <div className="mt-3">

                                            <small className="text-success">
                                                Cover uploaded successfully
                                            </small>

                                            <br />

                                            <img
                                                src={song.coverUrl}
                                                alt="Cover preview"
                                                style={{
                                                    width: '120px',
                                                    height: '120px',
                                                    objectFit: 'cover'
                                                }}
                                                className="rounded mt-2"
                                            />

                                        </div>

                                    )}

                                </Col>


                                {/* Audio File */}

                                <Col md={12} className="mb-4">

                                    <Form.Label>
                                        Audio File
                                    </Form.Label>

                                    <Form.Control
                                        type="file"
                                        accept="audio/*"
                                        onChange={(e) => {
                                            setAudioFile(e.target.files[0]);
                                        }}
                                    />

                                    <Button
                                        variant="outline-danger"
                                        type="button"
                                        onClick={uploadAudio}
                                        disabled={uploadingAudio}
                                        className="mt-2"
                                    >
                                        {uploadingAudio
                                            ? 'Uploading...'
                                            : 'Upload Audio'}
                                    </Button>

                                    {song.audioUrl && (
                                        <div className="mt-2">
                                            <small className="text-success">
                                                Audio uploaded successfully
                                            </small>
                                        </div>
                                    )}

                                </Col>

                            </Row>


                            {/* Buttons */}

                            <div className="d-flex justify-content-end gap-2">

                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={() => navigate('/admin-dashboard')}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    variant="danger"
                                    type="submit"
                                >
                                    Add Song
                                </Button>

                            </div>

                        </Form>

                    </Card.Body>

                </Card>

            </Container>

        </div>

    );
}

export default AddSong;