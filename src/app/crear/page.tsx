'use client';
import Link from "next/link";
import React, { useState } from "react";

export default function CrearPage() {
    const[showMessage, setShowMessage] = useState(false);
    const[authors, setAuthors] = useState({
        name: "",
        birthDate: "",
        description: "",
        image: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAuthors({
            ...authors,
            [e.target.name]: e.target.value
        });
    }

    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8080/api/authors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(authors)
            });
            if (!response.ok) {
                throw new Error("Failed to create author");
            }
            const data = await response.json();
            console.log("Author created:", data);

            setShowMessage(true);

            setTimeout(() => {
                setShowMessage(false);
            },3000);

        } catch (error) {
            console.error("Error creating author:", error);
        }
    }

    return (
        <main>
            <h1 className="font-bold text-[45px] flex justify-center font-[Times_New-Roman] p-5">Crear Autor</h1>
            <div className = "justify-center items-center flex"> 
                <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 font-[Times_New-Roman] bg-zinc-600 p-5 rounded-lg m-20 w-240">
                    <label htmlFor="name">Nombre del autor:</label>
                    <input className = "bg-amber-50 text-black w-200 justify-center text-center h-15" type = "text" id="name" name="name" value={authors.name} onChange={handleChange} placeholder="Ingrese el nombre del autor" required />
                    <label htmlFor="birthDate">Fecha de nacimiento:</label>
                    <input className = "bg-amber-50 text-black w-200 justify-center text-center h-15" type="text" id="birthDate" name="birthDate" value={authors.birthDate} onChange={handleChange} placeholder="Ingrese la fecha de nacimiento aa-mm-dd"  pattern="\d{4}-\d{2}-\d{2}" required />
                    <label htmlFor="description">Descripción:</label>
                    <textarea className = "bg-amber-50 text-black w-200 justify-center text-center h-30" id="description" name="description" value={authors.description} onChange={handleChange} placeholder="Ingrese una descripción" required />
                    <label htmlFor="image">URL de la imagen:</label>
                    <input className = "bg-amber-50 text-black w-200 justify-center text-center h-15" type="text" id="image" name="image" value={authors.image} onChange={handleChange} placeholder="Ingrese la URL de la imagen" />
                    <button className = "bg-blue-800 w-100 h-10 rounded-lg font-bold cursor-pointer" type="submit">Crear Autor</button>
                    {showMessage && <p className="text-green-500">Autor creado exitosamente!</p>}
                </form>
            </div>
            <div className="flex justify-center mb-10">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded font-[Times_New-Roman] cursor-progress">
                    <Link href="/authors">Autores</Link>
                </button>
            </div>
        </main>
    );
}