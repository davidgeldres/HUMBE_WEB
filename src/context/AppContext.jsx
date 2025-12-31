import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('humbe_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('humbe_notes');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('humbe_favorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('humbe_notes', JSON.stringify(notes));
    }, [notes]);

    const toggleFavorite = (songId) => {
        setFavorites(prev =>
            prev.includes(songId)
                ? prev.filter(id => id !== songId)
                : [...prev, songId]
        );
    };

    const saveNote = (songId, text, attachments = []) => {
        setNotes(prev => ({
            ...prev,
            [songId]: {
                text: text,
                attachments: attachments, // Array of { url, type }
                timestamp: new Date().toISOString()
            }
        }));
    };

    return (
        <AppContext.Provider value={{ favorites, toggleFavorite, notes, saveNote }}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext);
