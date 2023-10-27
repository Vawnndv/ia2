import { useEffect } from "react";
import { useState } from "react";
import "./App.css"

function LoadingAnimation() {
  return <div className="loading-spinner"></div>;
}

function App() {
  const [name, setName] = useState("random");
  const [inputValue, setInputValue] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [oldImage, setOldImage] = useState([]);
  const [pages, setPages] = useState(1);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const loadImages = async () => {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${name}&page=${pages}&per_page=10&client_id=dgJOxM7iHEf4LUq05JLY6AD6psVkuy78pCvIO_hwE08`);
    const imgResult = await response.json();
    
    setImageUrls([...oldImage, ...imgResult.results.map(image => image.urls.small)]);

    setOldImage([...oldImage, ...imgResult.results.map(image => image.urls.small)]);
  }

  useEffect(() => {
    loadImages();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [name, pages])

  function handleScroll() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;

    if (scrollTop + windowHeight >= documentHeight) {
      setIsAtBottom(true); // Set isLoading to false when data is ready
      setTimeout(() => {
        setPages(pages + 1);
      }, 2000); // Simulate a 2-second delay
    } else {
      setIsAtBottom(false);
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }

  const handleClick = (inputValue) => {
    console.log(inputValue);
    setName(inputValue);
    setPages(1);
    setOldImage([]);
  }

  const handleClickLoadMore = (pages) => {
    setPages(pages + 1);
  }

  return (
    <div className="App">
      <div className="search">
        <input onChange={handleInputChange} value={inputValue}/>
        <button onClick={() => handleClick(inputValue)}>Search</button>
      </div>
      
      <div id="gallery">
        {imageUrls.map((img, index) => 
          <img src={img} key={index} />
        )}
      </div>

      <div className="loading">
        { isAtBottom ? (
            <LoadingAnimation />
        ) : (<></>)}
      </div>
    </div>
  );
}

export default App;