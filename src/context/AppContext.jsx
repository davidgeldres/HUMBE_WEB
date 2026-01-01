import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [favorites, setFavorites] = useState([]);
    const [notes, setNotes] = useState({});
    const [user, setUser] = useState(null);

    // Initialize Auth and Data Fetching
    useEffect(() => {
        // 1. Check for existing session or sign in anonymously
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
            } else {
                const { data: { user }, error } = await supabase.auth.signInAnonymously();
                if (user) setUser(user);
                if (error) console.error('Error signing in:', error);
            }
        };

        initSession();

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Fetch Data when User is ready
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            // Fetch Favorites (Personal - per device)
            const { data: favs } = await supabase
                .from('favorites')
                .select('song_id')
                .eq('user_id', user.id);

            if (favs) setFavorites(favs.map(f => f.song_id));

            // Fetch Notes (Public - Shared Wall)
            // Fetch ALL notes, ordered by time so latest updates overwrite in the map
            const { data: allNotes } = await supabase
                .from('notes')
                .select('song_id, text, attachments')
                .order('updated_at', { ascending: true });

            if (allNotes) {
                const notesMap = {};
                allNotes.forEach(note => {
                    notesMap[note.song_id] = {
                        text: note.text,
                        attachments: note.attachments
                    };
                });
                setNotes(notesMap);
            }
        };

        fetchData();

        // Realtime Subscription for Notes (Public)
        const channel = supabase
            .channel('public:notes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, (payload) => {
                const newNote = payload.new;
                if (newNote && newNote.song_id) {
                    setNotes(prev => ({
                        ...prev,
                        [newNote.song_id]: {
                            text: newNote.text,
                            attachments: newNote.attachments
                        }
                    }));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const toggleFavorite = async (songId) => {
        if (!user) return;

        const isFavorite = favorites.includes(songId);

        // Optimistic Update
        setFavorites(prev =>
            isFavorite ? prev.filter(id => id !== songId) : [...prev, songId]
        );

        if (isFavorite) {
            await supabase.from('favorites').delete().match({ user_id: user.id, song_id: songId });
        } else {
            await supabase.from('favorites').insert({ user_id: user.id, song_id: songId });
        }
    };

    const saveNote = async (songId, text, attachments = []) => {
        if (!user) return;

        // Optimistic Update
        setNotes(prev => ({
            ...prev,
            [songId]: { text, attachments }
        }));

        // Handle File Uploads (if attachments have base64 data)
        const processedAttachments = await Promise.all(attachments.map(async (att) => {
            if (att.url.startsWith('data:')) {
                // It's a base64 string, need to upload
                const fileExt = att.type === 'video' ? 'mp4' : 'jpg';
                const fileName = `${user.id}/${songId}/${Date.now()}.${fileExt}`;

                // Convert base64 to blob
                const res = await fetch(att.url);
                const blob = await res.blob();

                const { data, error } = await supabase.storage
                    .from('humbe-media')
                    .upload(fileName, blob);

                if (error) {
                    console.error('Upload error:', error);
                    return att; // Fallback or handle error
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('humbe-media')
                    .getPublicUrl(fileName);

                return { ...att, url: publicUrl, storagePath: fileName };
            }
            return att; // Already a URL
        }));

        // Upsert Note
        const { error } = await supabase.from('notes').upsert({
            user_id: user.id,
            song_id: songId,
            text,
            attachments: processedAttachments,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, song_id' });

        if (error) console.error('Error saving note:', error);
    };

    return (
        <AppContext.Provider value={{ favorites, toggleFavorite, notes, saveNote }}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext);
