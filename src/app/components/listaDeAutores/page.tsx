'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PageAutores() {
    const [authors, setAuthors] = useState<any[]>([]); 
    const [showModal, setShowModal] = useState(false); 
    const [currentAuthor, setCurrentAuthor] = useState<any | null>(null); 
    const [formData, setFormData] = useState({
        name: "",
        birthDate: "",
        description: "",
        image: ""
    });


    const fetchAuthors = () => {
        fetch("http://127.0.0.1:8080/api/authors")
            .then((response) => response.json())
            .then((data) => setAuthors(data))
            .catch((error) => console.error("Error fetching authors:", error));
    };


    const handleEdit = (author: any) => {
        setCurrentAuthor(author);
        setFormData({
            name: author.name,
            birthDate: author.birthDate,
            description: author.description,
            image: author.image
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentAuthor(null);
        setFormData({
            name: "",
            birthDate: "",
            description: "",
            image: ""
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const saveAuthor = async (url: string, method: string, data: any) => {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Failed to save author");
        }

        return response.json();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let method: string;
        let url: string;

        if (currentAuthor) {
            method = "PUT";
            url = `http://127.0.0.1:8080/api/authors/${currentAuthor.id}`;
        } else {
            method = "POST";
            url = "http://127.0.0.1:8080/api/authors";
        }

        saveAuthor(url, method, formData)
            .then(() => {
                fetchAuthors(); 
                closeModal();
            })
            .catch((error) => console.error("Error saving author:", error));
    };

    useEffect(() => {
        fetchAuthors(); 
    }, []);

    const handleDelete = (authorId: number) => {
        console.log("Deleting author with ID:", authorId);

        fetch(`http://127.0.0.1:8080/api/authors/${authorId}/books`)
            .then((res) => res.json())
            .then((books) => {
                console.log("Books to delete:", books);

                const deleteBookPromises = books.map((book: any) =>
                    fetch(`http://127.0.0.1:8080/api/authors/${authorId}/books/${book.id}`, {
                        method: "DELETE"
                    })
                );

                return Promise.all(deleteBookPromises);
            })
            .then(() => {
                console.log("All books deleted");

                return fetch("http://127.0.0.1:8080/api/prizes")
                    .then((res) => res.json())
                    .then((prizes) => {
                        const prizesToDelete = prizes.filter(
                            (p: any) => p.author && p.author.id === authorId
                        );

                        console.log("Prizes to remove author from:", prizesToDelete);

                        const deletePrizePromises = prizesToDelete.map((p: any) =>
                            fetch(`http://127.0.0.1:8080/api/prizes/${p.id}/author`, {
                                method: "DELETE"
                            })
                        );

                        return Promise.all(deletePrizePromises);
                    });
            })
            .then(() => {
                console.log("All prize-author relationships removed");
                return fetch(`http://127.0.0.1:8080/api/authors/${authorId}`, {
                    method: "DELETE"
                });
            })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to delete author");
                console.log(`Author ${authorId} deleted successfully`);
                fetchAuthors(); 
            })
            .catch((err) => console.error("Error deleting author and related data:", err));
    };

    return (
        <main>
            <h1 className="font-bold text-[45px] flex justify-center font-[Times_New-Roman] p-5">Lista de Autores</h1>
            <div className="grid grid-cols-5 md:grid-cols-2 lg:grid-cols-5 gap-8 font-bold font-[Times_New-Roman] ml-5 mr-5">
                {authors.map((author) => (
                    <div key={author.id} className="author-card items-center flex flex-col justify-between p-4 border border-zinc-700 bg-zinc-600">
                        <img className="w-60 h-75" src={author.image} alt={author.name} width={100} height={100} />
                        <h2 className="text-[20px]">{author.name}</h2>
                        <p className="text-[15px]">{author.birthDate}</p>
                        <p className="text-[15px] flex flex-wrap text-justify">{author.description}</p>
                        <div className='flex'>
                            <button className="bg-blue-800 w-20 h-10 rounded-lg font-bold m-2 cursor-pointer" onClick={() => handleEdit(author)}>Editar</button>
                            <button className="bg-red-800 w-20 h-10 rounded-lg font-bold m-2 cursor-pointer" onClick={() => handleDelete(author.id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h2 className="text-xl mb-4 text-black">{currentAuthor ? "Editar Autor" : "Crear Autor"}</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                            <label htmlFor="name" className="text-black">Nombre del autor:</label>
                            <input className="bg-amber-50 text-black w-full" type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                            <label htmlFor="birthDate" className="text-black">Fecha de nacimiento:</label>
                            <input className="bg-amber-50 text-black w-full" type="text" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleChange} required pattern="\d{4}-\d{2}-\d{2}"/>
                            <label htmlFor="description" className="text-black">Descripción:</label>
                            <textarea className="bg-amber-50 text-black w-full" id="description" name="description" value={formData.description} onChange={handleChange} required />
                            <label htmlFor="image" className="text-black">URL de la imagen:</label>
                            <input className="bg-amber-50 text-black w-full" type="text" id="image" name="image" value={formData.image} onChange={handleChange} />
                            <div className="flex justify-between mt-4">
                                <button className="bg-blue-800 w-20 h-10 rounded-lg font-bold cursor-pointer" type="submit">Guardar</button>
                                <button className="bg-gray-800 w-20 h-10 rounded-lg font-bold cursor-pointer" type="button" onClick={closeModal}>Cerrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className = 'flex justify-center p-5'>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded font-[Times_New-Roman]">
                    <Link href="/crear">Crear Un Autor</Link>
                </button>
            </div>
        </main>
    );
}
