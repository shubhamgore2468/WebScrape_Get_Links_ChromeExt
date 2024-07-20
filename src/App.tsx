import "./App.css";
import { useState } from "react";

type LinkDetail = {
  link: string;
  text: string;
};

function App() {
  const [alllinks, setAllLinks] = useState<LinkDetail[]>([]);
  const [showLinks, setShowLinks] = useState(false);

  const onclick = async () => {
    try {
      const [tab]: any = await chrome.tabs.query({
        currentWindow: true,
        active: true,
      });
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: () => {
            try {
              const links = Array.from(document.querySelectorAll("a")).map(
                (link) => ({
                  link: link.href,
                  text: link.textContent || link.href,
                })
              );
              return links;
            } catch (error) {
              console.error(error);
              return [];
            }
          },
        },
        (results: any) => {
          if (results && results[0] && results[0].result) {
            setAllLinks(results[0].result);
            setShowLinks(true);
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center bg-sky-800">
      {!showLinks ? (
        <div className="m-2 p-2">
          <div className="text-2xl text-center font-extrabold m-4 p-2">
            Links
          </div>
          <div className="text-center text-xl">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded m-2 p-2"
              onClick={onclick}
            >
              Get Links
            </button>
          </div>
        </div>
      ) : (
        <div className="text-xl text-center">
          <div className="font-bold underline py-4">These are The Links</div>
          <div className="">
            {showLinks &&
              alllinks.map((linkDetail, index) => (
                <ul key={index}>
                  <li>
                    <a
                      className="hover:text-yellow-300 focus:ring"
                      href={linkDetail.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {linkDetail.text}
                    </a>
                  </li>
                </ul>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
