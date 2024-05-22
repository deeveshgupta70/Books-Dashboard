import { useState } from "react";

const Search = ({ onSearch, onReset }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query?.trim());
  };

  const handleReset = () => {
    setQuery("");
    onReset();
  };
  return (
    <>
      <section className="main-wrapper flex justify-center bg-white mb-3 h-[250px] w-[95%] sm:w-[90%] mx-auto rounded-md">
        <div className="container flex items-center justify-center">
          <h2 className="text-3xl">Books Dashboard 📚</h2>
        </div>
        <div className="search-bar w-full p-4 bg-white rounded-md flex justify-between items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by author name"
            className="p-2 border border-gray-300 rounded-md w-full"
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-blue-400 text-white rounded-md ml-2"
          >
            Search
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-red-400 text-white rounded-md ml-2"
          >
            Reset
          </button>
        </div>
      </section>
    </>
  );
};

export default Search;
