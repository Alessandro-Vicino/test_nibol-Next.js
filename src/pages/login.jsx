'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import db from '../db/db.js';
/*Questa importazione serve per cambiare nome del tab - riga 55*/
import Head from 'next/head';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            setMessage('Enter email and password.');
            setMessageType('error');
            return;
        }
        
        try {
            /* Cerca l'utente con email e password corrispondenti */
            const user = await db.users
                .where({ email: email, password: password })
                .first();
            
            if (!user) {
                setMessage('User not registered or incorrect credentials.');
                setMessageType('error');
            } else {
                setMessage('Login successful!');
                setMessageType('success');
            }
        } catch (error) {
            setMessage('Error during login.');
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
                <title>Nibol / Login</title>
                <link rel="icon" href="/nibol.png" />
            </Head>
            
        {/* Struttura del form */}
        <div className="container-fluid main-login d-flex justify-content-center align-items-center vh-100">
            <div className="row w-100">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 login-container">
                    <h2 className="login-title mt-5 text-start">Login</h2>
                    
                    <p className="text-start">
                        Don't you have an account?{' '}
                        <Link href="/signup" className="link-custom">Signup</Link>
                    </p>
                    
                    {message && (
                        <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
                            {message}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        
                        <div className="mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        
                        <button type="submit" className="button-custom w-100">Continue</button>
                    </form>
                    
                    <p className="mt-3 text-center">
                        <Link href="/signup" className="link-custom">Forgot password?</Link>
                    </p>
                </div>
            </div>
        </div>

        </>
    );
}

export default Login;
