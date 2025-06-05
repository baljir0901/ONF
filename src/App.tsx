import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'
import './App.css'
import { SplashScreen } from './SplashScreen';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'home' | 'add' | 'settings'>('home');
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }
  if (loading) return <div>Loading...</div>;
  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fdba74 100%)' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#b45309', marginBottom: 32, textShadow: '0 2px 8px #fff8' }}>親子日記 Oyako Nikki</h2>
        <button
          onClick={signInWithGoogle}
          style={{
            margin: 8,
            padding: '14px 32px',
            fontSize: 18,
            fontWeight: 600,
            borderRadius: 8,
            border: 'none',
            background: 'linear-gradient(90deg, #fbbf24 0%, #f59e42 100%)',
            color: '#fff',
            boxShadow: '0 2px 8px #fbbf2440',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.242 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.148 0-3.359 2.75-6.148 6.125-6.148 1.922 0 3.211.82 3.953 1.523l2.703-2.625c-1.703-1.57-3.906-2.523-6.656-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.016 9.547-9.664 0-.648-.07-1.141-.156-1.539z" fill="#FFC107"></path><path d="M3.152 7.345l3.281 2.406c.891-1.789 2.578-2.953 4.617-2.953 1.125 0 2.188.391 3.008 1.164l2.844-2.766c-1.703-1.57-3.906-2.523-6.656-2.523-3.797 0-7.031 2.164-8.672 5.305z" fill="#FF3D00"></path><path d="M12 22c2.672 0 4.922-.883 6.563-2.406l-3.047-2.492c-.844.633-2.016 1.086-3.516 1.086-2.828 0-5.219-1.906-6.078-4.453l-3.242 2.5c1.617 3.211 5.016 5.765 9.32 5.765z" fill="#4CAF50"></path><path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.242 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.148 0-3.359 2.75-6.148 6.125-6.148 1.922 0 3.211.82 3.953 1.523l2.703-2.625c-1.703-1.57-3.906-2.523-6.656-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.016 9.547-9.664 0-.648-.07-1.141-.156-1.539z" fill="none"></path></g></svg>
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <h2 style={{ margin: 0 }}>親子日記 Oyako Nikki</h2>
        <button onClick={signOut} style={{ padding: 8 }}>Sign Out</button>
      </div>
      <div style={{ flex: 1, padding: 16 }}>
        {tab === 'home' && <HomeTab user={user} />}
        {tab === 'add' && <AddTab user={user} />}
        {tab === 'settings' && <SettingsTab />}
      </div>
      <nav style={{ display: 'flex', borderTop: '1px solid #eee', background: '#fafafa' }}>
        <TabButton label="Home" active={tab === 'home'} onClick={() => setTab('home')} />
        <TabButton label="Add" active={tab === 'add'} onClick={() => setTab('add')} />
        <TabButton label="Settings" active={tab === 'settings'} onClick={() => setTab('settings')} />
      </nav>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: 16,
        fontWeight: active ? 'bold' : 'normal',
        background: active ? '#e0e7ff' : 'transparent',
        border: 'none',
        borderBottom: active ? '2px solid #6366f1' : '2px solid transparent',
        color: active ? '#3730a3' : '#333',
        fontSize: 16,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}

function HomeTab({ user }: { user: any }) {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('diary')
        .select('*')
        .eq('author_id', user.id)
        .order('date', { ascending: false });
      if (!error) setEntries(data || []);
      setLoading(false);
    };
    fetchEntries();
  }, [user]);

  if (loading) return <div>Loading diary entries...</div>;
  if (!entries.length) return <div>No diary entries yet.</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {entries.map(entry => (
        <div key={entry.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, background: '#fff' }}>
          <div style={{ fontWeight: 'bold' }}>{entry.date}</div>
          <div style={{ margin: '8px 0' }}>{entry.text}</div>
          <div style={{ fontSize: 12, color: '#888' }}>by {entry.author_name || 'Unknown'}</div>
        </div>
      ))}
    </div>
  );
}

function AddTab({ user }: { user: any }) {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const { error } = await supabase.from('diary').insert([
      {
        date,
        text,
        author_id: user.id,
        author_name: user.email || user.id,
      },
    ]);
    if (error) {
      setMessage('Error saving entry.');
    } else {
      setText('');
      setMessage('Saved!');
    }
    setSaving(false);
  };

  return (
    <form onSubmit={e => { e.preventDefault(); handleSave(); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label>
        Date:
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={{ fontSize: 16, padding: 8 }} />
      </label>
      <label>
        Diary Entry:
        <textarea value={text} onChange={e => setText(e.target.value)} required rows={5} style={{ fontSize: 16, padding: 8 }} />
      </label>
      <button type="submit" disabled={saving} style={{ padding: 12, fontSize: 16, background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6 }}>
        {saving ? 'Saving...' : 'Save Entry'}
      </button>
      {message && <div style={{ color: message === 'Saved!' ? '#059669' : '#dc2626', marginTop: 8 }}>{message}</div>}
    </form>
  );
}

function SettingsTab() {
  return <div>Settings (family linking, etc. coming soon)</div>;
}

export default App
