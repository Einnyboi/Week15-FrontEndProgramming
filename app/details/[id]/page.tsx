'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

export default function DetailPage() {
  const params = useParams();
  const router = useRouter();

  const [item, setItem] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [imageList, setImageList] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    async function load() {
      let imgs: string[] = [];
      try {
        const res = await fetch('/images/manifest.json');
        if (res.ok) {
          const names: string[] = await res.json();
          imgs = names.length ? names.map((n) => `/images/${n}`) : ['/file.svg'];
        } else {
          imgs = ['/file.svg'];
        }
      } catch {
        imgs = ['/file.svg'];
      }
      setImageList(imgs);

      const saved = localStorage.getItem('my-app-data');
      if (saved) {
        const parsedData = JSON.parse(saved);
        const found = parsedData.find((i: any) => String(i.id) === String(params.id));
        if (found) {
          setItem(found);
          setTitle(found.title || '');
          setDescription(found.description || '');
          setSelectedImage(found.image || imgs[0]);
          setDate(found.date || new Date().toISOString().split('T')[0]);
        }
      }
    }
    load();
  }, [params.id]);

  if (!item) return <div className="container mt-5">Loading...</div>;

  const save = () => {
    const saved = localStorage.getItem('my-app-data');
    const arr = saved ? JSON.parse(saved) : [];
    const updated = arr.map((i: any) =>
      String(i.id) === String(params.id) ? { ...i, title, description, image: selectedImage, date } : i
    );
    localStorage.setItem('my-app-data', JSON.stringify(updated));
    router.push('/dashboard');
  };

  const remove = () => {
    const saved = localStorage.getItem('my-app-data');
    const arr = saved ? JSON.parse(saved) : [];
    const filtered = arr.filter((i: any) => String(i.id) !== String(params.id));
    localStorage.setItem('my-app-data', JSON.stringify(filtered));
    router.push('/dashboard');
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            {selectedImage && (
              <Image src={selectedImage} alt={title} width={800} height={440} style={{ width: '100%', height: 440, objectFit: 'cover' }} />
            )}
            <div className="card-body">
              <h5 className="card-title">Preview</h5>
              <p className="text-muted">Date: {date ? new Date(date).toLocaleDateString() : '—'}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Edit Item</div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label">Date</label>
                <input type="date" className="form-control mb-2" value={date} onChange={(e) => setDate(e.target.value)} />

                <label className="form-label">Image</label>
                <select className="form-select" value={selectedImage} onChange={(e) => setSelectedImage(e.target.value)}>
                  {imageList.map((img) => (
                    <option key={img} value={img}>{img.split('/').pop()}</option>
                  ))}
                </select>
              </div>

              <div className="d-flex">
                <button className="btn btn-primary me-2" onClick={save}>Save</button>
                <button className="btn btn-danger me-2" onClick={remove}>
                  <i className="bi bi-trash-fill"></i>Delete
                </button>
                <Link href="/dashboard" className="btn btn-secondary">Back</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}