'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import db from '../db/db';
/*Questa importazione serve per cambiare nome del tab - riga 55*/
import Head from 'next/head';

function Signup() {
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  /* Verifica la complessità della password inserita */
  const passwordStrength = (pwd) => {
    let score = 0;
    if (!pwd) return score;
    if (pwd.length >= 6) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  const getColor = (score) => {
    if (score < 50) return '#ff3d00';
    if (score < 75) return '#ffa500';
    return '#4caf50';
  };

  /* Indica con delle frasi la complessità della password */
  const getStrengthText = (score) => {
    switch (true) {
      case score === 0:
        return '';
      case score < 50:
        return 'Too easy my friend';
      case score < 75:
        return 'Almost there';
      default:
        return 'Top secret';
    }
  };

  const strength = passwordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Verifica se tutti gli input sono stati inseriti */
    if (!nome || !cognome || !email || !password || !termsAccepted) {
      setMessage('Fill in all fields and accept the terms and conditions.');
      setMessageType('error');
      return;
    }

    try {
      /* Verifica se l'email è già registrata */
      const existing = await db.users.where('email').equals(email).first();
      if (existing) {
        setMessage('Email already registered.');
        setMessageType('error');
        return;
      }

      await db.users.add({ nome, cognome, email, password });

      setMessage('Registration successful!');
      setMessageType('success');

      setNome('');
      setCognome('');
      setEmail('');
      setPassword('');
      setTermsAccepted(false);

      /* Gestisce un eventuale errore di registrazione con un messaggio di errore. 
         La parola errore risulta come errore perchè non viene mai utilizzato */
    } catch (error) {
      setMessage('Error during registration.');
      setMessageType('error');
    }
  };

  /* Modifica la durata del messaggio di alert */
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
            <>
            {/* Modifica nome del tab + favicon*/}
            <Head>
                <title>Nibol / Signup</title>
                <link rel="icon" href="/nibol.png" />
            </Head>
        {/* Struttura del form */}
    
    <div className="container-fluid main-login d-flex vh-100">
      <div className="row justify-content-center align-items-center w-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 login-container">
          <h2 className="login-title mt-5 text-start">Signup</h2>

          <p className="text-start">
            Already registered?{' '}
            <Link href="/login" className="link-custom">
              Login
            </Link>
          </p>

          {message && (
            <div
              className={`alert ${
                messageType === 'success' ? 'alert-success' : 'alert-danger'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Surname"
                value={cognome}
                onChange={(e) => setCognome(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="password-strength-container mt-2">
                <div
                  className="password-strength-bar"
                  style={{ height: '6px', backgroundColor: '#ddd', borderRadius: '4px' }}
                >
                  <div
                    className="password-strength-fill"
                    style={{
                      width: `${strength}%`,
                      height: '100%',
                      backgroundColor: getColor(strength),
                      borderRadius: '4px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>

                {/* Testo con livello di sicurezza */}
                <small
                  style={{
                    color: getColor(strength),
                    margin: 0,
                    whiteSpace: 'nowrap',
                    paddingLeft: '8px',
                  }}
                >
                  {getStrengthText(strength)}
                </small>
              </div>
            </div>

            <div className="form-check mb-2 mt-3">
              <input
                className="form-check-input custom-checkbox"
                type="checkbox"
                id="acceptTerms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="acceptTerms">
                agree to our{' '}
                <Link href="#" className="link-terms">
                  Terms and Conditions
                </Link>
              </label>
            </div>

            <button type="submit" className="button-custom w-100">
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default Signup;
