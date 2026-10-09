import React from 'react';
import { Container, Navbar, Button } from 'react-bootstrap';
import { FiSearch, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <Navbar
      className="bg-black py-3"
      style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 4px 18px rgba(220, 53, 69, 0.06)'
      }}
    >
      <Container>

        <nav
          className="text-white fw-bold"
          aria-label="Raaga home"
          style={{ fontSize: '2.65rem', lineHeight: 1, letterSpacing: '0.02em' }}
        >
          Raaga<span className="text-danger ms-1" style={{ fontSize: '1.12em' }} aria-hidden="true">♪</span>
        </nav>
        <div className="d-flex align-items-center gap-3">
          <Button variant="link"className="text-white p-2 border-0 "><Link to={'/search'} className="text-white"><FiSearch size={24} /></Link></Button>
          <Button variant="link" className="text-white p-2 border-0"><Link to={'/account'}  className="text-white"><FiUser size={24} /></Link></Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;