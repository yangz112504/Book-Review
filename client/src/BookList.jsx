import { useState, useEffect } from 'react'
import axios from 'axios';

function BookList() {
  const [books, setBooks] = useState([]);
  const [detail, setDetail] = useState(null);
  const [author, setAuthor] = useState(null);
  const [title, setTitle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(()=>{
    const fetchBooks = async () => {
      try{
        const response = await axios.get('http://localhost:5001/');
        setBooks(response.data);
      } catch(err){
        setError("Failed to get books");
        console.error(err);
      }
    };

    const fetchBookDetail = async () => {
        try{
            const response = await axios.get('http://localhost:5001/isbn/2');
            setDetail(response.data);
        }catch(err){
            setError("Failed to get book detail");
            console.error(err);
        }
    };

    const fetchBookAuthor = async () =>{
        try{
            const response = await axios.get('http://localhost:5001/author/Unknown')
            setAuthor(response.data);
        }catch(err){
            setError("Failed to get book based on author");
            console.error(err);
        }
    }

    const fetchBookTitle = async() =>{
        try{
            const title = "Things Fall Apart"
            const response = await axios.get(`http://localhost:5001/title/${encodeURIComponent(title)}`)
            setTitle(response.data);
        }catch(err){
            setError("Failed to get book based on title");
            console.error(err);
        }
    }

    fetchBooks();
    fetchBookDetail();
    fetchBookAuthor();
    fetchBookTitle();
  }, []);

  if(error){
    return(
      <h2>{error}</h2>
    )
  }

  return (
    <>
      <div>
        <h1>Book List</h1>
        {Object.keys(books).map((isbn) => ( //understand what isbn does and what key = does
          <div key={isbn}>
            <h3>{books[isbn].title}</h3>
            <p>Author: {books[isbn].author}</p>
          </div>
        ))}
      </div>
      <div>
        <h1>Book Detail</h1>
        {detail ? (
            <>
            <p>{detail.author}</p>
            <p>{detail.title}</p>
            <p>Reviews: </p>
            <p>{JSON.stringify(detail.reviews)}</p>
            </>
        ) : (
            <p>Loading...</p>
        )}
      </div>
      <div>
        <h1>Author Detail</h1>
        {author ? (
            author.map((book, index)=>(
                <div key={index}>
                    <p>{book.title}</p>
                </div>
            ))
        ) : (
            <p>Loading...</p>
        )
        }
      </div>
      <div>
        <h1>Title Detail</h1>
        {title ? (
            title.map((book, index)=>(
                <div key={index}>
                    <p>{book.title}</p>
                </div>
            ))
        ) : (
            <p>Loading...</p>
        )

        }
      </div>
    </>
  )
}

export default BookList;
