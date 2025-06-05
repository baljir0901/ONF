import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Add({ user }: { user: any }) {
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
      console.error('Supabase insert error:', error);
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
