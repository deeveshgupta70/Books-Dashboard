import { useEffect, useState } from "react";
import DataTable from "./components/DataTable";
import Search from "./components/Search";

function App() {
  const [books, setBooks] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(
          "https://openlibrary.org/people/mekBot/books/want-to-read.json"
        );
        const bookList = await res.json();
        const books = bookList.reading_log_entries;
        setBooks(books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (books.length === 0) return;

      try {
        const fetchPromises = books.map(async (book, index) => {
          const workId = book.work.key;
          const authorName = book.work.author_names[0];

          const [ratingResponse, workResponse, authorResponse] =
            await Promise.all([
              fetch(`https://openlibrary.org${workId}/ratings.json`),
              fetch(`https://openlibrary.org${workId}.json`),
              fetch(
                `https://openlibrary.org/search/authors.json?q=${authorName}`
              ),
            ]);

          const ratingData = await ratingResponse.json();
          const workData = await workResponse.json();
          const authorData = await authorResponse.json();

          const subjects = workData?.subjects?.slice(0, 2) || [];
          const authorInfo = authorData?.docs?.[0] || {};

          return {
            id: index + 1,
            author_name: authorName,
            title: book?.work?.title,
            first_publish_year: book?.work?.first_publish_year,
            subjects,
            average_rating: (ratingData?.summary?.average || 0).toFixed(2),
            dob: authorInfo.birth_date || "No Data",
            top_work: authorInfo.top_work,
          };
        });

        const results = await Promise.all(fetchPromises);
        setMergedData(results);
        setFilteredData(results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [books]);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredData(mergedData);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = mergedData.filter((book) =>
        book.author_name.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredData(filtered);
    }
  };

  const handleReset = () => {
    setFilteredData(mergedData);
  };

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Author's Name",
      accessorKey: "author_name",
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "First Publish",
      accessorKey: "first_publish_year",
    },
    {
      header: "Subjects",
      accessorKey: "subjects",
      cell: (info) => <div>{info.getValue().join(", ")}</div>,
    },
    {
      header: "Avg. Rating",
      accessorKey: "average_rating",
    },
    {
      header: "Date of Birth",
      accessorKey: "dob",
    },
    {
      header: "Top Work",
      accessorKey: "top_work",
    },
  ];

  return (
    <>
      <main className=" bg-blue-400 w-screen p-4 min-h-screen">
        <Search onSearch={handleSearch} onReset={handleReset} />
        <DataTable headColumn={columns} loading={loading} data={filteredData} />
      </main>
    </>
  );
}

export default App;
