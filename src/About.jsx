import React from 'react';
import { Link } from 'react-router-dom';

function About() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4">
            <h1 className="text-3xl font-bold mb-6">About CaesarMail</h1>
            <div className="w-full max-w-md">
                <p className="text-muted-foreground mb-4">
                    CaesarMail is a simple, temporary email service built for quick and easy use. Create disposable inboxes, copy them to your clipboard, and delete them when you're done—all with a sleek, modern interface.
                </p>
                <p className="text-muted-foreground mb-4">
                    Built with React, Redux, Tailwind CSS, Shadcn/UI, and a Go backend with PostgreSQL. Toggle dark mode, enjoy animations, and get instant feedback with toasts.
                </p>
                <Link to="/">
                    <button className="text-primary underline">Back to Home</button>
                </Link>
            </div>
        </div>
    );
}

export default About;
