import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Home({ user }: { user: any }) {
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
