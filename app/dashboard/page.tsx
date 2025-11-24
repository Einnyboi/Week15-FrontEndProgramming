"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// list item
interface Item {
  id: number;
  title: string;
  description: string;
  image?: string;
  date?: string;
}

export default function Dashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [imageList, setImageList] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    async function loadManifestAndItems() {
      let imgs: string[] = [];
      try {
        const res = await fetch("/images/manifest.json");
        if (res.ok) {
          const names: string[] = await res.json();
          imgs = names.length ? names.map((n) => `/images/${n}`) : ["/file.svg"];
        } else {
          imgs = ["/file.svg"];
        }
      } catch {
        imgs = ["/file.svg"];
      }
      setImageList(imgs);

      // NOTE: persistence moved off localStorage. Items are kept only in
      // component state (or via backend when wired) to avoid client-only storage.
    }
    loadManifestAndItems();
  }, []);

  const addItem = async () => {
    const chosen = imageList.length ? imageList[Math.floor(Math.random() * imageList.length)] : "/file.svg";
    const todayIso = new Date().toISOString().split("T")[0];
    const newEntry: Item = {
      id: Date.now(),
      title: "Untitled",
      description: "Details here...",
      image: chosen,
      date: todayIso,
    };
    const next = [...items, newEntry];
    setItems(next);
    router.push(`/details/${newEntry.id}`);
  };

  const deleteItem = (id: number) => {
    const filtered = items.filter((item) => item.id !== id);
    setItems(filtered);
  };

  return (
    <div className="container">
      <h1 className="text-center">
        <i className="bi bi-moon-stars-fill"></i> Moon Gallery
        </h1>
      <div className="d-flex mb-3">
        <button className="btn btn-success" onClick={addItem}>
          <i className="bi bi-plus-circle"></i> Add a moon picture!
        </button>
        <button className="btn btn-rd">
          <Link href="/explore">Explore</Link>
        </button>
      </div>

      <div className="row mt-4">
        {items.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card polaroid-card h-100">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={220}
                  className="card-img-top"
                  style={{ objectFit: "cover", width: "100%", height: 220 }}
                />
              )}

              <div className="card-body polaroid-body">

                <h5 className="card-title">{item.title}</h5>
                <p className="text-muted mb-1">{item.description}</p>
                <small className="text-muted">
                  {item.date ? new Date(item.date).toLocaleDateString() : "Date unknown"}
                </small>
                <div className="mt-auto d-flex gap-2">
                  <Link href={`/details/${item.id}`} className="btn btn-info btn-sm">
                    <i className="bi bi-search-heart"></i> Details
                  </Link>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteItem(item.id)}
                    aria-label={`Delete ${item.title}`}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>

              </div> {/* end of card body */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
